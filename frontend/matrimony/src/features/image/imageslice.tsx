// src/features/image/imageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ImageState {
  images: string[]; // You can store URLs or filenames after upload
}

const initialState: ImageState = {
  images: [],
};

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<string[]>) => {
      state.images = action.payload;
    },
    addImage: (state, action: PayloadAction<string>) => {
      state.images.push(action.payload);
    },
    resetImages: (state) => {
      state.images = [];
    },
  },
});

export const { setImages, addImage, resetImages } = imageSlice.actions;

export default imageSlice.reducer;
