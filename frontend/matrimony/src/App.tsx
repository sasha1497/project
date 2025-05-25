import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router, Routes, Route
import './App.css';
import Navbar from './components/navbar/navbar';
import Section from './components/section/section';
import SignUp from './pages/signup/signup'; 
import AppRoutes from './routes/routes';

function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes/>
      </div>
    </Router>
  );
}

export default App;
