import { createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
    IAxiosFetchWithTokenRefresh,
    ISessionState,
    ISignUpResponse,
    ISignUpBody,
    IUser,
    IChangePasswordBody,
    IChangePasswordResponse,
    ICurrentUserResponse,
    IUpdateUserBody,
    IUpdateUserResponse,
    ILoginBody,
    ILoginResponse
} from "../../types/interfaces";
import {axiosFetchWithTokenRefresh, token} from "../../services/axiosFetch";
import {authErrorHandler, authSuccessNotification} from "../../utils";
import {Dispatch} from "react";
import {ACCESS_LEVELS} from "../../types/enums";
import {customLocalStorage} from "../../utils/storage";
import axios from "axios";


const initialState:ISessionState = {
    user: {
        id: "",
        name: '',
        email: '',
        access_level: ACCESS_LEVELS.restricted,
    },
    showUnsaved: false,
    refreshLoading: false,
    loginLoading: false,
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
        setRefreshLoading: (state, action: PayloadAction<boolean>) => {
            state.refreshLoading = action.payload;
        },
        setShowUnsaved: (state, action: PayloadAction<boolean>) => {
            state.showUnsaved = action.payload;
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
        setLoginLoading: (state, action: PayloadAction<boolean>) => {
            state.loginLoading = action.payload;
        },
    },
});

export const {
    setUser,
    setLoginStatus,
    setLoading,
    setCollapsed,
    setRefreshLoading,
    setLoginLoading,
    setShowUnsaved
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
            await customLocalStorage("refreshToken","set",result.refreshToken),
            await customLocalStorage("translaticId","set",result.id)
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

export const login = ( body:ILoginBody):any => async (dispatch: Dispatch<any>) => {
    let successMessage = 'You have successfully logged in';
    try {
        dispatch(setLoginLoading(true))

        const config = {
            method: "post",
            url: '/auth/login',
            data:{
                ...body
            }
        }

        const result = await axios.request<ILoginResponse>(config);

        const data = result.data


        token.set(data.accessToken);

        await  Promise.all([
            await customLocalStorage("accessToken","set",data.accessToken),
            await customLocalStorage("refreshToken","set",data.refreshToken),
            await customLocalStorage("translaticId","set",data.userId)
        ])

        await dispatch(currentUser())

        dispatch(setLoginLoading(false))

        authSuccessNotification(successMessage);

        return body;
    } catch (error) {
        dispatch(setLoginLoading(false))
        return authErrorHandler(error);
    }
}

export const currentUser = (): any => async (dispatch: Dispatch<any>) => {
    try {
        dispatch(setRefreshLoading(true))

        const accessToken = await customLocalStorage<string>("accessToken","get");
        const translaticUserId = await customLocalStorage<string>("translaticId","get");

        if(!accessToken || !translaticUserId){
            dispatch(setRefreshLoading(false))
            return
        }

        token.set(accessToken)

        const config: IAxiosFetchWithTokenRefresh = {
            method: "get",
            url: `/users/${translaticUserId}`
        }

        const result = await  axiosFetchWithTokenRefresh<ICurrentUserResponse>(config);

        const userInRedux:IUser= {
            id: result._id,
            name: result.name,
            email: result.email,
            access_level: result.access_level
        }
        dispatch(setUser(userInRedux))
        dispatch(setLoginStatus(true))
        dispatch(setRefreshLoading(false))

    } catch (error) {
        dispatch(setRefreshLoading(false))
        return authErrorHandler(error);
    }
}

export const changePassword =( body:IChangePasswordBody):any => async (dispatch: Dispatch<any>) => {
    try {

        const config: IAxiosFetchWithTokenRefresh = {
            method: "patch",
            url: '/users/changePassword',
            data:{
                ...body
            }
        }
        const result = await  axiosFetchWithTokenRefresh<IChangePasswordResponse>(config);

        authSuccessNotification(result.message);

        return body;
    } catch (error) {

        return authErrorHandler(error);
    }
}

export const logOut = ():any => async (dispatch: Dispatch<any>) => {
    try {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("translaticId")
        dispatch(setUser(initialState.user))
        dispatch(setLoginStatus(initialState.isLoggedIn))

        authSuccessNotification('Successfully logged out')
    }catch (e) {
        console.log('error in logOut',e)
    }
}
export const updateUser =( userId:string,body:IUpdateUserBody):any => async (dispatch: Dispatch<any>, getState: any) => {
    try {
        dispatch(setLoading(true))
        const config: IAxiosFetchWithTokenRefresh = {
            method: "put",
            url: `/users/${userId}`,
            data:{
               payload: {
                   ...body
               }
            }
        }
        const result = await  axiosFetchWithTokenRefresh<IUpdateUserResponse>(config);

        const userInRedux:IUser = getState().session.user
        const updatedUser: Partial<IUser> = {
            name: result.user.name,
            email: result.user.email,
        }
        dispatch(setUser({
            ...userInRedux,
            ...updatedUser
        }))
        dispatch(setShowUnsaved(false))
        dispatch(setLoading(false))
        authSuccessNotification(result.message);

        return body;
    } catch (error) {
        dispatch(setLoading(false))
        return authErrorHandler(error);
    }
}

export default sessionSlice.reducer;
