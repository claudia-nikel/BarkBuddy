import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'; // Replaced useHistory with useNavigate
import { useAuth0 } from '@auth0/auth0-react';
import { fetchDogs, fetchDogCount, deleteDog } from '../features/dogs/dogsSlice';
import './DogList.css';

const DogList = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const dogs = useSelector((state) => state.dogs.dogs);
  const count = useSelector((state) => state.dogs.count);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Replaced useHistory with useNavigate

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          dispatch(fetchDogs({ getAccessTokenSilently })); // Fetch dogs for the authenticated user
          dispatch(fetchDogCount({ getAccessTokenSilently })); // Fetch the dog count for the authenticated user
        } catch (error) {
          console.error('Error fetching token:', error);
        }
      } else {
        navigate('/'); // Redirect to the landing page if not authenticated
      }
    };

    fetchData();
  }, [dispatch, user, getAccessTokenSilently, navigate]); // Added navigate to dependency array

  const handleDelete = async (id) => {
    try {
      dispatch(deleteDog({ id, getAccessTokenSilently })); // Delete the selected dog
    } catch (error) {
      console.error('Error deleting dog:', error);
    }
  };

  useEffect(() => {
    console.log('Dogs:', dogs); // Log the dogs for debugging
  }, [dogs]);

  return (
    <div className="dog-list">
      <h1 className="h1-title">Bark Buddy</h1>
      <div className="header-actions">
        <Link to="/add-dog" className="add-dog-link">Add Buddy</Link>
        <div className="dog-count">Total Dogs: {count}</div>
      </div>
      <ul>
        {dogs && dogs.length > 0 ? (
          dogs.map((dog) => (
            <li key={dog.id} className="dog-item">
              <Link to={`/dog/${dog.id}`}>{dog.name}</Link>
              <span className="dog-breed">{dog.breed}</span>
              <button onClick={() => handleDelete(dog.id)} className="delete-button">Delete</button>
            </li>
          ))
        ) : (
          <p>No dogs found</p>
        )}
      </ul>
    </div>
  );
};

export default DogList;











