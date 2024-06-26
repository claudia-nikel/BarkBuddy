import { createSlice } from '@reduxjs/toolkit';

export const dogsSlice = createSlice({
  name: 'dogs',
  initialState: [],
  reducers: {
    addDog: (state, action) => {
      state.push(action.payload);
    },
    deleteDog: (state, action) => {
      return state.filter(dog => dog.id !== action.payload);
    },
  },
});

export const { addDog, deleteDog } = dogsSlice.actions;
export default dogsSlice.reducer;
