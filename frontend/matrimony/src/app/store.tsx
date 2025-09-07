import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApi';
import authReducer from '../features/auth/authSlice';
import { formApi } from '../features/form/formApi';
import formReducer from '../features/form/formSlice';
import { imageApi } from '../features/image/imageApi';
// import imageReducer from '../features/image/imageslice'; // ✅ Add this
import imageReducer from '../features/image/imageslice'; // ✅ Correct import

import { profileApi } from '../features/profile/profileApi';

import profileReducer from '../features/profile/profileSlice';

import profileUiReducer from '../features/profileui/profileUISlice';

import profileUIEditReducer from "../features/profileeditui/profileUIEditSlice";
import editFormReducer from "../features/editform/editFormSlice";
import { editFormApi } from '../features/editform/editFormApi';





export const store = configureStore({
  reducer: {
    auth: authReducer,
    form: formReducer,
    image: imageReducer,
    profile: profileReducer,
    profileUi: profileUiReducer,
    profileUIEdit: profileUIEditReducer,
     editForm: editFormReducer,



    [authApi.reducerPath]: authApi.reducer,
    [formApi.reducerPath]: formApi.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [editFormApi.reducerPath]: editFormApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, formApi.middleware, imageApi.middleware, profileApi.middleware,  editFormApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
