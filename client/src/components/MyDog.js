// MyDogs.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyDogs } from '../features/dogs/dogsSlice';

const MyDogs = () => {
  const dispatch = useDispatch();
  const myDogs = useSelector((state) => state.dogs.myDogs);

  useEffect(() => {
    dispatch(fetchMyDogs());
  }, [dispatch]);

  return (
    <div className="my-dog-list">
      <h1>My Dogs</h1>
      {myDogs.length > 0 ? (
        <ul>
          {myDogs.map((dog) => (
            <li key={dog.id}>
              <p>{dog.name}</p>
              {/* Display other dog details */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No dogs found</p>
      )}
    </div>
  );
};

export default MyDogs;
