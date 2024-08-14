import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateDog } from '../features/dogs/dogsSlice';
import axios from 'axios';
import Papa from 'papaparse';
import { useAuth0 } from '@auth0/auth0-react';
import './DogDetail.css';

const DogDetail = () => {
  const { id } = useParams();
  const dog = useSelector((state) => state.dogs.dogs.find((dog) => dog.id === id));
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0(); 

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
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (dog) {
      setName(dog.name);
      setAge(dog.age);
      setGender(dog.gender);
      setColor(dog.color);
      setNickname(dog.nickname);
      setOwner(dog.owner);
      setBreed(dog.breed);
      setImagePreview(dog.image);
    }
  }, [dog]);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/breeds`);
        setBreeds(response.data);
      } catch (error) {
        console.error('Failed to fetch breeds', error);
      }
    };

    fetchBreeds();
  }, [apiUrl]);

  useEffect(() => {
    const fetchBreedDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/breeds`);
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        const results = Papa.parse(csv, { header: true });
        const breedDetail = results.data.find((b) => b.Name === breed);
        setBreedDetails(breedDetail);
      } catch (error) {
        console.error('Failed to fetch breed details', error);
      }
    };

    if (breed) {
      fetchBreedDetails();
    }
  }, [breed, apiUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

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
    if (image) {
      formData.append('image', image);
    }
  
    try {
      const token = await getAccessTokenSilently();
      dispatch(updateDog({ id, formData, token }));
      setEditMode(false);
      setImagePreview(image ? URL.createObjectURL(image) : dog.image); 
    } catch (error) {
      console.error('Failed to update dog', error);
    }
  };

  if (!dog) {
    return <div>Dog not found</div>;
  }

  return (
    <div className="dog-detail-container">
      <button onClick={() => window.history.back()} className="back-button">Back</button>
      <div className="title-section">
        <h1 className="dog-title">{name}</h1>
        <h2 className="dog-subtitle">Dog Details</h2>
      </div>
      {!editMode ? (
        <div className="dog-detail-content">
          <div className="dog-detail-text">
            <p><strong>Age:</strong> {age}</p>
            <p><strong>Gender:</strong> {gender}</p>
            <p><strong>Color:</strong> {color}</p>
            <p><strong>Nickname:</strong> {nickname}</p>
            <p><strong>Owner:</strong> {owner}</p>
            <p><strong>Breed:</strong> {breed}</p>
            <button onClick={() => setEditMode(true)} className="edit-button">Edit</button>
          </div>
          {imagePreview && (
            <div className="dog-image-container">
              <img src={imagePreview} alt={name} className="dog-image" />
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="dog-detail-content" encType="multipart/form-data">
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
            <div className="form-row">
              <label>Image:</label>
              <input type="file" onChange={handleImageChange} />
            </div>
            <button type="submit" className="submit-button">Save Changes</button>
          </div>
          {imagePreview && (
            <div className="dog-image-container">
              <img src={imagePreview} alt={name} className="dog-image" />
            </div>
          )}
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

