import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    IAxiosFetchWithTokenRefresh,
    IBundleKeyValue,
    IBundlesKeysValuesState,
    IUpdateKeyValueResponse
} from "../../types/interfaces";
import {Dispatch} from "react";
import {axiosFetchWithTokenRefresh} from "../../services/axiosFetch";
import {authErrorHandler, authSuccessNotification} from "../../utils";

const initialState:IBundlesKeysValuesState = {
    keysValues: [],
    keysValuesLoading: false,
    keyValueProcessing: false,
};

export const bundleKeysValuesSlice = createSlice({
    name: "bundlesKeysValues",
    initialState,
    reducers: {
        setKeysValues: (state, action: PayloadAction<IBundlesKeysValuesState["keysValues"]>) => {
            state.keysValues = action.payload;
        },
        setKeysValuesLoading: (state,  action: PayloadAction<boolean>) => {
            state.keysValuesLoading = action.payload;
        },
        setKeyValueProcessing: (state,  action: PayloadAction<boolean>) => {
            state.keyValueProcessing = action.payload;
        },
    },
});

export const {
    setKeysValues,
    setKeysValuesLoading,
    setKeyValueProcessing,
} = bundleKeysValuesSlice.actions;


export const getValuesByKeyIds = (bundleId:string,language:string,translationsKeysIds:string[]):any => async (dispatch: Dispatch<any>) => {
    try {
        dispatch(setKeysValuesLoading(true))

        const config: IAxiosFetchWithTokenRefresh = {
            method: "post",
            url: `/bundles/${bundleId}/translationKeys/values?language=${language}`,
            data: {
                translationsKeysIds: [ ...translationsKeysIds ]
            }
        }

        const result = await  axiosFetchWithTokenRefresh<IBundleKeyValue[]>(config);

        dispatch(setKeysValues(result))
        dispatch(setKeysValuesLoading(false))

    } catch (error) {
        dispatch(setKeysValuesLoading(false))
        return authErrorHandler(error);
    }
}

export const updateTranslationKeyValue=( bundleId:string, translationValueId:string , payload: Partial<IBundleKeyValue>):any => async (dispatch: Dispatch<any>,getState: any) => {
    try {
        dispatch(setKeyValueProcessing(true))
        const config: IAxiosFetchWithTokenRefresh = {
            method: "put",
            url: `/bundles/${bundleId}/translationKeys/values/${translationValueId}`,
            data: {
                payload: {
                    ...payload
                }
            }
        }

        const result = await  axiosFetchWithTokenRefresh<IUpdateKeyValueResponse>(config)

        const keysValues: IBundleKeyValue[] = getState().bundlesKeysValues.keysValues

        const filteredKeysValues =  keysValues.map(keyValue => {
            if(keyValue._id == result.translationKeyValue._id){
                return result.translationKeyValue
            }else{
                return keyValue
            }
        })

        dispatch(setKeysValues(filteredKeysValues))

        authSuccessNotification(result.message);
        dispatch(setKeyValueProcessing(false))
    }catch (error) {
        console.log("Error in deleteTranslationKey",error)
        dispatch(setKeyValueProcessing(false))
        return authErrorHandler(error);
    }
}

export default bundleKeysValuesSlice.reducer