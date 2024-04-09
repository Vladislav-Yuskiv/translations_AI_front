import { configureStore} from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { userSlice } from "./user";


const middleware = {
    serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
};

const userPersistConfig = {
    key: "session",
    storage,
    whitelist: ["token"],
};

export const store = configureStore({
    reducer: {
        session: persistReducer(userPersistConfig, userSlice),
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(middleware),
    devTools: process.env.NODE_ENV === "development",
});

export const persistor = persistStore(store);
