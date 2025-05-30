import React from "react";
import { UseFormReturn } from "react-hook-form";

type Props = {
  methods: UseFormReturn<any>;
};

const Step4: React.FC<Props> = ({ methods }) => {
  const { register, formState: { errors } } = methods;

  return (
    <div>
      <div className="mb-3">
        <label className="form-label">Caste</label>
        <select
          className={`form-control ${errors.caste ? 'is-invalid' : ''}`}
          {...register("caste", { required: "Caste is required" })}
        >
          <option value="">Select Caste</option>
          <option value="General">General</option>
          <option value="OBC">OBC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
          <option value="No Caste">No Caste</option>
        </select>
        {errors.caste && <div className="invalid-feedback">{errors.caste.message as string}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Religion</label>
        <select
          className={`form-control ${errors.religion ? 'is-invalid' : ''}`}
          {...register("religion", { required: "Religion is required" })}
        >
          <option value="">Select Religion</option>
          <option value="Hindu">Hindu</option>
          <option value="Muslim">Muslim</option>
          <option value="Christian">Christian</option>
          <option value="Sikh">Sikh</option>
          <option value="Other">Other</option>
          <option value="No Religion">No Religion</option>
        </select>
        {errors.religion && <div className="invalid-feedback">{errors.religion.message as string}</div>}
      </div>
    </div>
  );
};

export default Step4;
