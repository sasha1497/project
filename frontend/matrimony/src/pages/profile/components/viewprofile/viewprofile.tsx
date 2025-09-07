import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './viewprofile.css';

import img1 from '../../../../asset/1g.jpeg';
import img2 from '../../../../asset/2g.jpeg';
import img3 from '../../../../asset/3g.jpeg';
import img4 from '../../../../asset/4g.jpeg';
import img5 from '../../../../asset/5g.jpeg';
import img6 from '../../../../asset/6g.jpeg';
import img7 from '../../../../asset/7g.jpeg';
import img8 from '../../../../asset/8g.jpeg';
import { useGetUserProfileQuery } from '../../../../features/profile/profileApi';
import { useSelector } from 'react-redux';

type ImageType = {
  id: number;
  src: string;
  description: string;
};

const images: ImageType[] = [
  { id: 1, src: img1, description: 'Name: Anitha' },
  { id: 2, src: img2, description: 'Name: Vinitha' },
  { id: 3, src: img3, description: 'Name: Kamla' },
  { id: 4, src: img4, description: 'Name: Bebisha' },
  { id: 5, src: img5, description: 'Name: Minza' },
  { id: 6, src: img6, description: 'Name: Nayanthara' },
  { id: 7, src: img7, description: 'Name: Hansika' },
  { id: 8, src: img8, description: 'Name: Niki' },
];

const ViewProfile: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
        const userId = useSelector((state:any) => state.auth.user?.id);

      const { data, isLoading, error } = useGetUserProfileQuery(userId);
    
         console.log(data,'data+++');


  return (
    <div className="gallery-container">
      <h2 className="gallery-title">Image Gallery</h2>

      <div className="gallery-grid">
        {images.map((image) => (
          <motion.div
            key={image.id}
            className="gallery-card"
            whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}
            onClick={() => setSelectedImage(image)}
          >
            <motion.img
              src={image.src}
              alt={image.description}
              className="gallery-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="gallery-description">{image.description}</div>
          </motion.div>
        ))}
      </div>

      {/* Enlarged Image View */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="popup-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="close-icon" onClick={() => setSelectedImage(null)}>
                &times;
              </div>

              <motion.img
                src={selectedImage.src}
                alt="Selected"
                className="popup-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.p
                className="popup-description"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {selectedImage.description}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// export default ViewProfile;
export default React.memo(ViewProfile); // ✅ Prevent re-renders

