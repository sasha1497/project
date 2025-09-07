import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import './conclusion.css';
import { useNavigate } from "react-router-dom";


const Conclusion = () => {
    const navigate = useNavigate(); // initialize it

    const aboutText = `
    BAJOL bless the people all over the world, to have fast & speedy matrimonial relationships.
    BAJOL APP has been designed and formulated with a Devine interaction. Hence, we have a resolve in our
    heart that you all may have a rejoicing married life by having brides and groom, divinely united. To
    transform the dreams of your marriage life will vary colors. BAJOL will always be with you with their
    prayers and benedictions. 
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

export default Conclusion;
