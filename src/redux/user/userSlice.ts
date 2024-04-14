import { createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IAxiosFetchWithTokenRefresh, ISessionState, ISignUpResponse, ISignUpBody, IUser} from "../../types/interfaces";
import {axiosFetchWithTokenRefresh, token} from "../../services/axiosFetch";
import {authErrorHandler, authSuccessNotification} from "../../utils";
import {Dispatch} from "react";
import {ACCESS_LEVELS} from "../../types/enums";
import {customLocalStorage} from "../../utils/storage";
import {errorNotification} from "../../utils/authErrorHandler";


const initialState:ISessionState = {
    user: {
        id: "",
        name: '',
        email: '',
        access_level: ACCESS_LEVELS.restricted,
    },
    isCollapsed: true,
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
        setCollapsed: (state, action: PayloadAction<boolean>) => {
            state.isCollapsed = action.payload;
        },
    },
});

export const {
    setUser,
    setLoginStatus,
    setLoading,
    setCollapsed
} = sessionSlice.actions;


export const register =( body:ISignUpBody):any => async (dispatch: Dispatch<any>) => {
    let successMessage = 'You have successfully registered';
    try {
        dispatch(setLoading(true))
        const config: IAxiosFetchWithTokenRefresh = {
            method: "post",
            url: '/auth/signup',
            data:{
               ...body
            }
        }
        const result = await  axiosFetchWithTokenRefresh<ISignUpResponse>(config);
        token.set(result.accessToken);

        await  Promise.all([
            await customLocalStorage("accessToken","set",result.accessToken),
            await customLocalStorage("refreshToken","set",result.refreshToken)
        ])

        const userInRedux:IUser= {
                id: result.id,
                name: body.name,
                email: body.email,
                access_level: ACCESS_LEVELS.restricted
        }
        dispatch(setUser(userInRedux))
        dispatch(setLoginStatus(true))
        dispatch(setLoading(false))
        authSuccessNotification(successMessage, body.name);

        return body;
    } catch (error) {
        dispatch(setLoading(false))
        return authErrorHandler(error);
    }
}

export const currentUser = (): any => async (dispatch: Dispatch<any>) => {
    try {
        dispatch(setLoading(true))

        const accessToken = await customLocalStorage<string>("accessToken","get");

        console.log('get current user accessToken',accessToken)
        if(!accessToken){
           return  errorNotification("Access Denied")
        }

        token.set(accessToken);

        const userInRedux:IUser= {
            id: "661bd939742bb5da8929739a",
            name: "Test",
            email:"yuskiv280478@gmail.com",
            access_level: ACCESS_LEVELS.restricted
        }
        dispatch(setUser(userInRedux))
        dispatch(setLoginStatus(true))
        dispatch(setLoading(false))

    } catch (error) {
        dispatch(setLoading(false))
        return authErrorHandler(error);
    }
}

export default sessionSlice.reducer;
