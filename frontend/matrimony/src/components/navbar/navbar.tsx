import { motion } from "framer-motion";
import logo from "../../asset/bajollogo.jpeg";
import './navbar.css';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { openViewPopup } from "../../features/profileui/profileUISlice";

const Navbar = () => {
  const navigate = useNavigate(); // initialize it

  const [showHelpTooltip, setShowHelpTooltip] = useState(false);


  const location = useLocation();
  const isSignupPage = location.pathname === '/signup';
  const isProfilePage = location.pathname === '/profile'

  const { user } = useSelector((state: any) => state.auth);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); // Clear Redux state
    localStorage.removeItem('authToken'); // Remove token
    navigate('/dashboard'); // Redirect
  };

  const toggleHelpTooltip = () => {
    setShowHelpTooltip(!showHelpTooltip);
  };





  return (
    <>
      <motion.nav
        className="navbar sticky-top navbar-light navbar-expand-lg bg-light"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 5 }}
      >
        <div className="container">
          <motion.a
            className="navbar-brand d-flex align-items-center"
            href="#"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
          >
            <img
              src={logo}
              alt="Logo"
              className="logo-img"
            />
            <span className="brand-text">Bajol Matrimony</span>
          </motion.a>

          {(isSignupPage || isProfilePage) ? (
            <div className="d-flex align-items-center justify-content-end parent-right-content">
              {isSignupPage ? (
                <>
                  <span className="dot"></span>
                  <span className="mx-2">Welcome to Signup Page</span>
                </>
              ) : (
                <div className="dropdown">
                  <button
                    className="btn dropdown-toggle d-flex align-items-center border-0 bg-transparent"
                    type="button"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="mx-2 d-none d-sm-inline">{user && <span>Welcome, {user?.name}</span>}</span>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                    <li><button className="dropdown-item" onClick={() => dispatch(openViewPopup())}>View profile</button></li>
                    <li><button className="dropdown-item">Delete Account</button></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
                // )
              )}
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-end parent-right-content">
              <span className="me-2">Already a member?</span>
              <button
                type="button"
                className="btn btn-primary blinking-btn"
                onClick={() => navigate("/signup")}
              >
                Now Login
              </button>
              <span className="mx-2">|</span>
              {/* <a
                href="#"
                className="text-dark text-decoration-none d-inline-flex align-items-center"
              >
                Help
                <span className="material-icons me-2 ml-5 jump-icon">contact_support</span>
              </a> */}
              <div className="position-relative">
                <button
                  type="button"
                  className="btn btn-link text-dark text-decoration-none d-inline-flex align-items-center"
                  onClick={toggleHelpTooltip}
                >
                  Help
                  <span className="material-icons me-2 ms-1 jump-icon">contact_support</span>
                </button>

                {showHelpTooltip && (
                  <div className="help-tooltip shadow-sm bg-white border rounded px-3 py-2 position-absolute" style={{ top: '120%', right: 0, zIndex: 999, border:'10px solid blue'}}>
                    <div><strong>Support : 24 x 5</strong></div>
                    <div>Email: <a href="mailto:support@bajolmatrimony.com">bajolonlinematrimony@gmail.com</a></div>
                  </div>
                )}
              </div>
            </div>
          )}


        </div>
      </motion.nav>
    </>
  )
}
export default Navbar;