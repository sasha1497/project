import './banner.css';
import { motion } from 'framer-motion';
import and from '../../asset/and.svg'
import ios from '../../asset/apple.svg'
import figure from '../../asset/figure.png'
import bajol from '../../asset/bajollogo.jpeg'
import Footer from '../footer/footer';
import { useState } from 'react';


const Banner = () => {

    const [showPopup, setShowPopup] = useState(false);

    const cards: { title: any, text: any }[] = [
        {
            title: "📝 Sign Up",
            text: "Register for free & put up your Matrimony Profile"
        },
        {
            title: "💞 Connect",
            text: "Select find your perfect match & Connect with Matches you like"
        },
        {
            title: "💬 Interact",
            text: "Become a  Member & Start a Conversation & Change your life style"
        },
    ];

    return (
        <div className="container-fluid" style={{ background: '#F5F5F5' }}>
            <div className="row">
                <div className="col-12 text-center">
                    <p className="hero-text">
                        <span className='text-danger'>&hearts;</span> Find your Special Someone <span className='text-danger'>&hearts;</span>
                    </p>
                </div>
            </div>
            <div className="container my-5">
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 justify-content-center">
                    {cards.map((card, index) => (
                        <div className="col d-flex justify-content-center" key={index}>
                            <motion.div
                                className="card card-3d bg-primary mb-5"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.05, rotate: 1 }}
                                transition={{ type: 'spring', stiffness: 100 }}
                            >
                                <div className="card-body">
                                    <h5 className="card-title text-white fs-50">{card.title}</h5>
                                    <p className="card-text text-white">{card.text}</p>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="row" style={{ background: '#251839' }}>
                <div className="col-12 col-md-6  text-white p-4 d-flex flex-column justify-content-center align-items-center text-center">
                    <p className='download-para'>
                        To speed up your partner search, download <b>Bajol App</b>
                    </p>
                    <div className='d-flex'>
                        <div className='p-3'>
                            <img src={and} alt="couple" className="img-fluid" onClick={() => setShowPopup(true)}
                            />
                        </div>
                        <div className='p-3'>
                            <img src={ios} alt="couple" className="img-fluid" onClick={() => setShowPopup(true)}
                            />
                        </div>
                    </div>
                    {/* Popup */}
                    {showPopup && (
                        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
                            <div
                                className="popup-content"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h4 className='text-primary'>🚀 Coming Soon</h4>
                                <p className='text-primary'>Our mobile app is launching soon. Stay tuned!</p>

                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={() => setShowPopup(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                    <p className='mt-3'>
                        BajolMatrimony® - Trusted Matrimony, Bajol App
                        <b>&nbsp;20,000+ Downloads</b>
                    </p>
                </div>
                <div className="col-12 col-md-6 text-white p-4">
                    <div className='d-flex'>
                        <div className='p-3'>
                            {/* <img src={figure} alt="couple" className="img-fluid" /> */}
                            <motion.img
                                src={figure}
                                alt="couple"
                                className="img-fluid"
                                animate={{
                                    y: [0, -10, 0],       // vertical jump
                                    rotate: [0, 5, -5, 0]  // slight side-to-side rotation
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    ease: "easeInOut"
                                }}
                            />

                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-12  p-4 d-flex flex-column justify-content-center align-items-center text-center'>
                    <p className='download-para-millio d-flex  justify-content-center align-items-center text-center'>
                        <b>20,000+</b>&nbsp;have found their life partner at BajolMatrimony!
                    </p>
                    <div>
                        <img src={bajol} alt='' height={200} width={150} />
                    </div>
                    <div>
                        <p className='download-para-trust'>Bajol.com - Trusted by over <b>20,000+</b>&nbsp;Members</p>
                    </div>
                    <div className='container'>
                        <p className='text-justify'>
                            Bajol.com, one of world's best known brands and the world's largest matrimonial service was founded with a simple objective - to help people find happiness. The company pioneered online matrimonials in 1996 and continues to lead the exciting matrimony category after more than a decade. By redefining the way Indian brides and grooms meet for marriage, bajolmatrimony.com has created a world-renowned service that has touched over 20,000+ people.
                        </p>
                        <div>
                            <p className='text-primary'>India | USA | Canada | UK | Singapore | Australia | UAE | NRI Matrimonials</p>
                        </div>
                        <div className='bg-primary'>
                            <p className='p-3 text-white' style={{ fontSize: '30px' }}>Trusted by <b>20,000+</b> Members</p>
                            <div className='row'>
                                <div className='col-lg-4 col-md-12 col-sm-12'>
                                    <p className='p-3 text-white' style={{ fontSize: '20px' }}><b>💑 Best Matches</b></p>
                                </div>
                                <div className='col-lg-4 col-md-12 col-sm-12'>
                                    <p className='p-3 text-white' style={{ fontSize: '20px' }}><b>✅ Verified Profiles</b></p>
                                </div>
                                <div className='col-lg-4 col-md-12 col-sm-12'>
                                    <p className='p-3 text-white' style={{ fontSize: '20px' }}><b>🔒 100% Privacy</b></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className='row'>
                <div className='col-12'>
                    <Footer />
                </div>

            </div> */}
        </div>
    );
};

export default Banner;
