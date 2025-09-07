// components/Step5.tsx
import React from "react";
import { UseFormReturn } from "react-hook-form";

type Props = {
  methods: UseFormReturn<any>;
};

const Step8: React.FC<Props> = ({ methods }) => {
  const { register , formState: { errors }} = methods;

  return (
    <div className="mb-3">
        <label className="form-label">Who are you going to marry ?</label>
        <select
          className={`form-control ${errors.person ? 'is-invalid' : ''}`}
          {...register("person", { required: "marrige person is required" })}
        >
          <option value="">Select your person</option>
          <option value="me">me</option>
          <option value="sister">sister</option>
          <option value="brother">brother</option>
          <option value="son">son</option>
          <option value="daughter">daughter</option>

        </select>
        {errors.person && <div className="invalid-feedback">{errors.person.message as string}</div>}
      </div>
  );
};

export default Step8;
