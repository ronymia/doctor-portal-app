import { combineReducers, configureStore, AnyAction } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import baseApi from './api/base.api';

const appReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const rootReducer = (state: any, action: AnyAction) => {
  if (action.type === 'auth/logout') {
    // Clear RTK Query cache on logout
    state = {
      ...state,
      [baseApi.reducerPath]: undefined,
    };
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
