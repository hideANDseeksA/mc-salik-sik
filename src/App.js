import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import Login from './components/Login';
import MainDashboard from './components/dashboad'; // Ensure dashboard path is correct
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const clientId = "303466688534-lk23to2rslkmgfngp1mesvbvr66e0q8e.apps.googleusercontent.com"; // Your Google client ID

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}> {/* Wrap your Router with GoogleOAuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Home redirects to Login */}
          <Route path="/login" element={<Login />} /> {/* Explicit login route */}
          <Route path="/dashboard" element={<MainDashboard />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
