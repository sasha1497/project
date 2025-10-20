// import { configureStore } from '@reduxjs/toolkit';
// import { authApi } from '../features/auth/authApi';
// import authReducer from '../features/auth/authSlice';
// import { formApi } from '../features/form/formApi';
// import formReducer from '../features/form/formSlice';
// import { imageApi } from '../features/image/imageApi';
// // import imageReducer from '../features/image/imageslice'; // ✅ Add this
// import imageReducer from '../features/image/imageslice'; // ✅ Correct import

// import { profileApi } from '../features/profile/profileApi';

// import profileReducer from '../features/profile/profileSlice';

// import profileUiReducer from '../features/profileui/profileUISlice';

// import profileUIEditReducer from "../features/profileeditui/profileUIEditSlice";
// import editFormReducer from "../features/editform/editFormSlice";
// import { editFormApi } from '../features/editform/editFormApi';





// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     form: formReducer,
//     image: imageReducer,
//     profile: profileReducer,
//     profileUi: profileUiReducer,
//     profileUIEdit: profileUIEditReducer,
//      editForm: editFormReducer,



//     [authApi.reducerPath]: authApi.reducer,
//     [formApi.reducerPath]: formApi.reducer,
//     [imageApi.reducerPath]: imageApi.reducer,
//     [profileApi.reducerPath]: profileApi.reducer,
//     [editFormApi.reducerPath]: editFormApi.reducer,

//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(authApi.middleware, formApi.middleware, imageApi.middleware, profileApi.middleware,  editFormApi.middleware),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApi';
import authReducer from '../features/auth/authSlice';
import { formApi } from '../features/form/formApi';
import formReducer from '../features/form/formSlice';
import { imageApi } from '../features/image/imageApi';
import imageReducer from '../features/image/imageslice';
import { profileApi } from '../features/profile/profileApi';
import profileReducer from '../features/profile/profileSlice';
import profileUiReducer from '../features/profileui/profileUISlice';
import profileUIEditReducer from "../features/profileeditui/profileUIEditSlice";
import editFormReducer from "../features/editform/editFormSlice";
import { editFormApi } from '../features/editform/editFormApi';
import otpReducer from '../features/otp/otpSlice'
import deleteAccountReducer from "../features/deleteaccount/deleteAccountSlice";
import { deleteAccountApi } from "../features/deleteaccount/deleteAccountApi";



// ✅ New import
import { otpApi } from '../features/otp/otpApi';
import viewReducer from '../features/view/viewSlice';
import { viewApi } from '../features/view/viewApi';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    form: formReducer,
    image: imageReducer,
    profile: profileReducer,
    profileUi: profileUiReducer,
    profileUIEdit: profileUIEditReducer,
    editForm: editFormReducer,
    otp: otpReducer,
    view: viewReducer,
    deleteAccount: deleteAccountReducer,


    [authApi.reducerPath]: authApi.reducer,
    [formApi.reducerPath]: formApi.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [editFormApi.reducerPath]: editFormApi.reducer,
    [otpApi.reducerPath]: otpApi.reducer,
    [viewApi.reducerPath]: viewApi.reducer,
    [deleteAccountApi.reducerPath]: deleteAccountApi.reducer,


  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      formApi.middleware,
      imageApi.middleware,
      profileApi.middleware,
      editFormApi.middleware,
      otpApi.middleware,
      viewApi.middleware,
      deleteAccountApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
