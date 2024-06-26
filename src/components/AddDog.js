import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addDog } from '../features/dogs/dogsSlice';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './AddDog.css';
import breeds from './breeds'; // Import the breeds list

const AddDog = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [color, setColor] = useState('');
  const [nickname, setNickname] = useState('');
  const [owner, setOwner] = useState('');
  const [breed, setBreed] = useState(''); // New state for breed
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = uuidv4();
    dispatch(addDog({ id, name, age, gender, color, nickname, owner, breed, image }));
    navigate('/');
  };

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="add-dog-container">
      <h1>Dog Info</h1>
      <form onSubmit={handleSubmit} className="dog-form">
        <div className="form-row">
          <label>Dog's Name:</label>
          <input type="text" placeholder="Dog's Name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Age:</label>
          <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Gender:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="form-row">
          <label>Color:</label>
          <input type="text" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Nickname:</label>
          <input type="text" placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Owner's Name:</label>
          <input type="text" placeholder="Owner's Name" value={owner} onChange={(e) => setOwner(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Breed:</label>
          <select value={breed} onChange={(e) => setBreed(e.target.value)}>
            <option value="">Select Breed</option>
            {breeds.map((breed, index) => (
              <option key={index} value={breed}>{breed}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Image:</label>
          <input type="file" onChange={handleImageChange} />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default AddDog;
