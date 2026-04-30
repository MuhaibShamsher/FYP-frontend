import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import activeIdsReducer from './slices/activeIdsSlice';
import authReducer from './slices/authSlice';
import headerReducer from './slices/headerSlice';
import scanSessionReducer from './slices/scanSessionSlice';
import { baseApi } from '@/apis';
import { 
  apiErrorMiddleware,
  scanSocketMiddleware,
  riskSocketMiddleware,
  complianceSocketMiddleware, 
} from './middleware';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'header', 'scanSession', 'activeIds'],
};

const rootReducer = combineReducers({
  activeIds: activeIdsReducer,
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
    }).concat(
      baseApi.middleware,
      apiErrorMiddleware,
      scanSocketMiddleware,
      riskSocketMiddleware,
      complianceSocketMiddleware,
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
