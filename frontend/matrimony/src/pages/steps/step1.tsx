import React from 'react';
import { UseFormReturn } from 'react-hook-form';

type Props = {
    methods: UseFormReturn<any>;
};

const Step1: React.FC<Props> = ({ methods }) => {
    const {
        register,
        formState: { errors }
    } = methods;

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
            {/* Name */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="name">Name</label>
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
                <label htmlFor="age">Age</label>
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
                <label htmlFor="job">Job</label>
                <input
                    id="job"
                    {...register('job', { required: 'Job is required' })}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
                {errors.job && (
                    <p style={{ color: 'red', marginBottom: '10px' }}>
                        {errors.job.message as string}
                    </p>
                )}
            </div>

            {/* Monthly Salary */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="monthlySalary">Monthly Salary</label>
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
        </div>
    );
};

export default Step1;

