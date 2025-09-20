// import { motion } from "framer-motion";
// import thatha from "../../asset/thatha.jpg";
// import balde from "../../asset/balde.jpg";
// import balde2 from "../../asset/balde2.jpg";
// import b1 from "../../asset/b1.jpg";
// import b2 from "../../asset/b2.jpg";
// import b3 from "../../asset/b3.jpg";
// import b4 from "../../asset/b4.jpg";
// import b5 from "../../asset/b5.jpg";



// import "./couplesOld.css";

// const CouplesOld = () => {
//     const coupleImages = [thatha, b1, b2, b3, b4, b5];

//     return (
//         <div className="container-fluid my-4">
//             <motion.h2
//                 className="text-center mb-4 fw-bold hero"
//                 initial={{ opacity: 0, y: -30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, ease: "easeOut" }}
//             >
//                 💞 Timeless Bonds 👵👴 | ❤️ Old is Gold 💍
//             </motion.h2>

//             <motion.div
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.7 }}
//             >
//                 <div
//                     id="couplesCarousel"
//                     className="carousel slide"
//                     data-bs-ride="carousel"
//                     data-bs-interval="3000"
//                 >
//                     <div className="carousel-inner">
//                         {coupleImages.map((image, index) => (
//                             <div
//                                 key={index}
//                                 className={`carousel-item ${index === 0 ? "active" : ""}`}
//                             >
//                                 <motion.img
//                                     src={image}
//                                     className="d-block w-100 carousel-img"
//                                     alt={`Couple ${index + 1}`}
//                                     initial={{ opacity: 0, scale: 0.95 }}
//                                     animate={{ opacity: 1, scale: 1 }}
//                                     transition={{ duration: 0.6 }}
//                                 />
//                             </div>
//                         ))}
//                     </div>

//                     {/* Carousel Controls */}
//                     <button
//                         className="carousel-control-prev"
//                         type="button"
//                         data-bs-target="#couplesCarousel"
//                         data-bs-slide="prev"
//                     >
//                         <span className="carousel-control-prev-icon custom-arrow" aria-hidden="true"></span>
//                         <span className="visually-hidden">Previous</span>
//                     </button>
//                     <button
//                         className="carousel-control-next"
//                         type="button"
//                         data-bs-target="#couplesCarousel"
//                         data-bs-slide="next"
//                     >
//                         <span className="carousel-control-next-icon custom-arrow" aria-hidden="true"></span>
//                         <span className="visually-hidden">Next</span>
//                     </button>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };

// export default CouplesOld;

import { motion } from "framer-motion";
import thatha from "../../asset/thatha.jpg";
import b1 from "../../asset/b1.jpg";
import b2 from "../../asset/b2.jpg";
import b3 from "../../asset/b3.jpg";
import b4 from "../../asset/b4.jpg";
import b5 from "../../asset/b5.jpg";

import "./couplesOld.css";

const CouplesOld = () => {
  const coupleImages = [thatha, b1, b2, b3, b4, b5];

  return (
    <div className="container-fluid my-4">
      {/* Animated Heading */}
      <motion.h2
        className="text-center mb-4 fw-bold hero"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        💞 Timeless Bonds 👵👴 | ❤️ Old is Gold 💍
      </motion.h2>

      {/* Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div
          id="couplesCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="3000"
        >
          <div className="carousel-inner">
            {coupleImages.map((image, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <motion.img
                  src={image}
                  className="d-block w-100 carousel-img"
                  alt={`Couple ${index + 1}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            ))}
          </div>

          {/* Carousel Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#couplesCarousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon custom-arrow"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#couplesCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon custom-arrow"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CouplesOld;

