import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteDog } from '../features/dogs/dogsSlice';
import './DogList.css'; // Make sure the CSS file is correctly imported

const DogList = () => {
  const dogs = useSelector(state => state.dogs);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteDog(id));
  };

  return (
    <div className="dog-list">
      <h1>Bark Buddy</h1>
      <Link to="/add-dog">Add a Dog</Link>
      <ul>
        {dogs && dogs.length > 0 ? (
          dogs.map(dog => (
            <li key={dog.id} className="dog-item">
              <Link to={`/dog/${dog.id}`}>{dog.name}</Link>
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
