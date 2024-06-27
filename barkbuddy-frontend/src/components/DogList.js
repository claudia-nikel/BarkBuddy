import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { setDogs } from '../features/dogs/dogsSlice';
import './DogList.css';

const DogList = () => {
  const dogs = useSelector(state => state.dogs);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/dogs'); // Ensure port matches your backend server port
        dispatch(setDogs(response.data));
      } catch (error) {
        console.error('Failed to fetch dogs', error);
      }
    };

    fetchDogs();
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/dogs/${id}`);
      dispatch(setDogs(dogs.filter(dog => dog.id !== id)));
    } catch (error) {
      console.error('Failed to delete dog', error);
    }
  };

  return (
    <div className="dog-list">
      <h1 className="h1-title">Bark Buddy</h1>
      <Link to="/add-dog" className="add-dog-link">Add Buddy</Link>
      <ul>
        {dogs && dogs.length > 0 ? (
          dogs.map(dog => (
            <li key={dog.id} className="dog-item">
              <Link to={`/dog/${dog.id}`}>{dog.name}</Link>
              <span>{dog.breed}</span>
              <button onClick={() => handleDelete(dog.id)} className="delete-button">Delete</button>
            </li>
          ))
        ) : (
          <p>No dogs found</p>
        )}
      </ul>
    </div>
  );
};

export default DogList;



