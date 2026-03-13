// components/Step5.tsx
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useAppLanguage } from '../../i18n/LanguageContext';

type Props = {
  methods: UseFormReturn<any>;
};

const Step8: React.FC<Props> = ({ methods }) => {
  const { t } = useAppLanguage();
  const { register , formState: { errors }} = methods;

  return (
    <div className="mb-3" style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
        <label className="form-label">{t('profile.marriagePersonLabel')}</label>
        <select
          className={`form-control ${errors.person ? 'is-invalid' : ''}`}
          {...register("person", { required: "marrige person is required" })}
        >
          <option value="">{t('profile.marriagePersonPlaceholder')}</option>
          <option value="me">{t('profile.marriagePerson.me')}</option>
          <option value="sister">{t('profile.marriagePerson.sister')}</option>
          <option value="brother">{t('profile.marriagePerson.brother')}</option>
          <option value="son">{t('profile.marriagePerson.son')}</option>
          <option value="daughter">{t('profile.marriagePerson.daughter')}</option>
          <option value="other">{t('profile.marriagePerson.other')}</option>
        </select>
        {errors.person && <div className="invalid-feedback">{errors.person.message as string}</div>}
      </div>
  );
};

export default Step8;
