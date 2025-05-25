import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

const Step8 = ({ methods }: { methods: UseFormReturn<any> }) => {
  const { register, setValue, setError, clearErrors, trigger, formState: { errors }, unregister } = methods;

  useEffect(() => {
    register("photo", { required: "Profile picture is required" });

    return () => unregister("photo");
  }, [register, unregister]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setError("photo", {
        type: "manual",
        message: "Profile picture is required",
      });
      return;
    }

    // Optional: Validate file type and size (e.g., max 2MB, only images)
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      setError("photo", {
        type: "manual",
        message: "Only JPG/PNG images are allowed",
      });
      return;
    }

    if (file.size > maxSize) {
      setError("photo", {
        type: "manual",
        message: "File size must be less than 2MB",
      });
      return;
    }

    // All validations passed
    clearErrors("photo");

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      localStorage.setItem("uploadedPhoto", base64String);
      setValue("photo", base64String);
      trigger("photo");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-3">
      <label>Upload Profile Photo</label>
      <input
        type="file"
        accept="image/*"
        className={`form-control ${errors.photo ? 'is-invalid' : ''}`}
        onChange={handleImageChange}
      />
      {errors.photo && (
        <div className="invalid-feedback">{errors.photo.message as String}</div>
      )}
    </div>
  );
};

export default Step8;
