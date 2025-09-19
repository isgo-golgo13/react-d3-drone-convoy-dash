import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Wait for Google Maps to be ready before rendering
const initApp = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
};

// Check if Google Maps is already loaded
if (window.google && window.google.maps) {
  initApp();
} else {
  // Wait for Google Maps to load
  window.addEventListener('google-maps-ready', initApp);
  
  // Fallback: init after timeout if maps fail to load
  setTimeout(() => {
    if (!window.google || !window.google.maps) {
      console.warn('Google Maps failed to load, initializing app anyway');
      initApp();
    }
  }, 5000);
}