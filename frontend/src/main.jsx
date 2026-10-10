import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx';
import './index.css';

// Set global base URL for API requests in production (Vercel)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';
axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = 'true';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
