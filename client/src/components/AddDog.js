import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addDog } from '../features/dogs/dogsSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const AddDog = () => {
  const { getAccessTokenSilently } = useAuth0(); // Ensure this is correctly initialized

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const apiUrl = process.env.REACT_APP_API_URL;

  // Fetch the list of breeds when the component mounts
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/breeds`);
        setBreeds(response.data);
      } catch (error) {
        console.error('Failed to fetch breeds', error);
      }
    };

    // Test fetching the token to ensure it works correctly
    const testGetAccessToken = async () => {
      try {
        console.log('About to call getAccessTokenSilently');
        const token = await getAccessTokenSilently(); // Test the token retrieval
        console.log('Token fetched successfully:', token);
      } catch (error) {
        console.error('Error fetching token:', error.message);
        console.error('Error details:', error);
      }
    };

    fetchBreeds();
    testGetAccessToken(); // Call the test function to log the token retrieval
  }, [apiUrl, getAccessTokenSilently]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const token = await getAccessTokenSilently(); // Correctly fetch the token
      console.log('JWT Token:', token);

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

      const response = await axios.post(`${apiUrl}/api/dogs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(addDog(response.data))
        .unwrap()
        .then(() => {
          navigate('/');
        })
        .catch((error) => {
          console.error('Failed to add dog in Redux:', error);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } catch (error) {
      console.error('Failed to add dog:', error.message);
      setIsSubmitting(false);
    }
  };

  // Handle image selection
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
              <option key={index} value={breed.Name}>{breed.Name}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Image:</label>
          <input type="file" onChange={handleImageChange} />
        </div>
        <button type="submit" className="submit-button" disabled={isSubmitting}>Submit</button>
      </form>
    </div>
  );
};

export default AddDog;
