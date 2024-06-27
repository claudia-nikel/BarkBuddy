import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchDogs, deleteDog } from '../features/dogs/dogsSlice'; // Import fetchDogs
import './DogList.css';

const DogList = () => {
  const dogs = useSelector((state) => state.dogs);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDogs()); // Dispatch fetchDogs on component mount
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteDog(id));
  };

  return (
    <div className="dog-list">
      <h1 className="h1-title">Bark Buddy</h1>
      <Link to="/add-dog" className="add-dog-link">Add Buddy</Link>
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




