import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

export const fetchDogs = createAsyncThunk('dogs/fetchDogs', async ({ getAccessTokenSilently }) => {
  try {
    console.log('Redux Thunk - getAccessTokenSilently:', getAccessTokenSilently);

    if (!getAccessTokenSilently) {
      throw new Error('getAccessTokenSilently is undefined in fetchDogs');
    }

    const token = await getAccessTokenSilently();
    console.log('Redux Thunk - JWT Token:', token);

    const response = await axios.get(`${apiUrl}/api/dogs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Redux Thunk Error:', error.message);
    throw error;
  }
});

export const addDog = createAsyncThunk('dogs/addDog', async ({ dog, getAccessTokenSilently }) => {
  try {
    console.log('Redux Thunk - getAccessTokenSilently:', getAccessTokenSilently);

    if (!getAccessTokenSilently) {
      throw new Error('getAccessTokenSilently is undefined in addDog');
    }

    const token = await getAccessTokenSilently();
    console.log('Redux Thunk - JWT Token:', token);

    const response = await axios.post(`${apiUrl}/api/dogs`, dog, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Redux Thunk Error:', error.message);
    throw error;
  }
});

export const updateDog = createAsyncThunk('dogs/updateDog', async ({ dog, getAccessTokenSilently }) => {
  try {
    console.log('Redux Thunk - getAccessTokenSilently:', getAccessTokenSilently);

    if (!getAccessTokenSilently) {
      throw new Error('getAccessTokenSilently is undefined in updateDog');
    }

    const token = await getAccessTokenSilently();
    console.log('Redux Thunk - JWT Token:', token);

    const response = await axios.put(`${apiUrl}/api/dogs/${dog.id}`, dog, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Redux Thunk Error:', error.message);
    throw error;
  }
});

export const deleteDog = createAsyncThunk('dogs/deleteDog', async ({ id, getAccessTokenSilently }) => {
  try {
    console.log('Redux Thunk - getAccessTokenSilently:', getAccessTokenSilently);

    if (!getAccessTokenSilently) {
      throw new Error('getAccessTokenSilently is undefined in deleteDog');
    }

    const token = await getAccessTokenSilently();
    console.log('Redux Thunk - JWT Token:', token);

    await axios.delete(`${apiUrl}/api/dogs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return id;
  } catch (error) {
    console.error('Redux Thunk Error:', error.message);
    throw error;
  }
});

export const fetchDogCount = createAsyncThunk('dogs/fetchDogCount', async ({ getAccessTokenSilently }) => {
  try {
    console.log('Redux Thunk - getAccessTokenSilently:', getAccessTokenSilently);

    if (!getAccessTokenSilently) {
      throw new Error('getAccessTokenSilently is undefined in fetchDogCount');
    }

    const token = await getAccessTokenSilently();
    console.log('Redux Thunk - JWT Token:', token);

    const response = await axios.get(`${apiUrl}/api/dogs/count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.count;
  } catch (error) {
    console.error('Redux Thunk Error:', error.message);
    throw error;
  }
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
        state.count += 1;
      })
      .addCase(updateDog.fulfilled, (state, action) => {
        const index = state.dogs.findIndex((dog) => dog.id === action.payload.id);
        state.dogs[index] = action.payload;
      })
      .addCase(deleteDog.fulfilled, (state, action) => {
        state.dogs = state.dogs.filter((dog) => dog.id !== action.payload);
        state.count -= 1;
      })
      .addCase(fetchDogCount.fulfilled, (state, action) => {
        state.count = action.payload;
      });
  },
});

export default dogsSlice.reducer;







