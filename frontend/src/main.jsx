// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeDefaultData } from './utils/storage';

// Initialize default data
try {
  initializeDefaultData();
} catch (e) {
  console.warn("Could not initialize default data:", e);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);