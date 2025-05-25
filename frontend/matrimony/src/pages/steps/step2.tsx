import React from 'react';
import { UseFormReturn } from 'react-hook-form';

type Props = {
    methods: UseFormReturn<any>;
};

const Step2: React.FC<Props> = ({ methods }) => {
    const {
        register,
        formState: { errors }
    } = methods;

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
            {/* country */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="country">Country</label>
                <input
                    id="country"
                    {...register('country', { required: 'country is required' })}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
                {errors.country && (
                    <p style={{ color: 'red', marginBottom: '10px' }}>
                        {errors.country.message as string}
                    </p>
                )}
            </div>

            {/* state */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="state">State</label>
                <input
                    id="state"
                    {...register('state', {
                        required: 'state is required'
                    })}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
                {errors.state && (
                    <p style={{ color: 'red', marginBottom: '10px' }}>
                        {errors.state.message as string}
                    </p>
                )}
            </div>

            {/* district */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="district">District</label>
                <input
                    id="district"
                    {...register('district', { required: 'district is required' })}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
                {errors.district && (
                    <p style={{ color: 'red', marginBottom: '10px' }}>
                        {errors.district.message as string}
                    </p>
                )}
            </div>

        </div>
    );
};

export default Step2;

