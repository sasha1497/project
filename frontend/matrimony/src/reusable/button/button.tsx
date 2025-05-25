// Button.tsx
import { motion } from 'framer-motion';
import React from 'react';

// Define types for the props
interface ButtonProps {
  text: string;
  link: string;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void; 
}

const Button: React.FC<ButtonProps> = ({ text, link, style, className, onClick }) => {
  return (
    <motion.a
      href={link}
      className={`text-white text-decoration-none me-2 ${className}`}
      style={style}  // Inline style passed through props
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: 1.05,
        boxShadow: '0px 4px 10px rgba(0, 123, 255, 0.4)',
      }}
      whileTap={{
        scale: 0.95,
        boxShadow: '0px 2px 5px rgba(0, 123, 255, 0.2)',
      }}
      onClick={onClick}
    >
      {text}
    </motion.a>
  );
};

export default Button;
