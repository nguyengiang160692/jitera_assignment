import { createSlice } from '@reduxjs/toolkit';
import apiService from '../lib/apiService';
import { AppThunk, store } from './store';
import { ItemStatus } from '../type/item';
import { openSnackbar } from './snackbar';
import { AxiosError } from 'axios';

const initialState = {
    items: [],
    item: {},
    loading: false,
    error: null
}

export interface IItem {
    name: string;
    description?: string;
    startPrice: number;
    status: ItemStatus;
    publishAt: string;
}

export const ItemSlice = createSlice({
    name: 'item',
    initialState,
    reducers: {
        loadingItems: (state) => {
            state.loading = true;
        },
        loadedItems: (state, action) => {
            state.loading = false;
            state.items = action.payload;
        }
    },
});

export const { loadedItems, loadingItems } = ItemSlice.actions;


// create thunk function to fetch data from backend
export const fetchItems = (): AppThunk => async (dispatch, getState) => {
    try {
        dispatch(loadingItems());

        const data = await apiService.get('/item')

        dispatch(loadedItems(data));
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


export default ItemSlice.reducer;
