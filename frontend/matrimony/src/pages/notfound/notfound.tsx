// const NotFound = () => {
//     return (
//       <div style={{ textAlign: 'center', marginTop: '50px' }}>
//         <h1>404</h1>
//         <p>Page Not Found</p>
//       </div>
//     );
//   }
  
//   export default NotFound;

import { Link } from 'react-router-dom';
import './notfound.css'; // You can keep your CSS in a separate file

const NotFound = () => {
  return (
    <section className="page_404 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <div className="four_zero_four_bg">
              <h1 className="text-center">404</h1>
            </div>

            <div className="contant_box_404 mt-4">
              <h3 className="h2">
                Looks like you're lost
              </h3>

              <p>The page you are looking for is not available!</p>

              <Link to="/" className="link_404 bg-primary">
                Go to Bajol
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
