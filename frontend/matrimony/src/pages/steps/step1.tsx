import React, { useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useAppLanguage } from '../../i18n/LanguageContext';

type Props = {
    methods: UseFormReturn<any>;
};

const JOB_OPTIONS = [
    'Another',
    'Doctor',
    'Nurse',
    'Army',
    'CRPF',
    'Police',
    'Excise',
    'Forest',
    'water authority',
    'Electricity Board',
    'Education sector',
    'IT',
    'Veterinary Doctor',
    'Customs',
    'Advocate',
    'Tourism field',
    'Working gulf',
    'Government job',
    'Church Priest',
    'Church Pastor',
    'Temple Priest',
    'Marketing Field',
    'Cinema field',
    'Journalist',
    'Driver',
    'Printing press field',
    'Small Busines field',
    'Big Business field',
    'Plumber',
    'Electrician',
    'Tourism',
    'Vlogger',
    'Painter',
    'Mason',
    'Welder',
    'Sales job',
    'Engineer',
    'Computer field',
    'Workshop field',
    'Makeup artist',
    'Beautician',
    'Hair maker',
    'Therapist',
];

const Step1: React.FC<Props> = ({ methods }) => {
    const { t } = useAppLanguage();
    const {
        register,
        setValue,
        watch,
        formState: { errors }
    } = methods;
    const [showJobPopup, setShowJobPopup] = useState(false);
    const [customJob, setCustomJob] = useState('');
    const selectedJob = watch('job');
    const displayedJobValue = useMemo(
        () => (selectedJob && !JOB_OPTIONS.includes(selectedJob) ? 'Another' : selectedJob || ''),
        [selectedJob],
    );

    const openCustomJobPopup = () => {
        setCustomJob(selectedJob && !JOB_OPTIONS.includes(selectedJob) ? selectedJob : '');
        setShowJobPopup(true);
    };

    const handleJobChange = (value: string) => {
        if (value === 'Another') {
            openCustomJobPopup();
            return;
        }

        setValue('job', value, { shouldValidate: true, shouldDirty: true });
    };

    const handleCustomJobSave = () => {
        const trimmedJob = customJob.trim();
        if (!trimmedJob) {
            return;
        }

        setValue('job', trimmedJob, { shouldValidate: true, shouldDirty: true });
        setShowJobPopup(false);
    };

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
            {/* Name */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="name">{t('profile.nameLabel')}</label>
                <input
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
                {errors.name && (
                    <p style={{ color: 'red', marginBottom: '10px' }}>
                        {errors.name.message as string}
                    </p>
                )}
            </div>

            {/* Age */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="age">{t('profile.ageLabel')}</label>
                <input
                    id="age"
                    type="number"
                    {...register('age', {
                        required: 'Age is required',
                        min: { value: 0, message: 'Age must be a positive number' },
                    })}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
                {errors.age && (
                    <p style={{ color: 'red', marginBottom: '10px' }}>
                        {errors.age.message as string}
                    </p>
                )}
            </div>

            {/* Job */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="job">{t('profile.jobLabel')}</label>
                <input type="hidden" {...register('job', { required: 'Job is required' })} />
                <select
                    id="job"
                    value={displayedJobValue}
                    onChange={(e) => handleJobChange(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                >
                    <option value="">Select Option</option>
                    {JOB_OPTIONS.map((jobOption) => (
                        <option key={jobOption} value={jobOption}>
                            {jobOption}
                        </option>
                    ))}
                </select>
                {displayedJobValue === 'Another' && selectedJob && !JOB_OPTIONS.includes(selectedJob) && (
                    <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{selectedJob}</span>
                        <button
                            type="button"
                            onClick={openCustomJobPopup}
                            style={{ border: 'none', background: 'transparent', color: '#0d6efd' }}
                        >
                            Edit
                        </button>
                    </div>
                )}
                {errors.job && (
                    <p style={{ color: 'red', marginBottom: '10px' }}>
                        {errors.job.message as string}
                    </p>
                )}
            </div>

            {/* Monthly Salary */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="monthlySalary">{t('profile.monthlySalaryLabel')}</label>
                <input
                    id="monthlySalary"
                    type="number"
                    {...register('monthlySalary', {
                        required: 'Monthly salary is required',
                        min: { value: 0, message: 'Must be a positive number' },
                    })}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
                {errors.monthlySalary && (
                    <p style={{ color: 'red', marginBottom: '10px' }}>
                        {errors.monthlySalary.message as string}
                    </p>
                )}
            </div>

            {showJobPopup && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1050,
                        padding: '1rem',
                    }}
                >
                    <div
                        style={{
                            background: '#fff',
                            width: '100%',
                            maxWidth: '420px',
                            borderRadius: '12px',
                            padding: '1rem',
                            boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
                        }}
                    >
                        <h5 style={{ marginBottom: '1rem' }}>Enter Job</h5>
                        <input
                            value={customJob}
                            onChange={(e) => setCustomJob(e.target.value)}
                            placeholder="Type your job"
                            style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                                type="button"
                                onClick={() => setShowJobPopup(false)}
                                style={{ padding: '8px 14px', border: '1px solid #ccc', background: '#fff' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleCustomJobSave}
                                style={{ padding: '8px 14px', border: 'none', background: '#198754', color: '#fff' }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step1;
