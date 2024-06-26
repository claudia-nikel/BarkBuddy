import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { updateDog } from '../features/dogs/dogsSlice';

const DogDetail = () => {
    const { id } = useParams();
    const dog = useSelector(state => state.dogs.find(d => d.id === id));
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [color, setColor] = useState('');
    const [nickname, setNickname] = useState('');
    const [owner, setOwner] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (dog) {
            setName(dog.name);
            setAge(dog.age);
            setGender(dog.gender);
            setColor(dog.color);
            setNickname(dog.nickname);
            setOwner(dog.owner);
        }
    }, [dog]);

    const handleSave = () => {
        dispatch(updateDog({ id, name, age, gender, color, nickname, owner }));
        setEditMode(false);
        navigate('/'); // Optionally navigate away after saving
    };

    if (!dog) return <div>Dog not found!</div>;

    return (
        <div>
            {editMode ? (
                <>
                    <input value={name} onChange={e => setName(e.target.value)} />
                    <input type="number" value={age} onChange={e => setAge(e.target.value)} />
                    <select value={gender} onChange={e => setGender(e.target.value)}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <input value={color} onChange={e => setColor(e.target.value)} />
                    <input value={nickname} onChange={e => setNickname(e.target.value)} />
                    <input value={owner} onChange={e => setOwner(e.target.value)} />
                    <button onClick={handleSave}>Save</button>
                </>
            ) : (
                <>
                    <h1>{dog.name}</h1>
                    <p>Age: {dog.age}</p>
                    <p>Gender: {dog.gender}</p>
                    <p>Color: {dog.color}</p>
                    <p>Nickname: {dog.nickname}</p>
                    <p>Owner: {dog.owner}</p>
                    <button onClick={() => setEditMode(true)}>Edit</button>
                </>
            )}
        </div>
    );
};

export default DogDetail;
