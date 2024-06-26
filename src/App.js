import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DogList from './components/DogList';
import AddDog from './components/AddDog';
import DogDetail from './components/DogDetail';
import UserDogPage from './components/UserDogPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DogList />} />
        <Route path="/add-dog" element={<AddDog />} />
        <Route path="/dog/:id" element={<DogDetail />} />
        <Route path="/user-dog/:id" element={<UserDogPage />} />
      </Routes>
    </Router>
  );
};

export default App;

