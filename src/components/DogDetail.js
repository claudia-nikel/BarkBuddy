import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateDog } from '../features/dogs/dogsSlice';
import Papa from 'papaparse';
import './DogDetail.css';

const DogDetail = () => {
  const { id } = useParams();
  const dog = useSelector(state => state.dogs.find(dog => dog.id === id));
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [color, setColor] = useState('');
  const [nickname, setNickname] = useState('');
  const [owner, setOwner] = useState('');
  const [breed, setBreed] = useState('');
  const [breeds, setBreeds] = useState([]); // State to hold the list of breeds
  const [breedInfo, setBreedInfo] = useState(null); // State to hold breed info for the table

  useEffect(() => {
    if (dog) {
      setName(dog.name);
      setAge(dog.age);
      setGender(dog.gender);
      setColor(dog.color);
      setNickname(dog.nickname);
      setOwner(dog.owner);
      setBreed(dog.breed);
    }
  }, [dog]);

  useEffect(() => {
    // Function to fetch and parse the CSV file
    const fetchBreeds = async () => {
      const response = await fetch(`${process.env.PUBLIC_URL}/dog_breeds.csv`);
      const reader = response.body.getReader();
      const result = await reader.read(); // raw array
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value); // the csv text
      const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
      setBreeds(results.data); // Set the breeds state with the parsed data
    };

    fetchBreeds();
  }, []);

  useEffect(() => {
    if (breed) {
      const selectedBreedInfo = breeds.find(b => b.Name === breed);
      setBreedInfo(selectedBreedInfo);
    }
  }, [breed, breeds]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateDog({ id, name, age, gender, color, nickname, owner, breed }));
    setEditMode(false); // Exit edit mode after saving changes
  };

  if (!dog) {
    return <div>Dog not found</div>;
  }

  return (
    <div className="dog-detail-container">
      <h1>Dog Details</h1>
      {!editMode ? (
        <div>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Age:</strong> {age}</p>
          <p><strong>Gender:</strong> {gender}</p>
          <p><strong>Color:</strong> {color}</p>
          <p><strong>Nickname:</strong> {nickname}</p>
          <p><strong>Owner:</strong> {owner}</p>
          <p><strong>Breed:</strong> {breed}</p>
          <button onClick={() => setEditMode(true)} className="edit-button">Edit</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
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
              {breeds.map((b, index) => (
                <option key={index} value={b.Name}>{b.Name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="submit-button">Save Changes</button>
        </form>
      )}
      {breedInfo && (
        <div className="breed-info-table">
          <h2>Breed Information: {breed}</h2>
          <table>
            <thead>
              <tr>
                {Object.keys(breedInfo).map((key, index) => (
                  <th key={index}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.values(breedInfo).map((value, index) => (
                  <td key={index}>{value}</td>
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
