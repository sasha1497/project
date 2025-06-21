// import { configureStore } from '@reduxjs/toolkit';
// import formReducer from '../features/form/formSlice';
// import { formApi } from '../features/form/formApi';

// export const store = configureStore({
//   reducer: {
//     form: formReducer,
//     [formApi.reducerPath]: formApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(formApi.middleware),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApi';
import authReducer from '../features/auth/authSlice';
import { formApi } from '../features/form/formApi';
import formReducer from '../features/form/formSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    form: formReducer,
    [authApi.reducerPath]: authApi.reducer,
    [formApi.reducerPath]: formApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, formApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
