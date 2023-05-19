import { createSlice, ThunkAction } from "@reduxjs/toolkit";
import { AppThunk } from "./store";
import apiService, { setAuthToken } from "../lib/apiService";
import { openSnackbar } from "./snackbar";

// use it to define state type instead ! I know in real world, we can not use this because maybe FE project is on different repo
import { IUser } from '../../../backend/src/model/model'

const localToken = window.localStorage.getItem('token');
const user = window.localStorage.getItem('user');

if (localToken) {
    setAuthToken(localToken);
    console.log('Go to dashboard');

    if (window.location.pathname === '/login' || window.location.pathname === '/register') {
        window.location.href = '/auction';
    }
} else {
    console.log('Go to login page');
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
}

const initialState = {
    token: localToken || null,
    isAuthenticated: false,
    isLoading: false,
    user: user ? JSON.parse(user) : null,
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
            state.token = action.payload.token;
            // not set info yet, we will use API info to get user info later
            //
            //set the header with the token
            setAuthToken(action.payload.token)
            window.localStorage.setItem('token', action.payload.token);
        },
        loadProfileSuccess: (state, action) => {
            state.user = action.payload.data;
            window.localStorage.setItem('user', JSON.stringify(action.payload.data));
        },
        logoutSuccess: (state) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            window.localStorage.removeItem('token');
        },
        registerSuccess: (state, action) => {
            window.location.href = '/';
        }
    },
});

export const { userLoading, loginSuccess, logoutSuccess, registerSuccess, loadProfileSuccess } = authSlice.actions;

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
    const response = await apiService.post('/auth/login', { ...input }).then((response) => {
        const data = response.data.data;

        // dispatch loginSuccess action
        dispatch(loginSuccess(data));
        dispatch(openSnackbar({
            message: 'Login success!',
            severity: 'success',
        }));

        dispatch(loadProfile());

        window.location.href = '/auction';
    }).catch((err) => {
        dispatch(openSnackbar({
            message: err.message,
            severity: 'error',
        }));
    });
};

export const loadProfile = (): AppThunk => async (dispatch, getState) => {
    // dispatch userLoading action
    dispatch(userLoading());

    // fetch API
    const response = await apiService.get('/auth/profile');

    const data = await response.data;

    // dispatch loadProfileSuccess action
    dispatch(loadProfileSuccess(data));
}

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
    apiService.post('/auth/register', { ...input }).then((response) => {
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