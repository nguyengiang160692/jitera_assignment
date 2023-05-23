import { createSlice } from '@reduxjs/toolkit';
import apiService from '../lib/apiService';
import { AppThunk, store } from './store';
import { ItemStatus } from '../type/item';
import { openSnackbar } from './snackbar';
import { Pagination } from '@mui/material';


export interface IItem {
    _id?: string;
    name: string;
    description?: string;
    startPrice: number;
    currentPrice?: number;
    status: ItemStatus;
    durationInMinutes?: number;
    publishAt?: Date;
    endAt?: Date;
    lastBidder?: {
        username: string
    }
}

export interface Pagination {
    docs: any[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    nextPage: number;
    page: number;
    pagingCounter: number;
    prevPage: number;
    totalDocs: number;
    totalPages: number;
}

export interface ItemPagination extends Pagination {
    docs: IItem[];
}

const initialState = {
    paginate: <ItemPagination>{},
    selectedItem: <IItem>{},
    loading: false,
    error: null
}

export const itemSlice = createSlice({
    name: 'item',
    initialState,
    reducers: {
        loadingItems: (state) => {
            state.loading = true;
        },
        loadedItems: (state, action) => {
            state.loading = false;
            state.paginate = action.payload;
        },
        selectedItem: (state, action) => {
            state.selectedItem = action.payload;
        }
    },
});

export default itemSlice.reducer;

export const { loadedItems, loadingItems, selectedItem } = itemSlice.actions;

// create thunk function to fetch data from backend
export const fetchItems = (): AppThunk => async (dispatch, getState) => {
    try {
        dispatch(loadingItems());

        const data = await apiService.get('/item')
        const paginate = data?.data?.data || {};

        dispatch(loadedItems(paginate));
    } catch (error) {
        console.log(error);
    }
}

export const createItem = (item: IItem, cb?: Function): AppThunk => async (dispatch, getState) => {
    try {
        await apiService.post('/item', item);

        dispatch(fetchItems());

        //dispatch snack bar action
        store.dispatch(openSnackbar({
            message: 'Create item successfully',
            severity: 'success'
        }))

        cb && cb();
    } catch (error: any) {
        console.log(error);

        store.dispatch(openSnackbar({
            message: error.response?.data?.message,
            severity: 'error'
        }))
    }
}

export const publishItem = (cb?: Function): AppThunk => async (dispatch, getState) => {

    const item = getState().item.selectedItem;

    try {
        await apiService.put(`/item/${item._id}/publish`);

        dispatch(fetchItems());

        //dispatch snack bar action
        store.dispatch(openSnackbar({
            message: 'Publish item successfully',
            severity: 'success'
        }))

        cb && cb();
    } catch (error: any) {
        console.log(error);

        store.dispatch(openSnackbar({
            message: error.response?.data?.message,
            severity: 'error'
        }))
    }
}

export const bidItem = (bidPrice: number, selectedItem: IItem): AppThunk => async (dispatch, getState) => {
    try {
        await apiService.put(`/item/${selectedItem._id}/bid`, {
            bidPrice: bidPrice
        });

        dispatch(fetchItems());

        //dispatch snack bar action
        store.dispatch(openSnackbar({
            message: 'Bid item successfully',
            severity: 'success'
        }))
    } catch (error: any) {
        console.log(error);

        store.dispatch(openSnackbar({
            message: error.response?.data?.message,
            severity: 'error'
        }))
    }
}