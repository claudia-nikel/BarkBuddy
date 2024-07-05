import { configureStore } from '@reduxjs/toolkit';
import dogsReducer from '../features/dogs/dogsSlice';

const store = configureStore({
  reducer: {
    dogs: dogsReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

