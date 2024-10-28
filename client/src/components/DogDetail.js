import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import NavBar from './NavBar';
import { updateDog } from '../features/dogs/dogsSlice';
import axios from 'axios';
import Papa from 'papaparse';
import { useAuth0 } from '@auth0/auth0-react';
import './DogDetail.css';

// Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icon
const pawprintIcon = L.divIcon({
  html: `<div style="font-size: 20px; color: #ff4500;"><i class="fa fa-paw"></i></div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

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
  const [isOwner, setIsOwner] = useState(false);
  const [notes, setNotes] = useState('');
  const [breedDetails, setBreedDetails] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  // Fetch dog data
  useEffect(() => {
    if (dog) {
      setName(dog.name);
      setAge(dog.age);
      setGender(dog.gender);
      setColor(dog.color);
      setNickname(dog.nickname);
      setOwner(dog.owner);
      setBreed(dog.breed);
      setIsOwner(dog.isOwner || false);  // Default to false if undefined
      setNotes(dog.notes || '');  // Default to empty string if undefined
      setImagePreview(dog.image);
    }
  }, [dog]);

  // Fetch breeds list
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

  // Fetch location data
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${apiUrl}/locations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.length > 0) {
          setLatitude(response.data[0].latitude);
          setLongitude(response.data[0].longitude);
        }
      } catch (error) {
        console.error('Failed to fetch location data', error);
      }
    };

    if (dog) {
      fetchLocationData();
    }
  }, [dog, apiUrl, getAccessTokenSilently, id]);

  // Fetch breed details
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

  const handleOwnershipChange = (e) => {
    setIsOwner(e.target.checked);
  };

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
    
    // Ensure `isOwner` is sent as a string 'true' or 'false' to be parsed properly by the backend
    formData.append('isOwner', isOwner ? 'true' : 'false');
  
    // Ensure `notes` is either a string or an empty string if not provided
    formData.append('notes', notes !== null && notes !== undefined ? notes : '');
  
    if (image) {
      formData.append('image', image);
    }
  
    // Log the formData to ensure values are being sent correctly
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  
    try {
      await dispatch(updateDog({ id, formData, getAccessTokenSilently }));
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
    <>
      <NavBar />
      <div className="dog-detail-container">
        <button onClick={() => window.history.back()} className="back-button">
          Back
        </button>
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
              <p><strong>Notes:</strong> {notes}</p>
              <p>
                <strong>
                  My Dog?
                  <input
                    type="checkbox"
                    checked={isOwner}
                    onChange={handleOwnershipChange}
                    disabled={!editMode}
                  />
                </strong>
              </p>
              <button onClick={() => setEditMode(true)} className="edit-button">
                Edit
              </button>
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
                    <option key={index} value={breed.Name}>
                      {breed.Name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label>Image:</label>
                <input type="file" onChange={handleImageChange} />
              </div>
              <div className="form-row">
                <label>Notes:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this dog"
                />
              </div>
              <div className="form-row">
                <label>My Dog?</label>
                <input type="checkbox" checked={isOwner} onChange={handleOwnershipChange} />
              </div>
              <button type="submit" className="submit-button">
                Save Changes
              </button>
            </div>
            {imagePreview && (
              <div className="dog-image-container">
                <img src={imagePreview} alt={name} className="dog-image" />
              </div>
            )}
          </form>
        )}
        {/* Render the map below the dog details and image */}
        {latitude && longitude && (
          <div className="dog-location-map" style={{ textAlign: 'center', marginTop: '20px' }}>
            <h3>Where did I first meet this dog?</h3>
            <div style={{ display: 'inline-block' }}>
              <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '300px', width: '400px' }}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <Marker position={[latitude, longitude]} icon={pawprintIcon}>
                  <Popup>Dog was added here</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
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
    </>
  );
};

export default DogDetail;

