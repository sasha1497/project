import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './uploadprofile.css';
import { useUploadImagesMutation } from '../../../../features/image/imageApi';
import { useDispatch, useSelector } from 'react-redux';
import { resetImages, addImage } from '../../../../features/image/imageslice';
import { useAppLanguage } from '../../../../i18n/LanguageContext';

type UploadProfileProps = {
  userId?: number | string | null;
  onUploaded?: () => void | Promise<void>;
};

const UploadProfile: React.FC<UploadProfileProps> = ({ userId: providedUserId, onUploaded }) => {
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const dispatch = useDispatch();
  const { t } = useAppLanguage();
  const [uploadImages, { isLoading }] = useUploadImagesMutation();

  const authUserId = useSelector((state: any) => state.auth.user?.id);
  const resolvedUserId = providedUserId || authUserId;

  // ✅ Handle single image change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
      setError('');
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!image) {
      setError(t('profile.uploadErrorMissing'));
      return;
    }

    const formData = new FormData();
    formData.append('dpfile', image);

    if (!resolvedUserId) {
      setError('User ID not found');
      return;
    }

    try {
      const result = await uploadImages({ formData, userId: String(resolvedUserId) }).unwrap();

      if (result?.uploadedUrls && Array.isArray(result.uploadedUrls) && result.uploadedUrls.length > 0) {
        dispatch(resetImages());
        dispatch(addImage(result.uploadedUrls[0]));
      }

      localStorage.setItem('profileImageUploaded', 'true');
      setSuccess(t('profile.uploadSuccess'));
      console.log('Upload success:', result);
      setImage(null);

      await onUploaded?.();
    } catch (err: any) {
      console.error('Upload failed', err);
      setError(t('profile.uploadFailed'));
    }
  };

  return (
    <motion.div
      className="upload-card"
      initial={{ borderColor: '#007bff' }}
      animate={{ borderColor: image ? '#28a745' : '#007bff' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <h3>{t('profile.uploadTitle')}</h3>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <div className="image-preview">
          {image && (
            <motion.div
              className="image-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img src={URL.createObjectURL(image)} alt={t('profile.uploadedPreviewAlt')} />
              <button type="button" onClick={removeImage}>
                &times;
              </button>
            </motion.div>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <button type="submit" disabled={!image || isLoading}>
          {isLoading ? t('profile.uploading') : t('profile.submit')}
        </button>
        <h3 className="blinking-btn mt-3 text-primary">
          {isLoading && t('profile.pleaseWait')}
        </h3>
      </form>
    </motion.div>
  );
};

export default React.memo(UploadProfile);
