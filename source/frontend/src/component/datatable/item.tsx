import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { useModal } from '@ebay/nice-modal-react';
import bidModal from '../modal/bidModal';
import { useEffect } from 'react';
import { useAppDispatch } from '../../redux/store';
import { fetchItems } from '../../redux/item';

const ItemDataTable = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchItems())
    }, []);

    const bidModalTrigger = useModal(bidModal);

    const bidHandleClick = (itemId: string) => {
        bidModalTrigger.show()
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 10 },
        {
            field: 'name',
            headerName: 'Name',
        },
        {
            field: 'startPrice',
            headerName: 'Start Price',
            type: 'number',
            width: 150,
        },
        {
            field: 'currentPrice',
            headerName: 'Current bid Price',
            type: 'number',
            width: 150,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 70,
        },
        {
            field: 'publishAt',
            headerName: 'Publish At',
            width: 100,
        },
        {
            field: 'action',
            headerName: 'Bid',
            align: 'right',
            width: 100,
            renderCell: (params: GridRenderCellParams) => (
                <Button
                    variant="contained"
                    size="small"
                    style={{ marginLeft: 16 }}
                    tabIndex={params.hasFocus ? 0 : -1}
                    onClick={() => bidHandleClick(params.row.id)}
                >
                    Bid
                </Button>
            )
        },
    ];

    //create example row data
    const rows = [
        { id: 1, name: 'Snow', description: 'Jon', startPrice: 35, status: 'Draft', publishAt: '2021-10-10' },
        { id: 2, name: 'Lannister', description: 'Cersei', startPrice: 42, status: 'Draft', publishAt: '2021-10-10' },
        { id: 3, name: 'Lannister', description: 'Jaime', startPrice: 45, status: 'Draft', publishAt: '2021-10-10' },
        { id: 4, name: 'Stark', description: 'Arya', startPrice: 16, status: 'Draft', publishAt: '2021-10-10' },
        { id: 5, name: 'Targaryen', description: 'Daenerys', startPrice: null, status: 'Draft', publishAt: '2021-10-10' },
        { id: 6, name: 'Melisandre', description: null, startPrice: 150, status: 'Draft', publishAt: '2021-10-10' },
    ];

    return <>
        <DataGrid
            rows={rows}
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