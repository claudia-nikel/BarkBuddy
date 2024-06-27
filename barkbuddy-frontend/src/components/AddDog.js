import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addDog } from '../features/dogs/dogsSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Papa from 'papaparse';
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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch('http://localhost:5001/dog_breeds.csv');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        const results = Papa.parse(csv, { header: true });
        setBreeds(results.data.map(b => b.Name));
      } catch (error) {
        console.error('Failed to fetch breeds', error);
      }
    };

    fetchBreeds();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('age', age);
    formData.append('gender', gender);
    formData.append('color', color);
    formData.append('nickname', nickname);
    formData.append('owner', owner);
    formData.append('breed', breed);
    if (image) formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:5001/api/dogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(addDog(response.data));
      navigate('/');
    } catch (error) {
      console.error('Failed to add dog', error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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

