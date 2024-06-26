import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const DogDetail = () => {
  const { id } = useParams();
  const dog = useSelector(state => state.dogs.find(dog => dog.id === id));

  if (!dog) {
    return <h2>Dog not found</h2>;
  }

  return (
    <div>
      <h1>{dog.name}</h1>
      <p>Age: {dog.age}</p> {/* Display age */}
      <p>Gender: {dog.gender}</p> {/* Display gender */}
      <p>Color: {dog.color}</p> {/* Display color */}
      <p>Nickname: {dog.nickname}</p> {/* Display nickname */}
      <p>Owner: {dog.owner}</p> {/* Display owner's name */}
      {dog.image && <img src={dog.image} alt={dog.name} style={{ width: "300px", height: "300px" }} />} {/* Display image if available */}
    </div>
  );
};

export default DogDetail;
