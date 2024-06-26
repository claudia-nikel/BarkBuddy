import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';


const DogDetail = () => {
  const { id } = useParams();
  const dog = useSelector(state => state.dogs.find(dog => dog.id === id));

  if (!dog) {
    return <div>Dog not found</div>;
  }

  return (
    <div className="dog-detail-container">
      <h1>{dog.name}</h1>
      <p>Age: {dog.age}</p>
      <p>Gender: {dog.gender}</p>
      <p>Color: {dog.color}</p>
      <p>Nickname: {dog.nickname}</p>
      <p>Owner: {dog.owner}</p>
      <p>Breed: {dog.breed}</p>
      {dog.image && <img src={dog.image} alt={`${dog.name}`} />}
    </div>
  );
};

export default DogDetail;
