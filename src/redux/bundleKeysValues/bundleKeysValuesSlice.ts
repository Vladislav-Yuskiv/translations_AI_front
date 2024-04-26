import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    IAxiosFetchWithTokenRefresh,
    IBundleKeyValue,
    IBundlesKeysValuesState
} from "../../types/interfaces";
import {Dispatch} from "react";
import {axiosFetchWithTokenRefresh} from "../../services/axiosFetch";
import {authErrorHandler} from "../../utils";

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


export default bundleKeysValuesSlice.reducer