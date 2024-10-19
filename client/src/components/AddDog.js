import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addDog } from '../features/dogs/dogsSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import NavBar from './NavBar';  // Import NavBar component
import './AddDog.css';

const AddDog = () => {
  const { getAccessTokenSilently } = useAuth0();

  // State variables
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [color, setColor] = useState('');
  const [nickname, setNickname] = useState('');
  const [owner, setOwner] = useState('');
  const [breed, setBreed] = useState('');
  const [breeds, setBreeds] = useState([]);
  const [image, setImage] = useState(null);
  const [notes, setNotes] = useState(''); // New notes field
  const [isOwner, setIsOwner] = useState(false); // New state for ownership
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    console.log('Form submission started');

    try {
      const token = await getAccessTokenSilently();
      console.log('JWT Token:', token);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('age', age);
      formData.append('gender', gender);
      formData.append('color', color);
      formData.append('nickname', nickname);
      formData.append('owner', owner);
      formData.append('breed', breed);
      formData.append('notes', notes); // Include notes in form data
      formData.append('isOwner', isOwner); // Include ownership status
      if (image) {
        formData.append('image', image);
      }

      console.log('Form data prepared:', formData);

      // Pass formData and getAccessTokenSilently to addDog
      dispatch(addDog({ formData, getAccessTokenSilently }));

      console.log('Dog added successfully to Redux');
      navigate('/dogs');
    } catch (error) {
      console.error('Failed to add dog:', error);
    } finally {
      setIsSubmitting(false);
      console.log('Form submission ended');
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <>
      <NavBar /> {/* Include NavBar at the top */}
      <div className="add-dog-container">
        <h1>Dog Info</h1>
        <form onSubmit={handleSubmit} className="dog-form">
          <div className="form-row">
            <label>Dog's Name:</label>
            <input
              type="text"
              placeholder="Dog's Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <label>Age:</label>
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <label>Gender:</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="short-select" required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="form-row">
            <label>Color:</label>
            <input
              type="text"
              placeholder="Color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <label>Nickname:</label>
            <input
              type="text"
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div className="form-row">
            <label>Owner's Name:</label>
            <input
              type="text"
              placeholder="Owner's Name"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </div>
          <div className="form-row">
            <label>Breed:</label>
            <select value={breed} onChange={(e) => setBreed(e.target.value)} className="short-select" required>
              <option value="">Select Breed</option>
              {breeds.map((breed, index) => (
                <option key={index} value={breed.Name}>
                  {breed.Name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Notes:</label>
            <textarea
              placeholder="Notes about this dog"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="form-row">
            <label>My Dog?</label>
            <input
              type="checkbox"
              checked={isOwner}
              onChange={(e) => setIsOwner(e.target.checked)}
            />
          </div>
          <div className="form-row">
            <label>Image:</label>
            <input type="file" onChange={handleImageChange} />
          </div>
          <div className="submit-button-container">
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddDog;
