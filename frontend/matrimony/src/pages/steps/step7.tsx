import React from 'react';
import { UseFormReturn } from 'react-hook-form';

type Props = {
    methods: UseFormReturn<any>;
};

const Step7: React.FC<Props> = ({ methods }) => {
    const {
        register,
        formState: { errors }
    } = methods;

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
            {/* Mobile num */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="country">Height</label>
                <input
                    id="height"
                    type='text'
                    {...register('height', { required: 'height is required' })}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
                {errors.height && (
                    <p style={{ color: 'red', marginBottom: '10px' }}>
                        {errors.height.message as string}
                    </p>
                )}
            </div>

            {/* WA num */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="whatsapp">Weight</label>
                <input
                    id="weight"
                    type='text'
                    {...register('weight', {
                        required: 'weight is required'
                    })}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
                {errors.weight && (
                    <p style={{ color: 'red', marginBottom: '10px' }}>
                        {errors.weight.message as string}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Step7;

