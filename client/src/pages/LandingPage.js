import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './LandingPage.css';

// Import images
const dogListPreview = process.env.PUBLIC_URL + '/images/dog-list-preview.png';
const dogDetailPreview = process.env.PUBLIC_URL + '/images/dog-detail-preview.png';

const LandingPage = () => {
  const { loginWithRedirect } = useAuth0();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const openModal = (image) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage('');
  };

  return (
    <div className="landing-page">
      <h1>Welcome to Bark Buddy!</h1>
      <p>Your personal dog dictionary app.</p>
      
      <div className="app-description">
        <p>BarkBuddy is your go-to app for keeping track of all the wonderful dogs you meet at the dog park. Whether you're a dog owner or just a dog lover, BarkBuddy allows you to create a personalized dictionary of dogs with detailed information and photos.</p>
        <p>With BarkBuddy, you can:</p>
        <ul>
          <li>Add and store pictures and information about dogs you encounter.</li>
          <li>Assign each dog a unique identifier, making it easy to share their profile with friends or fellow dog park visitors.</li>
          <li>Enjoy a user-friendly interface designed to be intuitive and easy to navigate.</li>
          <li>Access the app on any device, thanks to its fully responsive design.</li>
        </ul>
      </div>

      <div className="auth-buttons">
        <button onClick={() => loginWithRedirect()} className="login-button">Login</button>
        <button onClick={() => loginWithRedirect()} className="signup-button">Sign Up</button>
      </div>

      <div className="preview">
        <h2>Preview the App</h2>
        <p>Get a sneak peek at what BarkBuddy has to offer!</p>
        <div className="preview-images">
          <img 
            src={dogListPreview} 
            alt="Dog List Preview" 
            className="preview-image" 
            onClick={() => openModal(dogListPreview)}
          />
          <img 
            src={dogDetailPreview} 
            alt="Dog Detail Preview" 
            className="preview-image" 
            onClick={() => openModal(dogDetailPreview)}
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <span className="close-button" onClick={closeModal}>&times;</span>
          <img src={modalImage} alt="Preview" className="modal-content" />
        </div>
      )}
    </div>
  );
};

export default LandingPage;

