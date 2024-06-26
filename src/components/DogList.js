import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DogList = () => {
  const dogs = useSelector((state) => state.dogs);

  return (
    <div>
      <h1>Dog Dictionary</h1>
      <Link to="/add-dog">Add a Dog</Link>
      <ul>
        {dogs.map((dog) => (
          <li key={dog.id}>
            <Link to={`/dog/${dog.id}`}>{dog.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DogList;
