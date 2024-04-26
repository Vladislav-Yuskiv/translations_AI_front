import { configureStore} from "@reduxjs/toolkit";
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import { userSlice } from "./user";
import {bundleSlice} from "./bundles";
import {bundleKeysSlice} from "./bundleKeys";
import {bundleKeysValuesSlice} from "./bundleKeysValues";


const middleware = {
    serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
};


export const store = configureStore({
    reducer: {
        session: userSlice,
        bundles: bundleSlice,
        keys: bundleKeysSlice,
        bundlesKeysValues:bundleKeysValuesSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(middleware),
    devTools: process.env.NODE_ENV === "development",
});
