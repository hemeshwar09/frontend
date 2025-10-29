import React from 'react';
import ReactDOM from 'react-dom/client';
import SalonList from './SalonList';

// Create root for React v18+
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <SalonList />
  </React.StrictMode>
);
