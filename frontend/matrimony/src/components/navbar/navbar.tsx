import { motion } from "framer-motion";
import logo from "../../asset/bajollogo.jpeg";
import './navbar.css';
import { useLocation } from 'react-router-dom';


import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate(); // initialize it

  const location = useLocation();
  const isSignupPage = location.pathname === '/signup';
  const isProfilePage = location.pathname === '/profile'


  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const storedImage = localStorage.getItem("uploadedPhoto");
    if (storedImage) {
      setImageSrc(storedImage);
    }
  }, []);



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
          {/* {(isSignupPage || isProfilePage) ? (
            <div className="d-flex align-items-center justify-content-end parent-right-content">
              {isSignupPage ? (
                <span className="dot"></span>
              ) : (
                imageSrc && (
                  <img
                    src={imageSrc}
                    alt="Uploaded"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                )
              )}
               <span className="mx-2">
                {isSignupPage ? 'Welcome to Signup Page' : 'Welcome to Nattu'}
              </span>
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-end parent-right-content">
              <span className="me-2">Already a member?</span>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/signup")}
              >
                Login
              </button>
              <span className="mx-2">|</span>
              <a
                href="#"
                className="text-dark text-decoration-none d-inline-flex align-items-center"
              >
                Help
                <span className="material-icons me-2 ml-5 jump-icon">contact_support</span>
              </a>
            </div>
          )} */}

          {(isSignupPage || isProfilePage) ? (
            <div className="d-flex align-items-center justify-content-end parent-right-content">
              {isSignupPage ? (
                <>
                  <span className="dot"></span>
                  <span className="mx-2">Welcome to Signup Page</span>
                </>
              ) : (
                imageSrc && (
                  <div className="dropdown">
                    {/* Trigger (image + text) */}
                    <button
                      className="btn dropdown-toggle d-flex align-items-center border-0 bg-transparent"
                      type="button"
                      id="profileDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src={imageSrc}
                        alt="Profile"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <span className="mx-2 d-none d-sm-inline">Welcome to Nattu</span>
                    </button>

                    {/* Dropdown menu */}
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                      <li><button className="dropdown-item">Edit</button></li>
                      <li><button className="dropdown-item">Delete Account</button></li>
                      <li><button className="dropdown-item">Logout</button></li>
                    </ul>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-end parent-right-content">
              <span className="me-2">Already a member?</span>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/signup")}
              >
                Login
              </button>
              <span className="mx-2">|</span>
              <a
                href="#"
                className="text-dark text-decoration-none d-inline-flex align-items-center"
              >
                Help
                <span className="material-icons me-2 ml-5 jump-icon">contact_support</span>
              </a>
            </div>
          )}


        </div>
      </motion.nav>
    </>
  )
}
export default Navbar;