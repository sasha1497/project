import React from 'react';

const Footer = () => {
  return (
    <footer className="text-light pt-5 pb-3" style={{background: 'linear-gradient(to right, #1e3c72, #2a5298)'}}>
      <div className="container-fluid">
        <div className="row">

          {/* Services */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase mb-3">Services</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Lorem Ipsum</a></li>
              <li><a href="#" className="text-light text-decoration-none">Dummy Text</a></li>
              <li><a href="#" className="text-light text-decoration-none">Printing & Typesetting</a></li>
              <li><a href="#" className="text-light text-decoration-none">Standard Dummy Text</a></li>
              <li><a href="#" className="text-light text-decoration-none">Specimen Book</a></li>
            </ul>
          </div>

          {/* Page Links */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase mb-3">Page Links</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Home</a></li>
              <li><a href="#" className="text-light text-decoration-none">About</a></li>
              <li><a href="#" className="text-light text-decoration-none">Services</a></li>
              <li><a href="#" className="text-light text-decoration-none">Contact</a></li>
              <li><a href="#" className="text-light text-decoration-none">FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter */}
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
        </div>

        <hr className="bg-light" />
        <div className="text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} Bajol. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
