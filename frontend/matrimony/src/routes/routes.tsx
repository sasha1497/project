// import { Routes, Route, useLocation } from 'react-router-dom';
// import Navbar from '../components/navbar/navbar';
// import Dashboard from '../pages/dashboard/dashboard';
// import SignUp from '../pages/signup/signup';
// import Footer from '../components/footer/footer';
// import NotFound from '../pages/notfound/notfound';

// const AppRoutes = () => {
//   const { pathname } = useLocation();
//   const showLayout = ['/','/dashboard', '/signup'].includes(pathname);

//   return (
//     <>
//       {showLayout && <Navbar />}
//       <Routes>
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//       {showLayout && <Footer />}
//     </>
//   );
// };

// export default AppRoutes;

import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '../components/navbar/navbar';
import Dashboard from '../pages/dashboard/dashboard';
import SignUp from '../pages/signup/signup';
import Profile from '../pages/profile/profile'; // 👈 import your profile page
import Footer from '../components/footer/footer';
import NotFound from '../pages/notfound/notfound';
import PrivateRoute from '../routes/components/privateroute'; // 👈 import the wrapper

const AppRoutes = () => {
  const { pathname } = useLocation();
  const showLayout = ['/', '/dashboard', '/signup', '/profile'].includes(pathname); // 👈 show navbar/footer on profile

  return (
    <>
      {showLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showLayout && <Footer />}
    </>
  );
};

export default AppRoutes;

