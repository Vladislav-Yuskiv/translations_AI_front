import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ISessionState} from "../../types/interfaces";

const initialState:ISessionState = {
    user: {
        name: '',
        email: '',
        access_level: "free",
    },
    isLoggedIn: false,
    loading: false,
};

export const sessionSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<ISessionState["user"]>) => {
            state.user = action.payload;
        },
        setLoginStatus: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const {
    setUser,
    setLoginStatus,
    setLoading
} = sessionSlice.actions;

export default sessionSlice.reducer;
