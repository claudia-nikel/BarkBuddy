import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './AddDog.css';

const AddDog = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [color, setColor] = useState('');
  const [nickname, setNickname] = useState('');
  const [owner, setOwner] = useState('');
  const [breed, setBreed] = useState('');
  const [breeds, setBreeds] = useState([]);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/breeds');
        setBreeds(response.data);
      } catch (error) {
        console.error('Failed to fetch breeds', error);
      }
    };

    fetchBreeds();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = uuidv4();
    try {
      const response = await axios.post('http://localhost:5001/api/dogs', {
        id,
        name,
        age,
        gender,
        color,
        nickname,
        owner,
        breed,
        image
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to add dog', error);
    }
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
