import React from 'react';
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <footer className="text-light pt-5 pb-3" style={{ background: 'linear-gradient(to right, #1e3c72, #2a5298)' }}>
      <div className="container-fluid">
        {/* <div className="row">

          Services
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase mb-3">Matrimony Services</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Profile Creation</a></li>
              <li><a href="#" className="text-light text-decoration-none">Matchmaking Services</a></li>
              <li><a href="#" className="text-light text-decoration-none">Personalized Matches</a></li>
              <li><a href="#" className="text-light text-decoration-none">Premium Member Assistance</a></li>
            </ul>
          </div>

          Page Links
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase mb-3">Page Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/about" className="text-light text-decoration-none">About</Link></li>
              <li><Link to="/terms" className="text-light text-decoration-none">The rules and directions </Link></li>
              <li><a href="#" className="text-light text-decoration-none">Contact</a></li>
              <li><Link to="/conclusion"  className="text-light text-decoration-none">Conclusion</Link></li>
            </ul>
          </div>

          Newsletter
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase mb-3">Subscribe</h5>
            <form className="d-flex">
              <button className="btn btn-primary" type="submit">
                Get started
              </button>
            </form>
            <div className="mt-3">
              <a href="#" className="text-light me-3"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-light me-3"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-light me-3"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-light"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div> */}
        <div className="row">

          {/* Services */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase mb-3">മാട്രിമോണി സേവനങ്ങൾ</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">പ്രൊഫൈൽ സൃഷ്ടി</a></li>
              <li><a href="#" className="text-light text-decoration-none">മാച്ച്മേക്കിംഗ് സേവനങ്ങൾ</a></li>
              <li><a href="#" className="text-light text-decoration-none">വ്യക്തിഗത മാച്ചുകൾ</a></li>
              <li><a href="#" className="text-light text-decoration-none">പ്രീമിയം അംഗ സഹായം</a></li>
            </ul>
          </div>

          {/* Page Links */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase mb-3">പേജ് ലിങ്കുകൾ</h5>
            <ul className="list-unstyled">
              <li><Link to="/about" className="text-light text-decoration-none">ഞങ്ങളെക്കുറിച്ച്</Link></li>
              <li><Link to="/terms" className="text-light text-decoration-none">നിയമങ്ങളും മാർഗനിർദ്ദേശങ്ങളും</Link></li>
              <li><a href="#" className="text-light text-decoration-none">ബന്ധപ്പെടുക</a></li>
              <li><Link to="/conclusion" className="text-light text-decoration-none">സംഗ്രഹം</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase mb-3">സബ്സ്ക്രൈബ് ചെയ്യുക</h5>
            <form className="d-flex">
              <button className="btn btn-primary" type="submit">
                ആരംഭിക്കുക
              </button>
            </form>
            <div className="mt-3">
              <a href="#" className="text-light me-3"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-light me-3"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-light me-3"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-light"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

        </div>


        <hr className="bg-light" />
        <div className="text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} BAJOL ONLINE MATRIMONY PRIVATE LIMITED. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
