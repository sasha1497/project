import { motion } from "framer-motion";
import logo from "../../asset/bajollogo.jpeg";
import './navbar.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from "react";
import { logout } from "../../features/auth/authSlice";
import { useAppLanguage } from "../../i18n/LanguageContext";
import {
  persistLanguageFromState,
  setAppLanguage,
  STATE_LANGUAGE_OPTIONS,
} from "../../i18n/language";

const Navbar = () => {
  const navigate = useNavigate();
  const { t } = useAppLanguage();

  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);

  const location = useLocation();
  const isSignupPage = location.pathname === '/signup';
  const isProfilePage = location.pathname === '/profile';

  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('authToken');
    localStorage.removeItem('selected_state');
    navigate('/dashboard');
  };

  const toggleHelpTooltip = () => {
    setShowHelpTooltip(!showHelpTooltip);
  };

  const toggleLanguagePopup = () => {
    setShowLanguagePopup((prev) => !prev);
  };

  const handleEnglishSelect = () => {
    setAppLanguage('en');
    setShowLanguagePopup(false);
  };

  const handleStateLanguageSelect = (stateName: string) => {
    if (!stateName) {
      return;
    }

    persistLanguageFromState(stateName);
    setShowLanguagePopup(false);
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
              <button
                type="button"
                className="btn btn-link text-dark text-decoration-none d-inline-flex align-items-center"
                onClick={toggleLanguagePopup}
                title="Change Language"
              >
                <span className="material-icons">public</span>
              </button>

              {isSignupPage ? (
                <>
                  <span className="dot"></span>
                  <span className="mx-2">{t('navbar.signupWelcome')}</span>
                </>
              ) : (
                <div className="dropdown">
                  <button
                    className="btn btn-lg dropdown-toggle d-flex align-items-center border-0 bg-transparent text-primary"
                    type="button"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="mx-2 d-none d-sm-inline text-primary">
                      {user && <span><b>{t('navbar.welcomeBajol')}</b></span>}
                    </span>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-end parent-right-content">
              <div className="position-relative d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-link text-dark text-decoration-none d-inline-flex align-items-center"
                  onClick={toggleLanguagePopup}
                  title="Change Language"
                >
                  <span className="material-icons">public</span>
                </button>

                <button
                  type="button"
                  className="btn btn-link text-dark text-decoration-none d-inline-flex align-items-center"
                  onClick={toggleHelpTooltip}
                >
                  {t('navbar.help')}
                  <span className="material-icons me-2 ms-1 jump-icon">contact_support</span>
                </button>

                {showHelpTooltip && (
                  <div className="help-tooltip shadow-sm bg-white border rounded px-3 py-2 position-absolute" style={{ top: '120%', right: 0, zIndex: 999, border: '10px solid blue' }}>
                    <div><strong>Support : 24 x 5</strong></div>
                    <div>Email: <a href="mailto:support@bajolmatrimony.com">bajolonlinematrimony@gmail.com</a></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.nav>

      {showLanguagePopup && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowLanguagePopup(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 420,
              background: '#fff',
              borderRadius: 12,
              padding: '1rem',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <h5 style={{ marginBottom: '0.5rem' }}>Select your language</h5>
            <p style={{ marginBottom: '0.75rem', color: '#666' }}>
              Choose English or select your state language.
            </p>

            <button
              type="button"
              className="btn btn-outline-primary w-100 mb-3"
              onClick={handleEnglishSelect}
            >
              English
            </button>

            <select
              className="form-select"
              defaultValue=""
              onChange={(event) => handleStateLanguageSelect(event.target.value)}
            >
              <option value="" disabled>Select Your State</option>
              {STATE_LANGUAGE_OPTIONS.map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
