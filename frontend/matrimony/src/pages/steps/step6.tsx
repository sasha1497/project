// components/Step5.tsx
import React from "react";
import { UseFormReturn } from "react-hook-form";

type Props = {
  methods: UseFormReturn<any>;
};

const Step6: React.FC<Props> = ({ methods }) => {
  const { register , formState: { errors }} = methods;

  return (
    <div className="mb-3">
        <label className="form-label">which Marraige this for you ?</label>
        <select
          className={`form-control ${errors.count ? 'is-invalid' : ''}`}
          {...register("count", { required: "marrige count is required" })}
        >
          <option value="">Select number of marraige</option>
          <option value="first">First</option>
          <option value="second">Second</option>
          <option value="third">Third</option>
        </select>
        {errors.count && <div className="invalid-feedback">{errors.count.message as string}</div>}
      </div>
  );
};

export default Step6;
