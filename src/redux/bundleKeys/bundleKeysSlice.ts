import { createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
    IBundleKeysState,
    IAxiosFetchWithTokenRefresh,
    IBundleKy,
    IBundleInfoResponse,
    IDefaultResponse,
    IUpdateKeyResponse,
    IBundleKeyValue
} from "../../types/interfaces";
import {Dispatch} from "react";
import {authErrorHandler, authSuccessNotification} from "../../utils";
import {axiosFetchWithTokenRefresh} from "../../services/axiosFetch";

const initialState:IBundleKeysState = {
    keysLoading: false,
    keysInfoLoading: false,
    processKeyLoading:false,
    keysInfo: {},
    keys: {},
    pagination: {}
};

export const bundleKeysSlice = createSlice({
    name: "keys",
    initialState,
    reducers: {
        setKeys: (state, action: PayloadAction<IBundleKeysState["keys"]>) => {
            state.keys = action.payload;
        },
        setKeysLoading: (state, action: PayloadAction<boolean>) => {
            state.keysLoading = action.payload;
        },
        setKeysInfoLoading: (state, action: PayloadAction<boolean>) => {
            state.keysInfoLoading = action.payload;
        },
        setKeysInfo: (state, action: PayloadAction<IBundleKeysState["keysInfo"]>) => {
            state.keysInfo = action.payload;
        },
        setPagination: (state, action: PayloadAction<IBundleKeysState["pagination"]>) => {
            state.pagination = action.payload;
        },
        setProcessKeyLoading: (state, action: PayloadAction<boolean>) => {
            state.processKeyLoading = action.payload;
        },
    },
});

export const {
    setKeysLoading,
    setKeys,
    setProcessKeyLoading,
    setKeysInfo,
    setPagination,
    setKeysInfoLoading
} = bundleKeysSlice.actions;


export const getKeysByBundleId = (bundleId: string, bundlePagination: { page: number, limit: number }): any => async (dispatch: Dispatch<any>, getState: any) => {
    try {

        dispatch(setKeysLoading(true))

        const config: IAxiosFetchWithTokenRefresh = {
            method: "get",
            url: `/bundles/${bundleId}/translationKeys?page=${bundlePagination.page}&limit=${bundlePagination.limit}`,
        }

        const result = await  axiosFetchWithTokenRefresh<IBundleKy[]>(config);

        const  otherKeys = getState().keys.keys
        const  pagination = getState().keys.pagination

        dispatch(setKeys({
           ...otherKeys,
           [bundleId]: result
        }))

        dispatch(setPagination({
            ...pagination,
            [bundleId]: {
                page: bundlePagination.page,
                limit: bundlePagination.limit
            }
        }))

        dispatch(setKeysLoading(false))

    }catch (error) {
        console.log("Error in getAllKeysByBundleId",error)
        dispatch(setKeysLoading(false))
        return authErrorHandler(error);
    }
}

export const getBundleInfo=( bundleId:string):any => async (dispatch: Dispatch<any>,getState: any) => {
    try {
        dispatch(setKeysInfoLoading(true))
        const config: IAxiosFetchWithTokenRefresh = {
            method: "get",
            url: `/bundles/${bundleId}/translationKeys/info`,
        }

        const result = await  axiosFetchWithTokenRefresh<IBundleInfoResponse>(config);

        const  otherKeysInfo = getState().keys.keysInfo

        dispatch(setKeysInfo({
            ...otherKeysInfo,
            [bundleId]: result
        }))
        dispatch(setKeysInfoLoading(false))
    }catch (error) {
        console.log("Error in getAllKeysByBundleId",error)
        dispatch(setKeysInfoLoading(false))
        return authErrorHandler(error);
    }
}

export const deleteTranslationKey=( bundleId:string, translationKeyId:string):any => async (dispatch: Dispatch<any>,getState: any) => {
    try {
        dispatch(setProcessKeyLoading(true))
        const config: IAxiosFetchWithTokenRefresh = {
            method: "delete",
            url: `/bundles/${bundleId}/translationKeys/${translationKeyId}`,
        }

        const result = await  axiosFetchWithTokenRefresh<IDefaultResponse>(config);

        const keysInfo = getState().keys.keysInfo
        const totalKeysForBundle = keysInfo[bundleId]

        dispatch(setKeysInfo({
            ...keysInfo,
            [bundleId]: {totalCount: totalKeysForBundle.totalCount - 1}
        }))

       const keys: {[key:string]: IBundleKy[]} = getState().keys.keys

       const keysForCurrentBundle = keys[bundleId];

       const filteredKeys =  keysForCurrentBundle.filter(key => key._id !== translationKeyId)

        dispatch(setKeys({
            ...keys,
            [bundleId]: filteredKeys
        }))

        authSuccessNotification(result.message);
        dispatch(setProcessKeyLoading(false))
    }catch (error) {
        console.log("Error in deleteTranslationKey",error)
        dispatch(setProcessKeyLoading(false))
        return authErrorHandler(error);
    }
}

export const updateTranslationKey=( bundleId:string, translationKeyId:string , payload: Partial<IBundleKy>):any => async (dispatch: Dispatch<any>,getState: any) => {
    try {
        dispatch(setProcessKeyLoading(true))
        const config: IAxiosFetchWithTokenRefresh = {
            method: "put",
            url: `/bundles/${bundleId}/translationKeys/${translationKeyId}`,
            data: {
                payload: {
                    ...payload
                }
            }
        }

        const result = await  axiosFetchWithTokenRefresh<IUpdateKeyResponse>(config)

        const keys: {[key:string]: IBundleKy[]} = getState().keys.keys

        const keysForCurrentBundle = keys[bundleId];

        const filteredKeys =  keysForCurrentBundle.map(key => {
            if(key._id == result.translationKey._id){
                return result.translationKey
            }else{
                return key
            }
        })

        dispatch(setKeys({
            ...keys,
            [bundleId]: filteredKeys
        }))

        authSuccessNotification(result.message);
        dispatch(setProcessKeyLoading(false))
    }catch (error) {
        console.log("Error in deleteTranslationKey",error)
        dispatch(setProcessKeyLoading(false))
        return authErrorHandler(error);
    }
}

export default bundleKeysSlice.reducer;
