import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunks for async actions
export const fetchDogs = createAsyncThunk('dogs/fetchDogs', async () => {
  const response = await axios.get('http://localhost:5001/api/dogs');
  return response.data;
});

export const addDog = createAsyncThunk('dogs/addDog', async (dog) => {
  const response = await axios.post('http://localhost:5001/api/dogs', dog);
  return response.data;
});

export const updateDog = createAsyncThunk('dogs/updateDog', async (dog) => {
  const response = await axios.put(`http://localhost:5001/api/dogs/${dog.id}`, dog);
  return response.data;
});

export const deleteDog = createAsyncThunk('dogs/deleteDog', async (id) => {
  await axios.delete(`http://localhost:5001/api/dogs/${id}`);
  return id;
});

const dogsSlice = createSlice({
  name: 'dogs',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDogs.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(addDog.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateDog.fulfilled, (state, action) => {
        const index = state.findIndex((dog) => dog.id === action.payload.id);
        state[index] = action.payload;
      })
      .addCase(deleteDog.fulfilled, (state, action) => {
        return state.filter((dog) => dog.id !== action.payload);
      });
  },
});

export default dogsSlice.reducer;

