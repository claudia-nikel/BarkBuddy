import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateDog } from '../features/dogs/dogsSlice'; // Import the updateDog action
import './DogDetail.css';

const DogDetail = () => {
  const { id } = useParams();
  const dog = useSelector(state => state.dogs.find(dog => dog.id === id));
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [color, setColor] = useState('');
  const [nickname, setNickname] = useState('');
  const [owner, setOwner] = useState('');
  const [breed, setBreed] = useState('');

  useEffect(() => {
    if (dog) {
      setName(dog.name);
      setAge(dog.age);
      setGender(dog.gender);
      setColor(dog.color);
      setNickname(dog.nickname);
      setOwner(dog.owner);
      setBreed(dog.breed);
    }
  }, [dog]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateDog({ id, name, age, gender, color, nickname, owner, breed }));
    setEditMode(false); // Exit edit mode after saving changes
  };

  if (!dog) {
    return <div>Dog not found</div>;
  }

  return (
    <div className="dog-detail-container">
      <h1>Dog Details</h1>
      {!editMode ? (
        <div>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Age:</strong> {age}</p>
          <p><strong>Gender:</strong> {gender}</p>
          <p><strong>Color:</strong> {color}</p>
          <p><strong>Nickname:</strong> {nickname}</p>
          <p><strong>Owner:</strong> {owner}</p>
          <p><strong>Breed:</strong> {breed}</p>
          <button onClick={() => setEditMode(true)} className="edit-button">Edit</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-row">
            <label>Age:</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div className="form-row">
            <label>Gender:</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="form-row">
            <label>Color:</label>
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
          <div className="form-row">
            <label>Nickname:</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </div>
          <div className="form-row">
            <label>Owner:</label>
            <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} />
          </div>
          <div className="form-row">
            <label>Breed:</label>
            <input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} />
          </div>
          <button type="submit" className="submit-button">Save Changes</button>
        </form>
      )}
    </div>
  );
};

export default DogDetail;
