import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Save REACT_APP_API_URL in env variable
const apiUrl = process.env.REACT_APP_API_URL;

// Thunks for async actions
export const fetchDogs = createAsyncThunk('dogs/fetchDogs', async (userId, { getState }) => {
  const { getAccessTokenSilently } = getState();
  const token = await getAccessTokenSilently();
  const response = await axios.get(`${apiUrl}/api/dogs?user_id=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
});

export const addDog = createAsyncThunk('dogs/addDog', async (dog, { getState }) => {
  const { getAccessTokenSilently } = getState();
  const token = await getAccessTokenSilently();
  const response = await axios.post(`${apiUrl}/api/dogs`, dog, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
});

export const updateDog = createAsyncThunk('dogs/updateDog', async (dog, { getState }) => {
  const { getAccessTokenSilently } = getState();
  const token = await getAccessTokenSilently();
  const response = await axios.put(`${apiUrl}/api/dogs/${dog.id}`, dog, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
});

export const deleteDog = createAsyncThunk('dogs/deleteDog', async (id, { getState }) => {
  const { getAccessTokenSilently } = getState();
  const token = await getAccessTokenSilently();
  await axios.delete(`${apiUrl}/api/dogs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return id;
});

export const fetchDogCount = createAsyncThunk('dogs/fetchDogCount', async (userId, { getState }) => {
  const { getAccessTokenSilently } = getState();
  const token = await getAccessTokenSilently();
  const response = await axios.get(`${apiUrl}/api/dogs/count?user_id=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.count;
});

const dogsSlice = createSlice({
  name: 'dogs',
  initialState: {
    dogs: [],
    count: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDogs.fulfilled, (state, action) => {
        state.dogs = action.payload;
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







