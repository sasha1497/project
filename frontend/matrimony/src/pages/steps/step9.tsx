import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  methods: UseFormReturn<any>;
};

const Step9: React.FC<Props> = ({ methods }) => {
  const {
    register,
    getValues,
    formState: { errors },
  } = methods;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
      {/* Password */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="password">Password</label>
        <div style={{ position: 'relative' }}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        {errors.password && (
          <p style={{ color: 'red', marginBottom: '10px' }}>
            {errors.password.message as string}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <div style={{ position: 'relative' }}>
          <input
            id="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            {...register('confirmPassword', {
              required: 'Confirm Password is required',
              validate: (value) =>
                value === getValues('password') || 'Passwords do not match',
            })}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {showConfirm ? '🙈' : '👁️'}
          </button>
        </div>
        {errors.confirmPassword && (
          <p style={{ color: 'red', marginBottom: '10px' }}>
            {errors.confirmPassword.message as string}
          </p>
        )}
      </div>
    </div>
  );
};

export default Step9;
