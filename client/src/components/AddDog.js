import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addDog } from '../features/dogs/dogsSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import NavBar from './NavBar';
import './AddDog.css';
import ClipLoader from 'react-spinners/ClipLoader'; // Spinner from react-spinners

const AddDog = () => {
  const { getAccessTokenSilently } = useAuth0();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [color, setColor] = useState('');
  const [nickname, setNickname] = useState('');
  const [owner, setOwner] = useState('');
  const [breed, setBreed] = useState('');
  const [breeds, setBreeds] = useState([]);
  const [image, setImage] = useState(null);
  const [notes, setNotes] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

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

  // Function to handle location fetching and form submission
  const handleLocationAndSubmit = async () => {
    const token = await getAccessTokenSilently();

    // Prepare formData with all values
    const formData = new FormData();
    formData.append('name', name);
    formData.append('age', age);
    formData.append('gender', gender);
    formData.append('color', color);
    formData.append('nickname', nickname);
    formData.append('owner', owner);
    formData.append('breed', breed);
    formData.append('notes', notes);
    formData.append('isOwner', isOwner);
    if (image) {
      formData.append('image', image);
    }

    try {
      console.log('Step 1: Form submission started...');

      // First, create the dog
      const response = await dispatch(addDog({ formData, getAccessTokenSilently }));
      const newDog = response.payload;

      if (newDog && newDog.id) {
        console.log('Step 2: Dog created successfully:', newDog);

        // Check if geolocation is available
        if (navigator.geolocation) {
          console.log('Step 3: Geolocation is available. Requesting position...');

          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;

              // Log lat/long to verify if they are being captured
              console.log("Step 4: Latitude:", lat, "Longitude:", lon);

              // Send the latitude and longitude to the locations endpoint
              try {
                const locationResponse = await axios.post(`${apiUrl}/locations/${newDog.id}`, {
                  latitude: lat,
                  longitude: lon
                }, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });

                console.log('Step 5: Location saved successfully:', locationResponse.data);
              } catch (locationError) {
                console.error('Step 5.1: Failed to save location:', locationError);
              }

              // Redirect to the dog list page
              navigate('/dogs');
            },
            (error) => {
              console.error('Step 3.1: Failed to get location:', error.message);
              navigate('/dogs');  // Proceed even if location fails
            },
            {
              timeout: 10000,
              maximumAge: 0,
              enableHighAccuracy: true
            }
          );
        } else {
          console.error('Step 3.2: Geolocation is not supported by this browser.');
          navigate('/dogs');  // Proceed without geolocation
        }
      } else {
        console.error("Step 2.1: Dog was not created successfully.");
      }
    } catch (error) {
      console.error('Step 1.1: Failed to add dog:', error);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);  // Set loading to true
    handleLocationAndSubmit(); // Fetch location and submit the form
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <>
      <NavBar />
      <div className="add-dog-container">
        <h1>Dog Info</h1>
        {isSubmitting ? (
          <div className="loading-spinner-container">
            <ClipLoader size={80} color={"#ff4500"} loading={isSubmitting} />
          </div>
        ) : (
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
              <select value={gender} onChange={(e) => setGender(e.target.value)} required>
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
              <select value={breed} onChange={(e) => setBreed(e.target.value)} required>
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
        )}
      </div>
    </>
  );
};

export default AddDog;

