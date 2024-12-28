import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchOwnedDogs, deleteDog } from '../features/dogs/dogsSlice';
import { FaHome, FaTimes } from 'react-icons/fa';
import NavBar from './NavBar';
import './MyDogs.css';

const MyDogs = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const myDogs = useSelector((state) => state.dogs.dogs.filter((dog) => dog.isOwner)); // Filter for owned dogs
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          dispatch(fetchOwnedDogs({ getAccessTokenSilently }));
        } catch (error) {
          console.error('Error fetching owned dogs:', error);
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
    <>
      <NavBar />
      <div className="my-dogs-container">
        <header className="my-dogs-header">
          <h1 className="my-dogs-title">My Dogs</h1>
          <Link to="/add-dog" className="add-dog-button">
            Add Buddy
          </Link>
        </header>
        <div className="dog-count-box">Total Dogs: {myDogs.length}</div>
        <div className="dog-grid">
          {myDogs && myDogs.length > 0 ? (
            myDogs.map((dog) => (
              <div key={dog.id} className="dog-card">
                <div className="dog-card-overlay">
                  <button
                    onClick={() => handleDelete(dog.id)}
                    className="delete-icon"
                    title="Delete Dog"
                  >
                    <FaTimes />
                  </button>
                </div>
                <Link to={`/dog/${dog.id}`} className="dog-link">
                  <div
                    className="dog-image"
                    style={{
                      backgroundImage: `url(${dog.image || '/images/default-dog.png'})`,
                    }}
                  ></div>
                  <div className="dog-info">
                    <h3 className="dog-name">{dog.name}</h3>
                    <p className="dog-breed">{dog.breed}</p>
                  </div>
                  <FaHome className="owner-icon" />
                </Link>
              </div>
            ))
          ) : (
            <p>No dogs found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default MyDogs;


