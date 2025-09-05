import React from 'react';
import './loader.css';

const Loader: React.FC = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-spinner"></div>
    </div>
  );
};

export default Loader;
