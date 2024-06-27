import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateDog } from '../features/dogs/dogsSlice';
import axios from 'axios';
import Papa from 'papaparse';
import './DogDetail.css';

const DogDetail = () => {
  const { id } = useParams();
  const dog = useSelector(state => state.dogs.dogs.find(dog => dog.id === id));
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [color, setColor] = useState('');
  const [nickname, setNickname] = useState('');
  const [owner, setOwner] = useState('');
  const [breed, setBreed] = useState('');
  const [breeds, setBreeds] = useState([]);
  const [breedDetails, setBreedDetails] = useState(null);
  const [image, setImage] = useState(null); // Add image state

  useEffect(() => {
    if (dog) {
      setName(dog.name);
      setAge(dog.age);
      setGender(dog.gender);
      setColor(dog.color);
      setNickname(dog.nickname);
      setOwner(dog.owner);
      setBreed(dog.breed);
      setImage(dog.image); // Set image from dog data
    }
  }, [dog]);

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

  useEffect(() => {
    const fetchBreedDetails = async () => {
      try {
        const response = await fetch('http://localhost:5001/public/dog_breeds.csv');
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        const results = Papa.parse(csv, { header: true });
        const breedDetail = results.data.find(b => b.Name === breed);
        setBreedDetails(breedDetail);
      } catch (error) {
        console.error('Failed to fetch breed details', error);
      }
    };

    if (breed) {
      fetchBreedDetails();
    }
  }, [breed]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateDog({ id, name, age, gender, color, nickname, owner, breed, image }));
    setEditMode(false);
  };

  if (!dog) {
    return <div>Dog not found</div>;
  }

  return (
    <div className="dog-detail-container">
      <button onClick={() => window.history.back()} className="back-button">Back</button>
      <h1>Dog Details</h1>
      {!editMode ? (
        <div className="dog-detail-content">
          <div className="dog-detail-text">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Age:</strong> {age}</p>
            <p><strong>Gender:</strong> {gender}</p>
            <p><strong>Color:</strong> {color}</p>
            <p><strong>Nickname:</strong> {nickname}</p>
            <p><strong>Owner:</strong> {owner}</p>
            <p><strong>Breed:</strong> {breed}</p>
            <button onClick={() => setEditMode(true)} className="edit-button">Edit</button>
          </div>
          {image && <div className="dog-image-container"><img src={image} alt={name} className="dog-image" /></div>}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="dog-detail-content">
          <div className="dog-detail-text">
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
              <select value={breed} onChange={(e) => setBreed(e.target.value)}>
                <option value="">Select Breed</option>
                {breeds.map((breed, index) => (
                  <option key={index} value={breed.Name}>{breed.Name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="submit-button">Save Changes</button>
          </div>
          {image && <div className="dog-image-container"><img src={image} alt={name} className="dog-image" /></div>}
        </form>
      )}

      {breedDetails && (
        <div className="breed-details">
          <h2>Breed Details</h2>
          <table>
            <thead>
              <tr>
                {Object.keys(breedDetails).map((key, index) => (
                  <th key={index}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.values(breedDetails).map((value, index) => (
                  <td key={index}>{typeof value === 'string' ? value : JSON.stringify(value)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DogDetail;
