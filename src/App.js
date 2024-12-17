import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import Login from './components/Login';
import Footer from './components/Footer';
import MainDashboard from './components/dashboad'; // Ensure the dashboard path is correct
import ViewPDF from './components/ViewPDF'; // Import the ViewPDF component
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const clientId = "303466688534-fon7ihih5hpsq3349jgh7ft700ptsc3a.apps.googleusercontent.com"; // Your Google client ID

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Home redirects to Login */}
          <Route path="/login" element={<Login />} /> {/* Explicit login route */}
          <Route path="/dashboard" element={<MainDashboard />} /> {/* Main dashboard route */}
          <Route path="/view-pdf" element={<ViewPDF />} /> {/* Route for viewing PDFs */}
        </Routes>
      </Router>
  <Footer />
    </GoogleOAuthProvider>
  );
}

export default App;
