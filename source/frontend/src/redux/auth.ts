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

// HOW TO APP EFFECT Frontend
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

// HOW TO APP CALL Backend & interact with another store reducers

// write async actions !!!
// using thunk middleware to dispatch async actions & interact with store (fetch API)
// use useDispatch hook to dispatch actions later in components

interface LoginData {
    username: string;
    password: string;
}

interface RegisterData {
    username: string;
    password: string;
}

export const login = (input: LoginData): AppThunk => async (dispatch, getState) => {
    // dispatch userLoading action
    dispatch(userLoading());

    // fetch API
    const response = await apiService.post('/auth/login', { ...input });

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

export const register = (input: RegisterData): AppThunk => async (dispatch, getState) => {
    //check is logined
    const { auth } = getState();

    if (auth.isAuthenticated) {
        return;
    }

    // fetch API
    apiService.post('/user/register', { ...input }).then((response) => {
        const data = response.data;

        dispatch(openSnackbar({
            message: 'Successfully registered, redirect to login page in 5s',
            severity: 'success',
        }));

        // we not gonna login user after registration, we will redirect to login page instead
        setTimeout(() => {
            dispatch(registerSuccess(data))
        }, 5000);
    }).catch((error) => {
        dispatch(openSnackbar({
            message: error.response.data.message,
            severity: 'error',
        }));
    });
};