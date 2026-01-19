import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import './conclusion.css';
import { useNavigate } from "react-router-dom";


const Conclusion = () => {
    const navigate = useNavigate(); // initialize it

//     const aboutText = `
//     BAJOL bless the people all over the world, to have fast & speedy matrimonial relationships.
//     BAJOL APP has been designed and formulated with a Devine interaction. Hence, we have a resolve in our
//     heart that you all may have a rejoicing married life by having brides and groom, divinely united. To
//     transform the dreams of your marriage life will vary colors. BAJOL will always be with you with their
//     prayers and benedictions. 
//   `;
const aboutText = `
BAJOL ലോകമാകെ എല്ലാ ആളുകളെയും അനുഗ്രഹിക്കുന്നു, അതിവേഗവും സുഗമവുമായ വിവാഹ ബന്ധങ്ങൾ നേടാൻ.
BAJOL APP ദിവ്യമായ ഒരു ഇടപെടലോടെ രൂപകൽപ്പന ചെയ്തും തയ്യാറാക്കിയുമാണ്. അതിനാൽ, വിവാഹിതർക്കായുള്ള വരനും വധുവിനെയും ദിവ്യമായ രീതിയിൽ ചേർത്ത് നിങ്ങൾക്ക് സന്തോഷകരമായ വിവാഹ ജീവിതം ലഭിക്കുമെന്ന് നമ്മുടെ ഹൃദയം പ്രതിജ്ഞയിട്ടു.
നിങ്ങളുടെ വിവാഹ സ്വപ്നങ്ങൾ വർണാഭമായി നിറയുന്നതിനായി, BAJOL എല്ലായ്പ്പോഴും നിങ്ങളുടെ പ്രാർത്ഥനകളോടും അനുഗ്രഹങ്ങളോടും കൂടെ ഉണ്ടാകും.
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
