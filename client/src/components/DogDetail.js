import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import NavBar from './NavBar';
import { updateDog } from '../features/dogs/dogsSlice';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import ClipLoader from 'react-spinners/ClipLoader';

// Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
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
  const [owner2, setOwner2] = useState('');
  const [breed, setBreed] = useState('');
  const [breeds, setBreeds] = useState([]);
  const [isFriendly, setIsFriendly] = useState('');
  const [size, setSize] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [notes, setNotes] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [sightings, setSightings] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (dog) {
      setName(dog.name);
      setAge(dog.age);
      setGender(dog.gender);
      setColor(dog.color);
      setNickname(dog.nickname);
      setOwner(dog.owner);
      setOwner2(dog.owner2 || '');
      setBreed(dog.breed);
      setIsFriendly(dog.isFriendly ? 'yes' : 'no');
      setSize(dog.size || '');
      setNeighborhood(dog.neighborhood || '');
      setIsOwner(dog.isOwner || false);
      setNotes(dog.notes || '');
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
    const fetchLocationData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${apiUrl}/locations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.length > 0) {
          setSightings(response.data);
          const firstLocation = response.data[0];
          setLatitude(firstLocation.latitude);
          setLongitude(firstLocation.longitude);
        }        
      } catch (error) {
        console.error('Failed to fetch location data', error);
      }
    };

    if (dog) {
      fetchLocationData();
    }
  }, [dog, apiUrl, getAccessTokenSilently, id]);

  const handleOwnershipChange = () => {
    setIsOwner(!isOwner);
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

  const handleSawThisDog = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
  
        try {
          const token = await getAccessTokenSilently();
          const response = await axios.post(
            `${apiUrl}/locations/${id}`,
            { latitude: lat, longitude: lon },
            { headers: { Authorization: `Bearer ${token}` } }
          );
  
          setSightings((prev) => [...prev, response.data]); // Update sightings with the new location
        } catch (error) {
          console.error('Failed to save sighting:', error);
        }
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('age', age);
    formData.append('gender', gender);
    formData.append('color', color);
    formData.append('nickname', nickname);
    formData.append('owner', owner);
    formData.append('owner2', owner2);
    formData.append('breed', breed);
    formData.append('isFriendly', isFriendly ? 'yes' : 'no');
    formData.append('size', size);
    formData.append('neighborhood', neighborhood || '');
    formData.append('isOwner', isOwner ? 'true' : 'false');
    formData.append('notes', notes || '');

    if (image) {
      formData.append('image', image);
    }

    try {
      await dispatch(updateDog({ id, formData, getAccessTokenSilently }));
      setEditMode(false);
      setImagePreview(image ? URL.createObjectURL(image) : dog.image);
    } catch (error) {
      console.error('Failed to update dog', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!dog) {
    return <div>Dog not found</div>;
  }

  return (
    <>
      <NavBar />
      <div className="relative p-4"> {/* Flex container for dog details and image */}
      <div className="flex items-start space-x-8"></div>
    {/* Dog Details */}
    <div className="add-dog-container max-w-md">
        <h1
            className="text-3xl font-bold mb-4"
            style={{ color: "#ff4500", textAlign: "left" }}
        >
            {editMode ? "Edit Dog Info" : "Dog Info"}
        </h1>
        {isSubmitting ? (
            <div className="loading-spinner-container">
                <ClipLoader size={80} color={"#ff4500"} loading={isSubmitting} />
            </div>
        ) : editMode ? (
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

              {/* Second Owner Field */}
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

              {/* Friendly Field */}
              <div>
                <label className="label">Friendly</label>
                <select
                  value={isFriendly}
                  onChange={(e) => setIsFriendly(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-stroke dark:border-dark-3 bg-transparent py-2 px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {/* Size Field */}
              <div>
                <label className="label">Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-stroke dark:border-dark-3 bg-transparent py-2 px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary"
                >
                  <option value="xsmall">X-Small</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="xlarge">X-Large</option>
                </select>
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

              {/* Neighborhood Field */}
              <div>
                <label className="label">Neighborhood</label>
                <textarea
                  rows="1"
                  placeholder="Enter Dog's Neighborhood"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 p-3 text-dark-6 outline-none transition focus:border-primary active:border-primary"
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
                    onChange={handleOwnershipChange}
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

              

              <div className="submit-button-container">
                <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600" disabled={isSubmitting}>
                  Save Changes
                </button>

              </div>
            </form>
          ) : (
            <div className="space-y-2 text-left">
              <p><strong>Dog's Name:</strong> {name}</p>
              <p><strong>Age:</strong> {age}</p>
              <p><strong>Gender:</strong> {gender}</p>
              <p><strong>Color:</strong> {color}</p>
              <p><strong>Nickname:</strong> {nickname}</p>
              <p><strong>Owner's Name:</strong> {owner}</p>
              <p><strong>Second Owner's Name:</strong> {owner2}</p>
              <p><strong>Breed:</strong> {breed}</p>
              <p><strong>Is Friendly?</strong> {isFriendly}</p>
              <p><strong>Size:</strong> {size}</p>
              <p><strong>Neighborhood:</strong> {neighborhood}</p>
              <p><strong>Notes:</strong> {notes}</p>
              <p><strong>My Dog?</strong> {isOwner ? 'Yes' : 'No'}</p>
              <div className="flex flex-col space-y-2">
              <button
                onClick={handleSawThisDog}
                className="bg-[#ff4500] text-white py-1 px-3 rounded hover:bg-[#e04000]"
                style={{
                  maxWidth: "150px",
                }}
              >
                Saw This Dog
              </button>

            </div>
            </div>
          )}
        </div>
{/* Image Preview */}
{imagePreview && (
  <div className="w-1/3">
    <img
      src={imagePreview}
      alt={name}
      className="rounded-md w-full border border-gray-300 shadow-md"
    />
  </div>
)}


  {/* Edit Button */}
  <button
  onClick={() => setEditMode(true)}
  className="absolute top-4 right-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 z-10"
>
  Edit
</button>

</div>

{/* Map Section */}
{latitude && longitude && (
  <div className="mt-6 max-w-6xl mx-auto p-4">
    {/* Map and Title Layout */}
    <div className="flex">
      {/* Map and Title Group */}
      <div style={{ width: "75%", position: "relative" }}>
        {/* Title */}
        <h3
          className="text-3xl font-bold text-center mb-4"
          style={{
            color: "#ff4500",
          }}
        >
          Sightings of This Dog
        </h3>

        {/* Map */}
        <MapContainer
          center={latitude && longitude ? [latitude, longitude] : [0, 0]}
          zoom={13}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {sightings.map((location, index) => (
            <Marker
              key={index}
              position={[location.latitude, location.longitude]}
              icon={L.divIcon({
                html: `<i class="fa fa-paw" style="color: ${
                  index === 0 ? "#ff4500" : "#007bff"
                }"></i>`,
                className: "",
              })}
            >
              <Popup>
                {index === 0 ? "First met this dog here" : "Dog seen here"}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div
        className="ml-4"
        style={{
          width: "25%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginTop: "30px", // Adjust this to match the top of the map
        }}
      >
        <h4 className="font-bold underline mb-2">Legend</h4>
        <p>
          <i className="fa fa-paw" style={{ color: "#ff4500" }}></i> First Sighting
        </p>
        <p>
          <i className="fa fa-paw" style={{ color: "#007bff" }}></i> Subsequent Sightings
        </p>
      </div>
    </div>
  </div>
)}






    </>
  );
};

export default DogDetail;




