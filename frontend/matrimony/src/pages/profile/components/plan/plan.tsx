import React from 'react';
import './plan.css';
import { motion } from 'framer-motion';


interface Plan {
    name: string;
    description: string;
    price: string;
    features: string[];
    colorClass: string;
}

const plans: Plan[] = [
    {
        name: 'SILVER',
        description: 'Best for exploring the platform',
        price: '$0',
        features: [
            'Create and manage profile',
            'Limited daily profile views',
            'Send up to 5 interests per day',
            'View basic contact info (limited)',
            'Basic support',
        ],
        colorClass: 'text-white',
    },
    {
        name: 'GOLD',
        description: 'For serious users looking for quick matches',
        price: '$10',
        features: [
            'Unlimited profile views',
            'Send up to 25 interests per day',
            'Chat with verified users',
            'See who viewed your profile',
            'Priority listing in search',
            'Access to full contact info',
            'Customer support',
        ],
        colorClass: 'text-white',
    },
    {
        name: 'PREMIUM',
        description: 'For those who want maximum reach and priority',
        price: '$20',
        features: [
            'All Gold features',
            'Top placement in search results',
            'Verified badge on your profile',
            'Unlimited interest sending',
            'Personal matchmaker assistance',
            'Dedicated support team',
            'Profile boost 5x per month',
            'Priority customer care',
        ],
        colorClass: 'text-white',
    },
];
const Plan: React.FC = () => {
    return (
        <section className="pricing-plans container py-5">
            <div className="row justify-content-center g-4">
                <motion.p
                    className="mt-3 text-center pro_text"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{
                        y: [0, -10, 0],
                        opacity: [1, 0.8, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'easeInOut'
                    }}
                >
                    🚀 Unlock your matches by upgrading your plan! 💖✨
                </motion.p>

                {plans.map((plan, index) => (
                    <div key={index} className="col-md-6 col-lg-4">
                        <div className="card h-100 bg-primary shadow pricing-card border-dark text-center position-relative">
                            <div className="card-body d-flex flex-column">
                                <h4 className={`fw-normal ${plan.colorClass}`}>{plan.name}</h4>
                                <p className="text-white small">{plan.description}</p>
                                <h1 className={`my-3 fw-bold ${plan.colorClass}`}>
                                    {plan.price}
                                    <sub className="fs-6 text-white">/month</sub>
                                </h1>
                                <ul className="list-unstyled text-start mt-3 flex-grow-1">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="mb-2">
                                            <i className="fa-solid fa-check me-2 text-light" />
                                            <span className="text-light">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button className={`btn mt-4 w-100 fw-bold bg-sucess text-white border-0`}>
                                    SELECT
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flash-sale-banner bg-danger text-white py-2 mb-3 overflow-hidden">
                    <div className="scrolling-text text-center fw-bold">
                        🎉 Flash Sale: Get 50% OFF on Premium Plans — Limited Time Offer! ⏳
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Plan;
