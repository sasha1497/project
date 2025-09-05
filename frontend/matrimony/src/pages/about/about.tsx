import React from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import './about.css';
import { useNavigate } from "react-router-dom";


const About = () => {

    const navigate = useNavigate(); // initialize it


    const aboutText = `
    Dear Sir / Madam,

    The heartfelt gratitude and thankfulness are being presented by madam BAJOL ONLINE APP on the outset of this venture.

    What does BAJOL mean shall be clarified here concisely.
    In our society, so many males and females are being astrayed in pursuit of finding an ideal couple, after they are being driven, by manipulated, and thereby happened to be married in disharmony.

    Assist you too instead, BAJOL is endeavoring to detect apt and appropriate spouse in your personal life.
    Through this platform each one of you can have a healthy, happy, colorful, and glorious married life.

    Those who aspire to be married, whether it is the first time or second time, by making a nominal payment, you will be able to enter the app and access appropriate future brides and grooms within the states and countries abroad.

    Nowadays, a large number of people are outrightly betrayed by personal matrimonial agencies as well as other online matrimonial apps. Therefore, so many people are dissuaded from these streams. Due to this reason, millions of first and second marriage aspirants are becoming incapable of fulfilling their nuptial dreams.

    But herein, BAJOL is creating a reliable platform, whereby being levied a small amount, the needy can utilize unlimited services both domestically and internationally. You can select suitable persons matchable to your wish.

    We do pray for this app to be a great opportunity to find a suitable match to get happy, healthy, and harmonious family life.

    Thank you
  `;

    return (
        <div className="about-container">
            <motion.div
                className="about-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 120 }}
            >
                <p className="typewriter-text">
                    <Typewriter
                        words={[aboutText]}
                        cursor
                        typeSpeed={30} // adjust speed as you like
                        deleteSpeed={0}
                        delaySpeed={1000}
                        loop={1} // type only once
                    />
                </p>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate("/profile")}
                >
                    Back
                </button>
            </motion.div>
        </div>
    );
};

export default About;
