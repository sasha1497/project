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
import Profile from '../pages/profile/profile';
import ProfileDetail from '../pages/profile/components/viewprofile/ProfileDetail';
import Footer from '../components/footer/footer';
import NotFound from '../pages/notfound/notfound';
import PrivateRoute from '../routes/components/privateroute';
import About from '../pages/about/about';
import Rule from '../pages/rules/rules';
import Conclusion from '../pages/conclusion/conclusion';
import PrivacyPolicy from '../pages/privacyPolicy/privacyPolicy';
import DeleteAccount from '../pages/deleteAccount/deleteAccount';

const AppRoutes = () => {
  const { pathname } = useLocation();
  const showLayout = ['/', '/dashboard', '/signup', '/profile', '/delete-account' ].includes(pathname) || pathname.startsWith('/profile/');
  const showLayoutFooter = ['/', '/dashboard', '/signup' ].includes(pathname);


  return (
    <>
      {showLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Rule />} />
        <Route path="/conclusion" element={< Conclusion />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route
          path="/delete-account"
          element={
            <PrivateRoute>
              <DeleteAccount />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <PrivateRoute>
              <ProfileDetail />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showLayoutFooter && <Footer />}
    </>
  );
};

export default AppRoutes;
