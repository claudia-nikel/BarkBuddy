import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchDogs, fetchDogCount, deleteDog } from '../features/dogs/dogsSlice';
import './DogList.css';

const DogList = () => {
  const { user } = useAuth0();
  const dogs = useSelector((state) => state.dogs.dogs);
  const count = useSelector((state) => state.dogs.count);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchDogs(user.sub));
      dispatch(fetchDogCount(user.sub));
    }
  }, [dispatch, user]);

  const handleDelete = (id) => {
    dispatch(deleteDog(id));
  };

  return (
    <div className="dog-list">
      <h1 className="h1-title">Bark Buddy</h1>
      <div className="header-actions">
        <Link to="/add-dog" className="add-dog-link">Add Buddy</Link>
        <div className="dog-count">Total Dogs: {count}</div>
      </div>
      <ul>
        {dogs && dogs.length > 0 ? (
          dogs.map((dog) => (
            <li key={dog.id} className="dog-item">
              <Link to={`/dog/${dog.id}`}>{dog.name}</Link>
              <span className="dog-breed">{dog.breed}</span>
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













