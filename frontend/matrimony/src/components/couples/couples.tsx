import { motion } from "framer-motion";
import young1 from '../../asset/young1.jpg';
import young2 from '../../asset/young2.jpg';
import pink1 from '../../asset/pink1.jpg';
import pink2 from '../../asset/pink2.jpg';
import hair1 from '../../asset/hair1.jpg';
import hair2 from '../../asset/hair2.jpg';
import thatha from "../../asset/thatha.jpg";
import b1 from "../../asset/b1.jpg";


import './couples.css';

const Couples = () => {
    const coupleImages = [young1, pink1, young2, hair1, pink2, hair2, thatha, b1];

    return (
        <div className="container-fluid my-4">
            <motion.h2
                className="text-center mb-4 fw-bold hero"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                ❤️ Alliances for Every Age | Bajol Matrimony ❤️
            </motion.h2>

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
                            <motion.div
                                key={index}
                                className={`carousel-item ${index === 0 ? "active" : ""}`}
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <img
                                    src={image}
                                    className="d-block w-100 carousel-img"
                                    alt={`Couple ${index + 1}`}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Carousel Controls */}
                    {/* <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#couplesCarousel"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon custom-arrow" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#couplesCarousel"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon custom-arrow" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button> */}
                    <button className="carousel-control-prev" type="button" data-bs-target="#couplesCarousel" data-bs-slide="prev">
                        <i className="fa fa-chevron-left fs-1 text-primary"></i>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#couplesCarousel" data-bs-slide="next">
                        <i className="fa fa-chevron-right fs-1 text-primary"></i>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
                <motion.h2
                    className="text-center mb-2 fw-bold hero mt-2"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    See more photos touch on the photo more see
                </motion.h2>
            </motion.div>
        </div>
    );
};

export default Couples;
