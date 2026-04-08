import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import headerReducer from './slices/headerSlice';
import scanSessionReducer from './slices/scanSessionSlice';
import { baseApi } from './apis/baseApi';
import { apiErrorMiddleware } from './middleware/apiErrorMiddleware';
import { scanSocketMiddleware } from './middleware/scanSocketMiddleware';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'header', 'scanSession'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  header: headerReducer,
  scanSession: scanSessionReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(baseApi.middleware, apiErrorMiddleware, scanSocketMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
