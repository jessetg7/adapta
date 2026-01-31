// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeDefaultData } from './utils/storage';

import './index.css';

// Initialize default data
try {
  initializeDefaultData();
} catch (e) {
  console.warn("Could not initialize default data:", e);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = '<div style="color: red; padding: 20px;">FATAL ERROR: Root element not found!</div>';
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Render Error:", err);
    rootElement.innerHTML = `<div style="color: red; padding: 20px;">
            <h1>Application Error</h1>
            <pre>${err.message}\n${err.stack}</pre>
        </div>`;
  }
}