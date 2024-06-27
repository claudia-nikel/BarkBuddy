import { createSlice } from '@reduxjs/toolkit';

const dogsSlice = createSlice({
  name: 'dogs',
  initialState: [],
  reducers: {
    setDogs: (state, action) => {
      return action.payload;
    },
    addDog: (state, action) => {
      state.push(action.payload);
    },
    deleteDog: (state, action) => {
      return state.filter(dog => dog.id !== action.payload);
    },
    updateDog: (state, action) => {
      const index = state.findIndex(dog => dog.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    }
  }
});

export const { setDogs, addDog, deleteDog, updateDog } = dogsSlice.actions;
export default dogsSlice.reducer;
