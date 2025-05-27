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
  const dog = useSelector(s => s.dogs.dogs.find(d => d.id === id));
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const apiUrl = process.env.REACT_APP_API_URL;

  // state
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [breeds, setBreeds] = useState([]);
  const [sightings, setSightings] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // fields
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [color, setColor] = useState('');
  const [nickname, setNickname] = useState('');
  const [owner, setOwner] = useState('');
  const [owner2, setOwner2] = useState('');
  const [breed, setBreed] = useState('');
  const [isFriendly, setIsFriendly] = useState('yes');
  const [size, setSize] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [notes, setNotes] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  // populate from store
  useEffect(() => {
    if (!dog) return;
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
    setNotes(dog.notes || '');
    setIsOwner(dog.isOwner || false);
    setImagePreview(dog.image);
  }, [dog]);

  // load breeds
  useEffect(() => {
    axios.get(`${apiUrl}/api/breeds`)
      .then(r => setBreeds(r.data))
      .catch(console.error);
  }, [apiUrl]);

  // load sightings
  useEffect(() => {
    if (!dog) return;
    getAccessTokenSilently()
      .then(token =>
        axios.get(`${apiUrl}/locations/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      )
      .then(r => {
        setSightings(r.data || []);
        if (r.data.length) {
          setLatitude(r.data[0].latitude);
          setLongitude(r.data[0].longitude);
        }
      })
      .catch(console.error);
  }, [dog, apiUrl, getAccessTokenSilently, id]);

  const handleOwnershipChange = () => setIsOwner(o => !o);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSawThisDog = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.post(
          `${apiUrl}/locations/${id}`,
          { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSightings(s => [...s, res.data]);
      } catch (e) {
        console.error(e);
      }
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    [
      ['name', name],
      ['age', age],
      ['gender', gender],
      ['color', color],
      ['nickname', nickname],
      ['owner', owner],
      ['owner2', owner2],
      ['breed', breed],
      ['isFriendly', isFriendly],
      ['size', size],
      ['neighborhood', neighborhood],
      ['notes', notes],
      ['isOwner', isOwner ? 'true' : 'false'],
    ].forEach(([k, v]) => formData.append(k, v || ''));
    if (image) formData.append('image', image);

    try {
      await dispatch(updateDog({ id, formData, getAccessTokenSilently }));
      setEditMode(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!dog) return <div className="p-4">Dog not found</div>;

  return (
    <>
      <NavBar />

      <div className="max-w-6xl mx-auto mt-6 px-4">
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
          {/* Info Card */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow relative text-left">
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Edit
              </button>
            )}

            <h2 className="text-2xl font-bold mb-4" style={{ color: '#ff4500' }}>
              {editMode ? 'Edit Dog Info' : 'Dog Info'}
            </h2>

            {isSubmitting ? (
              <div className="flex justify-center py-10">
                <ClipLoader size={48} color="#ff4500" />
              </div>
            ) : editMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Dog's Name */}
                <div>
                  <label className="label">Dog's Name</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full rounded-md border py-2 px-3"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="label">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(Math.max(0, e.target.value))}
                    required
                    className="w-full rounded-md border py-2 px-3"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="label">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    required
                    className="w-full rounded-md border py-2 px-3"
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="label">Color</label>
                  <input
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    required
                    className="w-full rounded-md border py-2 px-3"
                  />
                </div>

                {/* Nickname */}
                <div>
                  <label className="label">Nickname</label>
                  <input
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    className="w-full rounded-md border py-2 px-3"
                  />
                </div>

                {/* Owner */}
                <div>
                  <label className="label">Owner’s Name</label>
                  <input
                    value={owner}
                    onChange={e => setOwner(e.target.value)}
                    className="w-full rounded-md border py-2 px-3"
                  />
                </div>

                {/* Second Owner */}
                <div>
                  <label className="label">Second Owner’s Name</label>
                  <input
                    value={owner2}
                    onChange={e => setOwner2(e.target.value)}
                    className="w-full rounded-md border py-2 px-3"
                  />
                </div>

                {/* Friendly */}
                <div>
                  <label className="label">Friendly?</label>
                  <select
                    value={isFriendly}
                    onChange={e => setIsFriendly(e.target.value)}
                    className="w-full rounded-md border py-2 px-3"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {/* Size */}
                <div>
                  <label className="label">Size</label>
                  <select
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    className="w-full rounded-md border py-2 px-3"
                  >
                    <option value="">Select Size</option>
                    <option value="xsmall">X-Small</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="xlarge">X-Large</option>
                  </select>
                </div>

                {/* Breed */}
                <div>
                  <label className="label">Breed</label>
                  <select
                    value={breed}
                    onChange={e => setBreed(e.target.value)}
                    required
                    className="w-full rounded-md border py-2 px-3"
                  >
                    <option value="">Select Breed</option>
                    {breeds.map((b, i) => (
                      <option key={i}>{b.Name}</option>
                    ))}
                  </select>
                </div>

                {/* Neighborhood */}
                <div>
                  <label className="label">Neighborhood</label>
                  <textarea
                    rows={1}
                    value={neighborhood}
                    onChange={e => setNeighborhood(e.target.value)}
                    className="w-full rounded-md border p-2"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="label">Notes</label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full rounded-md border p-2"
                  />
                </div>

                {/* My Dog? */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isOwner}
                    onChange={handleOwnershipChange}
                  />
                  <label>I am the owner</label>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="label">Upload Image</label>
                  <input type="file" onChange={handleImageChange} />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded"
                >
                  {isSubmitting ? <ClipLoader size={20} color="#fff" /> : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="space-y-2">
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Age:</strong> {age}</p>
                <p><strong>Gender:</strong> {gender}</p>
                <p><strong>Color:</strong> {color}</p>
                <p><strong>Nickname:</strong> {nickname}</p>
                <p><strong>Owner’s Name:</strong> {owner}</p>
                <p><strong>Second Owner’s Name:</strong> {owner2}</p>
                <p><strong>Breed:</strong> {breed}</p>
                <p><strong>Friendly?</strong> {isFriendly}</p>
                <p><strong>Size:</strong> {size}</p>
                <p><strong>Neighborhood:</strong> {neighborhood}</p>
                <p><strong>Notes:</strong> {notes}</p>
                <p><strong>My Dog?</strong> {isOwner ? 'Yes' : 'No'}</p>

                <button
                  onClick={handleSawThisDog}
                  className="mt-4 bg-[#ff4500] hover:bg-[#e04000] text-white py-2 px-6 rounded"
                >
                  Saw This Dog
                </button>
              </div>
            )}
          </div>

          {/* Image Card */}
          {imagePreview && (
            <div className="w-full md:w-1/3 bg-white rounded-lg shadow overflow-hidden">
              <img
                src={imagePreview}
                alt={name}
                className="w-full h-full object-cover"
                style={{ display: 'block' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Map Section */}
      {latitude != null && longitude != null && (
        <div className="max-w-6xl mx-auto mt-8 px-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold text-center mb-4" style={{ color: '#ff4500' }}>
              Sightings of This Dog
            </h3>
            <div className="flex flex-col lg:flex-row lg:space-x-6">
              <div className="flex-1">
                <MapContainer
                  center={[latitude, longitude]}
                  zoom={13}
                  style={{ height: '300px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  {sightings.map((loc, i) => (
                    <Marker
                      key={i}
                      position={[loc.latitude, loc.longitude]}
                      icon={L.divIcon({
                        html: `<i class="fa fa-paw" style="font-size:24px;color:${i === 0 ? '#ff4500' : '#007bff'}"></i>`,
                        className: ''
                      })}
                    >
                      <Popup>{i === 0 ? 'First met here' : 'Seen here'}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              <div className="mt-4 lg:mt-0 lg:w-1/4">
                <h4 className="font-semibold underline mb-2">Legend</h4>
                <p className="flex items-center space-x-2">
                  <i className="fa fa-paw text-xl" style={{ color: '#ff4500' }}></i>
                  <span>First Sighting</span>
                </p>
                <p className="flex items-center space-x-2 mt-2">
                  <i className="fa fa-paw text-xl" style={{ color: '#007bff' }}></i>
                  <span>Subsequent Sightings</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DogDetail;
