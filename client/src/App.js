import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DogList from './components/DogList';
import AddDog from './components/AddDog';
import DogDetail from './components/DogDetail';
import LandingPage from './pages/LandingPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dogs" element={<DogList />} />
        <Route path="/add-dog" element={<AddDog />} />
        <Route path="/dog/:id" element={<DogDetail />} />
      </Routes>
    </div>
  );
}

export default App;








