import { createSlice } from '@reduxjs/toolkit';

const dogsSlice = createSlice({
  name: 'dogs',
  initialState: [],
  reducers: {
    addDog: (state, action) => {
      state.push(action.payload);
    },
    updateDog: (state, action) => {
      const index = state.findIndex(dog => dog.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteDog: (state, action) => {
      return state.filter(dog => dog.id !== action.payload);
    },
    setDogs: (state, action) => {
      return action.payload;
    }
  }
});

export const { addDog, updateDog, deleteDog, setDogs } = dogsSlice.actions;
export default dogsSlice.reducer;

