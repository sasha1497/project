// components/Step5.tsx
import React from "react";
import { UseFormReturn } from "react-hook-form";

type Props = {
  methods: UseFormReturn<any>;
};

const Step5: React.FC<Props> = ({ methods }) => {
  const { register , formState: { errors }} = methods;

  return (
    <div className="mb-3">
        <label className="form-label">Gender</label>
        <select
          className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
          {...register("gender", { required: "gender is required" })}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="transgender">Transgender</option>
        </select>
        {errors.gender && <div className="invalid-feedback">{errors.gender.message as string}</div>}
      </div>
  );
};

export default Step5;
