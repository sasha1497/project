import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

const Step8 = ({ methods }: { methods: UseFormReturn<any> }) => {
  const {
    register,
    setValue,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
    unregister,
  } = methods;

  const [preview, setPreview] = useState<string | null>(null);

  // useEffect(() => {
  //   register("photo", { required: "Profile picture is required" });
  // }, [register, unregister]);

  //default set the image
    useEffect(() => {
    register("photo", { required: "Profile picture is required" });

    const savedPhoto = localStorage.getItem("uploadedPhoto");
    const defaultPlaceholder = '/images/default-profile.jpg'; // public folder

    const initialPhoto = savedPhoto || defaultPlaceholder;

    setValue("photo", initialPhoto);
    setPreview(initialPhoto);
  }, [register, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setError("photo", {
        type: "manual",
        message: "Profile picture is required",
      });
      setPreview(null);
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 2 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setError("photo", {
        type: "manual",
        message: "Only JPG/PNG images are allowed",
      });
      setPreview(null);
      return;
    }

    if (file.size > maxSize) {
      setError("photo", {
        type: "manual",
        message: "File size must be less than 2MB",
      });
      setPreview(null);
      return;
    }

    clearErrors("photo");

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      localStorage.setItem("uploadedPhoto", base64String);
      setValue("photo", base64String);
      setPreview(base64String);
      trigger("photo");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-3">
      <label className="form-label">Upload Profile Photo</label>
      <input
        type="file"
        accept="image/*"
        className={`form-control ${errors.photo ? 'is-invalid' : ''}`}
        onChange={handleImageChange}
      />
      {errors.photo && (
        <div className="invalid-feedback">{errors.photo.message as string}</div>
      )}

      {preview && (
        <div className="mt-3">
          <p className="mb-1">Preview:</p>
          <img
            src={preview}
            alt="Profile Preview"
            style={{ maxWidth: "150px", maxHeight: "150px", borderRadius: "8px" }}
          />
        </div>
      )}
    </div>
  );
};

export default Step8;
