import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Save REACT_APP_API_URL in env variable
const apiUrl = process.env.REACT_APP_API_URL;

// Thunks for async actions
export const fetchDogs = createAsyncThunk('dogs/fetchDogs', async () => {
  const response = await axios.get(`${apiUrl}/api/dogs`);
  return response.data;
});

export const addDog = createAsyncThunk('dogs/addDog', async (dog) => {
  const formData = new FormData();
  for (const key in dog) {
    if (key === 'image') {
      formData.append('image', dog[key]);
    } else {
      formData.append(key, dog[key]);
    }
  }
  const response = await axios.post(`${apiUrl}/api/dogs`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
});

export const updateDog = createAsyncThunk('dogs/updateDog', async (dog) => {
  const formData = new FormData();
  for (const key in dog) {
    if (key === 'image') {
      formData.append('image', dog[key]);
    } else {
      formData.append(key, dog[key]);
    }
  }
  const response = await axios.put(`${apiUrl}/api/dogs/${dog.id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
});

export const deleteDog = createAsyncThunk('dogs/deleteDog', async (id) => {
  await axios.delete(`${apiUrl}/api/dogs/${id}`);
  return id;
});

export const fetchDogCount = createAsyncThunk('dogs/fetchDogCount', async () => {
  const response = await axios.get(`${apiUrl}/api/dogs/count`);
  return response.data.count;
});

const dogsSlice = createSlice({
  name: 'dogs',
  initialState: {
    dogs: [],
    count: 0,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dogs = action.payload;
      })
      .addCase(fetchDogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addDog.fulfilled, (state, action) => {
        state.dogs.push(action.payload);
        state.count += 1; // Increment count on add
      })
      .addCase(updateDog.fulfilled, (state, action) => {
        const index = state.dogs.findIndex((dog) => dog.id === action.payload.id);
        state.dogs[index] = action.payload;
      })
      .addCase(deleteDog.fulfilled, (state, action) => {
        state.dogs = state.dogs.filter((dog) => dog.id !== action.payload);
        state.count -= 1; // Decrement count on delete
      })
      .addCase(fetchDogCount.fulfilled, (state, action) => {
        state.count = action.payload;
      });
  },
});

export default dogsSlice.reducer;

