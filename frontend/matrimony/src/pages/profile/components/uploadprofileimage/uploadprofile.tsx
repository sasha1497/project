import React, { useState } from 'react';
import './uploadprofile.css';

const UploadProfile: React.FC = () => {
  const [images, setImages] = useState<File[]>([]); // State to store selected images
  const [error, setError] = useState<string>(''); // For showing error if less than 3 images are uploaded

  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Convert FileList to array and check for more than 3 images
      if (files.length + images.length <= 3) {
        setImages((prevImages) => [...prevImages, ...Array.from(files)]);
        setError(''); // Clear error when more images are added
      } else {
        setError('You can upload a maximum of 3 images only.');
      }
    }
  };

  // Handle remove image
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Handle form submission (optional)
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (images.length < 3) {
      setError('You must upload at least 3 images.');
    } else {
      // Process the images (e.g., upload to server)
      console.log('Images submitted:', images);
    }
  };

  return (
    <div className="image-upload-container">
      <h3>Upload Images (Minimum 3)</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Image upload input */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        {/* Display selected images */}
        <div className="image-preview">
          {images.map((image, index) => (
            <div key={index} className="image-item">
              <img
                src={URL.createObjectURL(image)}
                alt={`Uploaded ${index + 1}`}
                width="100"
                height="100"
              />
              <button type="button" onClick={() => removeImage(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Submit button */}
        <button type="submit" disabled={images.length < 3}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default UploadProfile;
