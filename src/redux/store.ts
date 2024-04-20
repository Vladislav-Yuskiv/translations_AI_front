import { configureStore} from "@reduxjs/toolkit";
import {
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import { userSlice } from "./user";
import {bundleSlice} from "./bundles";


const middleware = {
    serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
};


export const store = configureStore({
    reducer: {
        session: userSlice,
        bundles: bundleSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(middleware),
    devTools: process.env.NODE_ENV === "development",
});

export const persistor = persistStore(store);
