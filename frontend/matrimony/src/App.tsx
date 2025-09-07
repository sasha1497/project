// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router, Routes, Route
// import './App.css';
// import Navbar from './components/navbar/navbar';
// import Section from './components/section/section';
// import SignUp from './pages/signup/signup';
// import AppRoutes from './routes/routes';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function App() {
//   return (
//     <>
//       <Router>
//         <div className="App">
//           <AppRoutes />
//         </div>
//       </Router>
//       <ToastContainer position="top-right" autoClose={2000} />
//     </>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRoutes from './routes/routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './components/loader/loader'; // Your custom loader component

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
