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
            {/* Mobile num */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="country">Mobile Number</label>
                <input
                    id="mobile"
                    type='number'
                    {...register('mobile', { required: 'mobile is required' })}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
                {errors.mobile && (
                    <p style={{ color: 'red', marginBottom: '10px' }}>
                        {errors.mobile.message as string}
                    </p>
                )}
            </div>

            {/* WA num */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="whatsapp">Whatsapp Number</label>
                <input
                    id="whatsapp"
                    type='number'
                    {...register('whatsapp', {
                        required: 'whatsapp is required'
                    })}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
                {errors.whatsapp && (
                    <p style={{ color: 'red', marginBottom: '10px' }}>
                        {errors.whatsapp.message as string}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Step2;

