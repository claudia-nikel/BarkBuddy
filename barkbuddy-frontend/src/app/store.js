import { configureStore } from '@reduxjs/toolkit';
import dogsReducer from '../features/dogs/dogsSlice';

export const store = configureStore({
  reducer: {
    dogs: dogsReducer,
  },
});