import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FaTrash } from 'react-icons/fa'; // Import the garbage can icon
import { fetchDogs, fetchDogCount, deleteDog } from '../features/dogs/dogsSlice';
import './DogList.css';

const DogList = () => {
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const dogs = useSelector((state) => state.dogs.dogs);
  const count = useSelector((state) => state.dogs.count);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          dispatch(fetchDogs({ getAccessTokenSilently }));
          dispatch(fetchDogCount({ getAccessTokenSilently }));
        } catch (error) {
          console.error('Error fetching token:', error);
        }
      }
    };

    fetchData();
  }, [dispatch, user, getAccessTokenSilently]);

  const handleDelete = async (id) => {
    try {
      dispatch(deleteDog({ id, getAccessTokenSilently }));
    } catch (error) {
      console.error('Error deleting dog:', error);
    }
  };

  return (
    <div className="dog-list">
      <div className="title-container">
        <h1 className="h1-title">Bark Buddy</h1>
        <img src={process.env.PUBLIC_URL + '/images/dog-head.png'} alt="Dog Head" className="dog-head-image" />
      </div>
      <div className="header-actions">
        <Link to="/add-dog" className="add-dog-link">Add Buddy</Link>
        <div className="dog-count">Total Dogs: {count}</div>
        <div className="header-right">
          <div className="dropdown">
            <button className="dropbtn">{user?.name || 'User'}</button>
            <div className="dropdown-content">
              <button onClick={() => logout({ returnTo: window.location.origin })}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
      <ul>
        {dogs && dogs.length > 0 ? (
          dogs.map((dog) => (
            <li key={dog.id} className="dog-item">
              <Link to={`/dog/${dog.id}`} className="dog-link">
                <div className="dog-item-content">
                  <span className="dog-name">{dog.name}</span>
                  <span className="dog-breed">{dog.breed}</span>
                </div>
              </Link>
              <button onClick={() => handleDelete(dog.id)} className="delete-button">
                <FaTrash />
              </button>
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
