import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import './rule.css';
import { useNavigate } from 'react-router-dom';

const Rule = () => {
    const navigate = useNavigate(); // initialize it

    const aboutText = `
   1. No one should open and use this app unless for their wedding purpose.

   2. The gallery number should not be misused at any circumstances, if so, it is subjected to judicial

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
            </motion.div>
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/profile")}
            >
                Back
            </button>
        </div>
    );
};

export default Rule;
