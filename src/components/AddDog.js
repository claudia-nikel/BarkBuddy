import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addDog } from '../features/dogs/dogsSlice';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { v4 as uuidv4 } from 'uuid';
import './AddDog.css';

const AddDog = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [color, setColor] = useState('');
  const [nickname, setNickname] = useState('');
  const [owner, setOwner] = useState('');
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = uuidv4();
    dispatch(addDog({ id, name, age, gender, color, nickname, owner, image }));
    navigate('/');
  };

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div>
      <h1>Add a Dog</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Dog's Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input type="text" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="text" placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        <input type="text" placeholder="Owner's Name" value={owner} onChange={(e) => setOwner(e.target.value)} />
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Add Dog</button>
      </form>
    </div>
  );
};

export default AddDog;