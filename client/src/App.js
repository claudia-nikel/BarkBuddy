import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import DogList from './components/DogList';
import AddDog from './components/AddDog';
import DogDetail from './components/DogDetail';
import UserDogPage from './components/UserDogPage';
import LoginPage from './pages/LoginPage';
import './App.css'; // Assuming you have a global CSS file.

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? <Component {...rest} /> : <LoginPage />;
};

const App = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dog-list" element={<ProtectedRoute component={DogList} />} />
        <Route path="/add-dog" element={<ProtectedRoute component={AddDog} />} />
        <Route path="/dog/:id" element={<ProtectedRoute component={DogDetail} />} />
        <Route path="/user-dog/:id" element={<ProtectedRoute component={UserDogPage} />} />
      </Routes>
    </div>
  );
};

export default App;






