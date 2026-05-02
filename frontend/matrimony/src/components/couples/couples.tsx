import { motion } from "framer-motion";
import { useEffect, useState } from "react";
// import pink1 from '../../asset/pink1.jpg';
// import pink2 from '../../asset/pink2.jpg';
// import hair1 from '../../asset/hair1.jpg';
// import hair2 from '../../asset/hair2.jpg';
// import thatha from "../../asset/thatha.jpg";
// import b1 from "../../asset/b1.jpg";


import './couples.css';
import { useAppLanguage } from "../../i18n/LanguageContext";

const Couples = () => {
    const { t } = useAppLanguage();
    const [subscriptionsCount, setSubscriptionsCount] = useState(1);
    const [marriagesCount, setMarriagesCount] = useState(1);

    useEffect(() => {
        const subscriptionsTarget = 12000;
        const marriagesTarget = 1000;
        const duration = 2200;
        let animationFrame = 0;
        const startTime = performance.now();

        const animateCounts = (currentTime: number) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            setSubscriptionsCount(Math.max(1, Math.floor(subscriptionsTarget * easedProgress)));
            setMarriagesCount(Math.max(1, Math.floor(marriagesTarget * easedProgress)));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animateCounts);
            }
        };

        animationFrame = requestAnimationFrame(animateCounts);

        return () => cancelAnimationFrame(animationFrame);
    }, []);

    return (
        <div className="container-fluid my-4">
            <motion.h2
                className="text-center mb-4 fw-bold hero"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* {t('couples.title')} */}
                💖 Bajol world wide plateform 💖
            </motion.h2>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="golden-globe-wrapper"
            >
                <motion.div
                    className="golden-globe-shell"
                    animate={{ rotateY: 360 }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <div className="golden-globe-core">
                        <div className="golden-globe-shine" aria-hidden="true"></div>
                        <div className="golden-globe-ring golden-globe-ring-x" aria-hidden="true"></div>
                        <div className="golden-globe-ring golden-globe-ring-y" aria-hidden="true"></div>
                        <i className="fa fa-globe golden-globe-icon" aria-hidden="true"></i>
                    </div>
                </motion.div>
                <motion.div
                    className="couples-stats-card"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    <p className="couples-stats-title">Our growing matrimony network</p>
                    <p className="couples-stats-text">
                        <span className="couples-stat-number">{subscriptionsCount.toLocaleString()}+</span> total subscriptions and{" "}
                        <span className="couples-stat-number">{marriagesCount.toLocaleString()}+</span> successful marriages.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Couples;
