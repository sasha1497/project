// components/Step5.tsx
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useAppLanguage } from '../../i18n/LanguageContext';

type Props = {
  methods: UseFormReturn<any>;
};

const Step5: React.FC<Props> = ({ methods }) => {
  const { t } = useAppLanguage();
  const { register , formState: { errors }} = methods;

  return (
    <div className="mb-3" style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
        <label className="form-label">{t('profile.genderLabel')}</label>
        <select
          className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
          {...register("gender", { required: "gender is required" })}
        >
          <option value="">{t('profile.genderPlaceholder')}</option>
          <option value="male">{t('profile.gender.male')}</option>
          <option value="female">{t('profile.gender.female')}</option>
          <option value="transgender">{t('profile.gender.transgender')}</option>
        </select>
        {errors.gender && <div className="invalid-feedback">{errors.gender.message as string}</div>}
      </div>
  );
};

export default Step5;
