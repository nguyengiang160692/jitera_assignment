import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    message: '',
}

export const snackbarSlice = createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        openSnackbar: (state, action) => {
            console.log('open snackbar');

            state.open = true;
            state.message = action.payload;
        },
        closeSnackbar: (state) => {
            console.log('close snackbar');

            state.open = false;
            state.message = '';
        },
    },
});

export const { openSnackbar, closeSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
