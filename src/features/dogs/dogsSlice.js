import { createSlice } from '@reduxjs/toolkit';

export const dogsSlice = createSlice({
  name: 'dogs',
  initialState: [],
  reducers: {
    addDog: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { addDog } = dogsSlice.actions;

export default dogsSlice.reducer;
