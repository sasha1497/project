import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './app/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
     <Provider store={store}>
      <App />
    </Provider>
);

reportWebVitals();



// import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { Provider } from 'react-redux';
// import { store } from './app/store';
// import Loader from '../src/components/loader/loader';

// const RootApp = () => {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 1000); // simulate loading time
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       {loading && <Loader />}
//       <App />
//     </>
//   );
// };

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <RootApp />
//     </Provider>
//   </React.StrictMode>
// );

// reportWebVitals();
