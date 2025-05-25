import { useEffect, useState } from "react";
import Banner from "../banner/banner";
import "./section.css";
import { motion } from "framer-motion";

const Section = () => {

  // const [imageSrc, setImageSrc] = useState<string | null>(null);

  // useEffect(() => {
  //   const storedImage = localStorage.getItem("uploadedPhoto");
  //   if (storedImage) {
  //     setImageSrc(storedImage);
  //   }
  // }, []);

  return (
    <div>
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hero-section"
      >
        <div className="container-fluid">
          <div className="row justify-content-md-center align-items-center">
            <div className="col-12 col-md-11 col-lg-9 col-xl-8 col-xxl-7">
              <motion.h2
                className="hero-title"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <p>💍 <span className="text-danger white-shadow-text">Dream</span> of <span className="text-danger white-shadow-text">Marriage</span></p>
              </motion.h2>
              <motion.p
                className="hero-subtext"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <span className="hero-subtext-inner">
                  There are three ways to a happy marriage: The first way is to be kind. The second way is to be kind. The third way is to be kind.              </span>
              </motion.p>
              <motion.div
                className="hero-btn-wrapper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <motion.button
                  type="button"
                  className="btn bsb-btn-2xl btn-outline-light"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
                >
                  🎉 Register Now
                </motion.button>
                {/* <div>
                  {imageSrc ? (
                    <img src={imageSrc} alt="Uploaded" style={{ width: 200, height: 'auto' }} />
                  ) : (
                    <p>No image found</p>
                  )}
                </div> */}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
      <div>
        {/* <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-sm-6 col-lg-3">Box 1</div>
            <div className="col-12 col-sm-6 col-lg-3">Box 2</div>
            <div className="col-12 col-sm-6 col-lg-3">Box 3</div>
          </div>
        </div>
      </div> */}
        <Banner />
      </div>
    </div>
  );
};

export default Section;
