import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchDogs, fetchDogCount, deleteDog, updateDog } from '../features/dogs/dogsSlice'; // Ensure you have an action for updating the dog
import { FaTimes, FaHeart, FaRegHeart } from 'react-icons/fa';
import NavBar from './NavBar';
import './DogList.css';

const DogList = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const dogs = useSelector((state) => state.dogs.dogs);
  const count = useSelector((state) => state.dogs.count);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          await dispatch(fetchDogs({ getAccessTokenSilently }));
          await dispatch(fetchDogCount({ getAccessTokenSilently }));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [dispatch, user, getAccessTokenSilently]);

  const filteredDogs = dogs.filter((dog) => {
    const matchesSearch = dog.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'my' && dog.isOwner) ||
      (activeTab === 'favorites' && dog.isFavorite);
    return matchesSearch && matchesTab;
  });

  const recentsDogs = [...dogs]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

    const toggleFavorite = async (dog) => {
      try {
        const updatedDog = { ...dog, isFavorite: !dog.isFavorite };
        await dispatch(updateDog({ id: dog.id, formData: updatedDog, getAccessTokenSilently }));
      } catch (error) {
        console.error('Error updating favorite status:', error);
      }
    };
    
    

  return (
    <>
      <NavBar />
      <div className="dog-list">
        <div className="title-container">
          <h1 className="h1-title">BarkBuddy</h1>
          <img
            src={process.env.PUBLIC_URL + '/images/dog-head.png'}
            alt="Dog Head"
            className="dog-head-image"
          />
        </div>

        {/* Tabs Section */}
        <div className="flex border-b border-gray-300 px-4 gap-8">
          <button
            className={`flex flex-col items-center justify-center pb-3 pt-4 ${
              activeTab === 'all'
                ? 'border-b-4 text-black font-bold'
                : 'border-b-4 border-transparent text-gray-500'
            }`}
            style={{
              borderBottomColor: activeTab === 'all' ? '#ff4500' : 'transparent',
            }}
            onClick={() => setActiveTab('all')}
          >
            All Dogs
          </button>
          <button
            className={`flex flex-col items-center justify-center pb-3 pt-4 ${
              activeTab === 'my'
                ? 'border-b-4 text-black font-bold'
                : 'border-b-4 border-transparent text-gray-500'
            }`}
            style={{
              borderBottomColor: activeTab === 'my' ? '#ff4500' : 'transparent',
            }}
            onClick={() => setActiveTab('my')}
          >
            My Dogs
          </button>
          <button
            className={`flex flex-col items-center justify-center pb-3 pt-4 ${
              activeTab === 'favorites'
                ? 'border-b-4 text-black font-bold'
                : 'border-b-4 border-transparent text-gray-500'
            }`}
            style={{
              borderBottomColor: activeTab === 'favorites' ? '#ff4500' : 'transparent',
            }}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
          <button
            className={`flex flex-col items-center justify-center pb-3 pt-4 ${
              activeTab === 'recents'
                ? 'border-b-4 text-black font-bold'
                : 'border-b-4 border-transparent text-gray-500'
            }`}
            style={{
              borderBottomColor: activeTab === 'recents' ? '#ff4500' : 'transparent',
            }}
            onClick={() => setActiveTab('recents')}
          >
            Recents
          </button>
        </div>

        {/* Search and Add Buddy Section */}
        <div className="header-actions flex items-center justify-between p-4">
          <div className="text-lg font-bold">Total Buddies: {count}</div>
          <input
            type="text"
            placeholder="Search buddies..."
            className="border rounded-lg px-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link
            to="/add-dog"
            className="text-white px-4 py-2 rounded-lg"
            style={{
              backgroundColor: '#ff4500',
            }}
          >
            Add Buddy
          </Link>
        </div>

        {/* Dog Grid Section */}
        <div className="dog-grid grid gap-4 p-4">
          {(activeTab === 'recents' ? recentsDogs : filteredDogs).length > 0 ? (
            (activeTab === 'recents' ? recentsDogs : filteredDogs).map((dog) => (
              <div
                key={dog.id}
                className="dog-card p-4 shadow-lg rounded-lg relative group"
              >
                {/* Delete Button */}
                <button
                  onClick={() => dispatch(deleteDog({ id: dog.id, getAccessTokenSilently }))}
                  className="absolute top-2 left-2 bg-[#ff4500] text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <FaTimes size={12} />
                </button>

                {/* Favorite Toggle Button */}
                <button
                  onClick={() => toggleFavorite(dog)}
                  className="absolute top-2 right-2 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{
                    backgroundColor: dog.isFavorite ? '#ff4500' : 'rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {dog.isFavorite ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
                </button>

                <Link to={`/dog/${dog.id}`} className="dog-link flex flex-col items-center">
                  <div
                    className="dog-image bg-cover bg-center w-full h-40 rounded-lg"
                    style={{
                      backgroundImage: `url(${dog.image || '/images/default-dog.png'})`,
                    }}
                  ></div>
                  <div className="dog-info mt-2 text-center">
                    <h3 className="dog-name text-lg font-bold">{dog.name}</h3>
                    <p className="dog-breed text-gray-500">{dog.breed}</p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No dogs found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DogList;









