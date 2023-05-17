import { configureStore, ThunkAction, Action, } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import authReducer from './auth'

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
})

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
