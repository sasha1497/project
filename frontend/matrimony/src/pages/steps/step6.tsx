// components/Step5.tsx
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useAppLanguage } from '../../i18n/LanguageContext';

type Props = {
  methods: UseFormReturn<any>;
};

const Step6: React.FC<Props> = ({ methods }) => {
  const { t } = useAppLanguage();
  const { register , formState: { errors }} = methods;

  return (
    <div className="mb-3" style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
        <label className="form-label">{t('profile.marriageCountLabel')}</label>
        <select
          className={`form-control ${errors.count ? 'is-invalid' : ''}`}
          {...register("count", { required: "marrige count is required" })}
        >
          <option value="">{t('profile.marriageCountPlaceholder')}</option>
          <option value="first">{t('profile.marriageCount.first')}</option>
          <option value="second">{t('profile.marriageCount.second')}</option>
          <option value="third">{t('profile.marriageCount.third')}</option>
        </select>
        {errors.count && <div className="invalid-feedback">{errors.count.message as string}</div>}
      </div>
  );
};

export default Step6;
