import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { useModal } from '@ebay/nice-modal-react';
import bidModal from '../modal/bidModal';
import { useEffect } from 'react';
import { RootState, useAppDispatch } from '../../redux/store';
import { fetchItems, selectedItem } from '../../redux/item';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'

const ItemDataTable = () => {
    const dispatch = useAppDispatch()
    const paginate = useSelector((state: RootState) => state.item.paginate)

    dayjs.extend(relativeTime)

    useEffect(() => {
        dispatch(fetchItems())
    }, []);

    const bidModalTrigger = useModal(bidModal);

    const bidHandleClick = (row: any) => {
        bidModalTrigger.show()
        dispatch(selectedItem(row))
    }

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 3,
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
            field: 'publishAt',
            headerName: 'Publish At',
            flex: 2,
            renderCell: (params: GridRenderCellParams) => (params.row.publishAt ? dayjs(params.row.publishAt).fromNow() : '')
        },
        {
            field: 'action',
            headerName: 'Bid',
            align: 'right',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Button
                    variant="contained"
                    size="small"
                    disabled={params.row.status !== 1}
                    style={{ marginLeft: 16 }}
                    tabIndex={params.hasFocus ? 0 : -1}
                    onClick={() => bidHandleClick(params.row)}
                >
                    Bid
                </Button>
            )
        },
    ];

    return <>
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