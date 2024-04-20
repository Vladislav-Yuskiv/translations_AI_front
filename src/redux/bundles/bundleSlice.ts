import {authErrorHandler, authSuccessNotification} from "../../utils";
import {Dispatch} from "react";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    IAxiosFetchWithTokenRefresh, IBundle,
    IBundlesState, IBundleUsersResponse, IDefaultResponse, IUpdateBundleResponse,
} from "../../types/interfaces";
import {axiosFetchWithTokenRefresh} from "../../services/axiosFetch";
import {setShowUnsaved} from "../user/userSlice";


const initialState:IBundlesState = {
    availableBundles: [],
    bundleUsersLoading: false,
    currentBundleUsers: [],
    loading: false,
    updateBundleLoading:false,
    deleteLoading: false,
    currentBundle: null
};

export const bundleSlice = createSlice({
    name: "bundles",
    initialState,
    reducers: {
        setAvailableBundles: (state, action: PayloadAction<IBundlesState["availableBundles"]>) => {
            state.availableBundles = action.payload;
        },
        setCurrentBundleUsers: (state, action: PayloadAction<IBundlesState["currentBundleUsers"]>) => {
            state.currentBundleUsers = action.payload;
        },
        setCurrentBundle: (state, action:PayloadAction<IBundlesState["currentBundle"]>) => {
            state.currentBundle = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setDeleteLoading: (state, action: PayloadAction<boolean>) => {
            state.deleteLoading = action.payload;
        },
        setUpdateBundleLoading: (state, action: PayloadAction<boolean>) => {
            state.updateBundleLoading = action.payload;
        },
        setBundleUsersLoading: (state, action: PayloadAction<boolean>) => {
            state.bundleUsersLoading = action.payload;
        },

    },
});

export const {
    setAvailableBundles,
    setLoading,
    setCurrentBundle,
    setUpdateBundleLoading,
    setDeleteLoading,
    setCurrentBundleUsers,
    setBundleUsersLoading
} = bundleSlice.actions;

export const getBundles = ():any => async (dispatch: Dispatch<any>) => {
    try {
        dispatch(setLoading(true))
        const config: IAxiosFetchWithTokenRefresh = {
            method: "get",
            url: `/bundles`,
        }

        const result = await  axiosFetchWithTokenRefresh<IBundle[]>(config);

        await dispatch(setCurrentBundle(result[0]))
        await dispatch(setAvailableBundles(result))
        dispatch(setLoading(false))


    } catch (error) {
        dispatch(setLoading(false))
        return authErrorHandler(error);
    }
}

export const getUsersByBundleId = (bundleId:string):any => async (dispatch: Dispatch<any>) => {
    try {
        dispatch(setBundleUsersLoading(true))
        const config: IAxiosFetchWithTokenRefresh = {
            method: "get",
            url: `/bundles/${bundleId}/users`,
        }

        const result = await  axiosFetchWithTokenRefresh<IBundleUsersResponse>(config);

        await dispatch(setCurrentBundleUsers(result.users))
        dispatch(setBundleUsersLoading(false))


    } catch (error) {
        dispatch(setBundleUsersLoading(false))
        return authErrorHandler(error);
    }
}

export const updateCurrentBundle = (bundleId:string, payload: Partial<IBundle>):any => async (dispatch: Dispatch<any>, getState: any) => {
    try {
        dispatch(setUpdateBundleLoading(true))
        const config: IAxiosFetchWithTokenRefresh = {
            method: "put",
            url: `/bundles/${bundleId}`,
            data:{
                payload: {
                    ...payload
                }
            }
        }

        const result = await  axiosFetchWithTokenRefresh<IUpdateBundleResponse>(config);

        const availableBundles:IBundle[] =  getState().bundles.availableBundles;

        dispatch(setCurrentBundle(result.translationBundle))

        const filteredBundles:IBundle[] = availableBundles.map((bundle) => {
            if(bundle._id === result.translationBundle._id){
                return  result.translationBundle
            }else{
                return bundle
            }
        })
        dispatch(setAvailableBundles([...filteredBundles]))
        dispatch(setUpdateBundleLoading(false))
        dispatch(setShowUnsaved(false))

        authSuccessNotification(result.message);

    } catch (error) {
        dispatch(setUpdateBundleLoading(false))
        return authErrorHandler(error);
    }
}

export const deleteBundleById = (bundleId:string):any => async (dispatch: Dispatch<any>,getState: any) => {
    try {
        dispatch(setDeleteLoading(true))

        const config: IAxiosFetchWithTokenRefresh = {
            method: "delete",
            url: `/bundles${bundleId}`,
        }

        const result = await  axiosFetchWithTokenRefresh<IDefaultResponse>(config);

        const availableBundles:IBundle[] =  getState().bundles.availableBundles;

        const filteredBundles = availableBundles.filter(bundle => bundle._id !== bundleId)

        await dispatch(setCurrentBundle(filteredBundles[0]))
        await dispatch(setAvailableBundles([...filteredBundles]))
        dispatch(setDeleteLoading(false))

        authSuccessNotification(result.message);

    } catch (error) {
        dispatch(setDeleteLoading(false))
        return authErrorHandler(error);
    }
}
export default bundleSlice.reducer