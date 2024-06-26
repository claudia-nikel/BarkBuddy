import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addDog } from '../features/dogs/dogsSlice';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { v4 as uuidv4 } from 'uuid';

const AddDog = () => {
  const [name, setName] = useState('');
  const [info, setInfo] = useState('');
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use navigate instead of history

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = uuidv4();
    dispatch(addDog({ id, name, info, image }));
    navigate('/'); // Use navigate to redirect
  };

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div>
      <h1>Add a Dog</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Dog's Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Information"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
        />
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Add Dog</button>
      </form>
    </div>
  );
};

export default AddDog;

