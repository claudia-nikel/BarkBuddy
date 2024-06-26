import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DogList from './components/DogList';
import AddDog from './components/AddDog';
import DogDetail from './components/DogDetail';
import UserDogPage from './components/UserDogPage';
import './App.css'; // Assuming you have a global CSS file

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<DogList />} />
          <Route path="/add-dog" element={<AddDog />} />
          <Route path="/dog/:id" element={<DogDetail />} />
          <Route path="/user-dog/:id" element={<UserDogPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;



