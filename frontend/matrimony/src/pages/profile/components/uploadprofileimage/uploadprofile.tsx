import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './uploadprofile.css';
import { useUploadImagesMutation } from '../../../../features/image/imageApi';
import { useDispatch, useSelector } from 'react-redux';
import { resetImages, addImage } from '../../../../features/image/imageslice';

const UploadProfile: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const dispatch = useDispatch();
  const [uploadImages, { isLoading }] = useUploadImagesMutation();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (files.length + images.length <= 3) {
        setImages((prevImages) => [...prevImages, ...Array.from(files)]);
        setError('');
      } else {
        setError('You can upload a maximum of 3 images only.');
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

   const userId = useSelector((state:any) => state.auth.user?.id);
   console.log(userId,'ioioioioioi');
   
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (images.length < 3) {
      setError('You must upload at least 3 images.');
      return;
    }

    const formData = new FormData();
    images.forEach((image) => {
      formData.append('dpfile', image);
    });

    try {
      const result = await uploadImages({ formData, userId }).unwrap();

      // Assuming the API returns uploaded image URLs
      if (result?.uploadedUrls && Array.isArray(result.uploadedUrls)) {
        dispatch(resetImages());
        result.uploadedUrls.forEach((url: string) => {
          dispatch(addImage(url));
        });
      }

      setSuccess('Images uploaded successfully!');
      console.log('Upload success:', result);
      setImages([]);
        setTimeout(() => {
      window.location.reload();
    }, 1000);
    } catch (err: any) {
      console.error('Upload failed', err);
      setError('Upload failed. Please try again.');
    }
  };

  return (
    <motion.div
      className="upload-card"
      initial={{ borderColor: '#007bff' }}
      animate={{ borderColor: images.length === 3 ? '#28a745' : '#007bff' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <h3>Upload Images (Minimum 3)</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        <div className="image-preview">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="image-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={URL.createObjectURL(image)}
                alt={`Uploaded ${index + 1}`}
              />
              <button type="button" onClick={() => removeImage(index)}>
                &times;
              </button>
            </motion.div>
          ))}
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <button type="submit" disabled={images.length < 3 || isLoading}>
          {isLoading ? 'Uploading...' : 'Submit'}
        </button>
         <h3 className='blinking-btn mt-3 text-primary'>
          {
            isLoading && 'please wait'
          }
         </h3>
      </form>

    </motion.div>
  );
};

// export default UploadProfile;
export default React.memo(UploadProfile); // ✅ Prevent re-renders

