// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';
import './index.css';
import Auth0ProviderWithHistory from './auth/Auth0ProviderWithHistory'; // Ensure this import is correct

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <Provider store={store}>
    <Router>
      <Auth0ProviderWithHistory>
        <App />
      </Auth0ProviderWithHistory>
    </Router>
  </Provider>
);







