// src/components/MyDogs.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchDogs } from '../features/dogs/dogsSlice';
import './MyDogs.css';

const MyDogs = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const dogs = useSelector((state) => state.dogs.dogs.filter(dog => dog.owner === user.name));
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          dispatch(fetchDogs({ getAccessTokenSilently }));
        } catch (error) {
          console.error('Error fetching token:', error);
        }
      }
    };

    fetchData();
  }, [dispatch, user, getAccessTokenSilently]);

  return (
    <div className="my-dogs">
      <h1 className="h1-title">My Dogs</h1>
      <ul>
        {dogs && dogs.length > 0 ? (
          dogs.map((dog) => (
            <li key={dog.id} className="dog-item">
              <Link to={`/dog/${dog.id}`} className="dog-link">
                <div className="dog-item-content">
                  <span className="dog-name">{dog.name}</span>
                  <span className="dog-breed">{dog.breed}</span>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <p>No dogs found</p>
        )}
      </ul>
      <Link to="/add-dog" className="add-dog-link">Add a Dog</Link>
    </div>
  );
};

export default MyDogs;
