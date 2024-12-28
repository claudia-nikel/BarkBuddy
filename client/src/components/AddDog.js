import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addDog } from '../features/dogs/dogsSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import NavBar from './NavBar';
import ClipLoader from 'react-spinners/ClipLoader';
import './AddDog.css';

const AddDog = () => {
  const { getAccessTokenSilently } = useAuth0();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [color, setColor] = useState('');
  const [nickname, setNickname] = useState('');
  const [owner, setOwner] = useState('');
  const [owner2, setOwner2] = useState('');
  const [breed, setBreed] = useState('');
  const [breeds, setBreeds] = useState([]);
  const [isFriendly, setIsFriendly] = useState('');
  const [size, setSize] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [image, setImage] = useState(null);
  const [notes, setNotes] = useState('');
  const [isOwner, setIsOwner] = useState(false);
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

  const handleLocationAndSubmit = async () => {
    const token = await getAccessTokenSilently();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('age', age);
    formData.append('gender', gender);
    formData.append('color', color);
    formData.append('nickname', nickname);
    formData.append('owner', owner);
    formData.append('owner2', owner2);
    formData.append('breed', breed);
    formData.append('isFriendly', isFriendly);
    formData.append('size', size);
    formData.append('neighborhood', neighborhood);
    formData.append('notes', notes);
    formData.append('isOwner', isOwner);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await dispatch(addDog({ formData, getAccessTokenSilently }));
      const newDog = response.payload;

      if (newDog && newDog.id) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;

              await axios.post(`${apiUrl}/locations/${newDog.id}`, { latitude: lat, longitude: lon }, {
                headers: { Authorization: `Bearer ${token}` },
              });

              navigate('/dogs');
            },
            () => navigate('/dogs'),
            { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
          );
        } else {
          navigate('/dogs');
        }
      }
    } catch (error) {
      console.error('Failed to add dog:', error);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    handleLocationAndSubmit();
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCheckboxChange = () => {
    setIsOwner(!isOwner);
  };

  return (
    <>
      <NavBar />
      <div className="add-dog-container max-w-lg p-4">
        <h1 className="text-2xl font-semibold mb-4">Dog Info</h1>
        {isSubmitting ? (
          <div className="loading-spinner-container">
            <ClipLoader size={80} color={"#ff4500"} loading={isSubmitting} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {/* Name Field */}
            <div>
              <label className="label">Dog's Name</label>
              <input
                type="text"
                placeholder="Enter Dog's Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-2 px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary"
              />
            </div>

            {/* Age Field */}
            <div>
              <label className="label">Age</label>
              <input
                type="number"
                placeholder="Enter Age"
                value={age}
                onChange={(e) => setAge(Math.max(0, e.target.value))}
                required
                className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-2 px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary"
              />
            </div>

            {/* Gender Field */}
            <div>
              <label className="label">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="w-full appearance-none rounded-lg border border-stroke dark:border-dark-3 bg-transparent py-2 px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Color Field */}
            <div>
              <label className="label">Color</label>
              <input
                type="text"
                placeholder="Enter Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
                className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-2 px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary"
              />
            </div>

            {/* Nickname Field */}
            <div>
              <label className="label">Nickname</label>
              <input
                type="text"
                placeholder="Enter Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-2 px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary"
              />
            </div>

            {/* Owner's Name Field */}
            <div>
              <label className="label">Owner's Name</label>
              <input
                type="text"
                placeholder="Enter Owner's Name"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-2 px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary"
              />
            </div>

            {/* Second Owner's Name Field */}
            <div>
              <label className="label">Second Owner's Name</label>
              <input
                type="text"
                placeholder="Enter Second Owner's Name"
                value={owner2}
                onChange={(e) => setOwner2(e.target.value)}
                className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-2 px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary"
              />
            </div>

            {/* Breed Field */}
            <div>
              <label className="label">Breed</label>
              <select
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                required
                className="w-full appearance-none rounded-lg border border-stroke dark:border-dark-3 bg-transparent py-2 px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary"
              >
                <option value="">Select Breed</option>
                {breeds.map((breed, index) => (
                  <option key={index} value={breed.Name}>
                    {breed.Name}
                  </option>
                ))}
              </select>
            </div>

            {/* Friendly Field */}
            <div>
              <label className="label">Is Friendly?</label>
              <select
                value={isFriendly}
                onChange={(e) => setIsFriendly(e.target.value)}
                required
                className="w-full appearance-none rounded-lg border border-stroke dark:border-dark-3 bg-transparent py-2 px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary"
              >
                <option value="">Select Yes or No</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Size Field */}
            <div>
              <label className="label">Size</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
                className="w-full appearance-none rounded-lg border border-stroke dark:border-dark-3 bg-transparent py-2 px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary"
              >
                <option value="">Select Size</option>
                <option value="xsmall">Extra Small</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra Large</option>
              </select>
            </div>

            {/* Neighborhood Field */}
            <div>
              <label className="label">Neighborhood</label>
              <input
                type="text"
                placeholder="Enter Neighborhood"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-2 px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary"
              />
            </div>

            {/* Notes Field */}
            <div>
              <label className="label">Notes</label>
              <textarea
                rows="5"
                placeholder="Enter notes about this dog"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 p-3 text-dark-6 outline-none transition focus:border-primary active:border-primary"
              />
            </div>

            {/* My Dog Checkbox */}
            <div>
              <label className="label">My Dog?</label>
              <label className="flex items-center cursor-pointer select-none text-dark dark:text-white">
                <input
                  type="checkbox"
                  checked={isOwner}
                  onChange={handleCheckboxChange}
                  className="sr-only"
                />
                <div className="box mr-4 flex h-5 w-5 items-center justify-center rounded-full border border-stroke dark:border-dark-3">
                  <span className={`h-[10px] w-[10px] rounded-full ${isOwner ? 'bg-primary' : 'bg-transparent'}`} />
                </div>
              </label>
            </div>

            {/* Image Upload Field */}
            <div>
              <label className="label">Upload Image</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full cursor-pointer rounded-md border border-stroke dark:border-dark-3 text-dark-6 outline-none transition file:mr-5 file:border-0 file:bg-gray-2 dark:file:bg-dark-2 file:py-2 file:px-3 file:text-body-color dark:file:text-dark-6 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary"
              />
            </div>

            {/* Submit Button */}
            <div className="submit-button-container">
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                Add Buddy
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default AddDog;
