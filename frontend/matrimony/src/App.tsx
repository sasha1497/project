
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router } from 'react-router-dom';
// import './App.css';
// import AppRoutes from './routes/routes';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Loader from './components/loader/loader'; // Your custom loader component

// function App() {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   if (loading) {
//     return <Loader />;
//   }

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
import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppRoutes from './routes/routes';
import Loader from './components/loader/loader';
import ErrorBoundary from './components/error/ErrorBoundary';

function App() {
  return (
    <>
      <Router>
        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
            <div className="App">
              <AppRoutes />
            </div>
          </Suspense>
        </ErrorBoundary>
      </Router>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
