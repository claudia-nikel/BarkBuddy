import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FaTrash, FaHome } from 'react-icons/fa'; // Import the star icon
import NavBar from './NavBar';
import { fetchDogs, fetchDogCount, deleteDog, fetchOwnedDogs } from '../features/dogs/dogsSlice';
import './DogList.css';

const DogList = ({ showOwnedDogs }) => {
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const dogs = useSelector((state) => state.dogs.dogs);
  const count = useSelector((state) => state.dogs.count);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          if (showOwnedDogs) {
            dispatch(fetchOwnedDogs({ getAccessTokenSilently }));
          } else {
            dispatch(fetchDogs({ getAccessTokenSilently }));
          }
          dispatch(fetchDogCount({ getAccessTokenSilently }));
        } catch (error) {
          console.error('Error fetching token:', error);
        }
      }
    };

    fetchData();
  }, [dispatch, user, getAccessTokenSilently, showOwnedDogs]);

  const handleDelete = async (id) => {
    try {
      dispatch(deleteDog({ id, getAccessTokenSilently }));
    } catch (error) {
      console.error('Error deleting dog:', error);
    }
  };

  return (
    <>
      <NavBar /> {/* Include NavBar */}
      <div className="dog-list">
        <div className="title-container">
          <h1 className="h1-title">BarkBuddy</h1>
          <img src={process.env.PUBLIC_URL + '/images/dog-head.png'} alt="Dog Head" className="dog-head-image" />
        </div>
        <div className="header-actions">
          <Link to="/add-dog" className="add-dog-link">Add Buddy</Link>
          <div className="dog-count">Total Dogs: {count}</div>
          <div className="header-right">
            <div className="dropdown">
              <button className="dropbtn">{user?.name || 'User'}</button>
              <div className="dropdown-content">
                <Link to="/">All Dogs</Link>
                <Link to="/my-dogs">My Dogs</Link>
                <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
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
                    <span className="dog-name">
                      {dog.name}
                      {dog.isOwner && <FaHome className="owner-icon" />} {/* Add star icon if isOwner is true */}
                    </span>
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
    </>
  );
};

export default DogList;
