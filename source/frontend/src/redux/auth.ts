import { createSlice, ThunkAction } from "@reduxjs/toolkit";
import { AppThunk } from "./store";
import apiService from "../lib/apiService";
import { openSnackbar } from "./snackbar";

//TODO: load from local storage and populate to initialState
const initialState = {
    token: null,
    isAuthenticated: false,
    isLoading: false,
    user: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userLoading: (state) => {
            state.isLoading = true;
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            //TODO: save token to local storage
        },
        logoutSuccess: (state) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            //TODO: remove token from local storage
        },
        registerSuccess: (state, action) => {
            window.location.href = '/';
        }
    },
});

export const { userLoading, loginSuccess, logoutSuccess, registerSuccess } = authSlice.actions;

export default authSlice.reducer;

// write async actions !!!
// using thunk middleware to dispatch async actions & interact with store (fetch API)
// use useDispatch hook to dispatch actions later in components

export const login = (username: string, password: string): AppThunk => async (dispatch, getState) => {
    // dispatch userLoading action
    dispatch(userLoading());

    // fetch API
    const response = await apiService.post('/auth/login', { username, password });

    const data = await response.data;

    // dispatch loginSuccess action
    dispatch(loginSuccess(data));
};

export const logout = (): AppThunk => async (dispatch, getState) => {
    // dispatch userLoading action
    dispatch(userLoading());

    // fetch API
    const response = await apiService.post('/auth/logout');

    const data = await response.data;

    // dispatch logoutSuccess action
    dispatch(logoutSuccess());
};


interface RegisterData {
    username: string;
    password: string;
}

export const register = (input: RegisterData): AppThunk => async (dispatch, getState) => {
    //check is logined
    const { auth } = getState();

    if (auth.isAuthenticated) {
        return;
    }

    // fetch API
    apiService.post('/user/register', { ...input }).then((response) => {
        const data = response.data;

        // we not gonna login user after registration, we will redirect to login page instead
        dispatch(registerSuccess(data))
    }).catch((error) => {
        dispatch(openSnackbar(error.response.data.message));
    });
};
