import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const DogDetail = () => {
  const { id } = useParams();
  const dog = useSelector((state) => state.dogs.find((dog) => dog.id === id));

  if (!dog) {
    return <h2>Dog not found</h2>;
  }

  return (
    <div>
      <h1>{dog.name}</h1>
      <p>{dog.info}</p>
      {dog.image && <img src={dog.image} alt={dog.name} />}
    </div>
  );
};

export default DogDetail;
