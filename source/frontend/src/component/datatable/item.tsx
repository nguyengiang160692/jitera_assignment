
import { useModal } from '@ebay/nice-modal-react';
import { PlayArrow } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { RootState, useAppDispatch, useAppSelector } from '../../redux/store';

import { fetchItems, publishItem, selectedItem } from '../../redux/item';

import bidModal from '../modal/bidModal';
import { useEffect, useState } from 'react';


const ItemDataTable = () => {
    const dispatch = useAppDispatch()
    const paginate = useAppSelector((state: RootState) => state.item.paginate)
    const auth = useAppSelector((state: RootState) => state.auth)
    const [openDialog, setOpenDialog] = useState(false)

    useEffect(() => {
        dispatch(fetchItems())
    }, []);

    dayjs.extend(relativeTime)

    const bidModalTrigger = useModal(bidModal);

    const bidHandleClick = (row: any) => {
        bidModalTrigger.show()
        dispatch(selectedItem(row))
    }

    const openConfirmPublish = (row: any) => {
        dispatch(selectedItem(row))
        // popup a confirmation dialog
        setOpenDialog(true)
    }

    const handlePublish = () => {
        setOpenDialog(false)
        // dispatch publish item base on selected item
        dispatch(publishItem())
    }

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 3,
        },
        {
            field: 'owner',
            headerName: 'Owner',
            flex: 2,
            renderCell: (params: GridRenderCellParams) => {
                return <span>{params.row.owner.username}</span>
            }
        },
        {
            field: 'startPrice',
            headerName: 'Start Price',
            type: 'number',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                return <span>${params.row.startPrice?.toLocaleString()}</span>
            }
        },
        {
            field: 'currentPrice',
            headerName: 'Current bid Price',
            type: 'number',
            flex: 2,
            renderCell: (params: GridRenderCellParams) => {
                return <span>${params.row.currentPrice?.toLocaleString()}</span>
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                switch (params.row.status) {
                    case 0:
                        return <span>Soon</span>
                    case 1:
                        return <span>Ongoing</span>
                }
            }
        },
        {
            field: 'endAt',
            headerName: 'End in',
            flex: 2,
            renderCell: (params: GridRenderCellParams) => {
                return <span>{dayjs(params.row.endAt).fromNow()}</span>
            }
        },
        {
            field: 'action',
            headerName: 'Bid',
            align: 'right',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <>
                    {params.row.status == 0 && auth.user?.username === params.row.owner?.username && <Button
                        variant="contained"
                        color='success'
                        startIcon={<PlayArrow />}
                        size="small"
                        tabIndex={params.hasFocus ? 0 : -1}
                        onClick={() => openConfirmPublish(params.row)}
                    >
                        Publish
                    </Button>}
                    {params.row.status == 1 && auth.user?.username != params.row.owner?.username && <Button
                        variant="contained"
                        size="small"
                        style={{ marginLeft: 16 }}
                        tabIndex={params.hasFocus ? 0 : -1}
                        onClick={() => bidHandleClick(params.row)}
                    >
                        Bid
                    </Button>}
                </>
            )
        },
    ];

    return <>
        <Dialog open={openDialog} onClose={() => { setOpenDialog(false) }}>
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                Confirmation
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure want to publish this item on sell?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => { setOpenDialog(false) }}>
                    Cancel
                </Button>
                <Button color='primary' onClick={handlePublish}>Publish</Button>
            </DialogActions>
        </Dialog>
        <DataGrid
            rows={paginate.docs || []}
            getRowId={(row) => row._id}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                },
            }}
            pageSizeOptions={[5, 10]}
        />
    </>
}


export default ItemDataTable;