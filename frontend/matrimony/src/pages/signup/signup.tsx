import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import MultiStepForm from '../multiStep/MultiStepForm';
import { useLoginUserMutation } from '../../features/auth/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUser } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';




interface FormData {
  mobileNumber: string;
  password: string;
}

const SignUp: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isSignUp, setIsSignUp] = useState(true); // true means sign-up (MultiStepForm), false means sign-in

  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();


 const onSubmit = async (data: FormData) => {
  try {
    const result = await loginUser(data).unwrap();
    if (result?.user?.token) {
      const { token, ...userData } = result?.user;
      dispatch(setToken(token));
      dispatch(setUser(userData));

      toast.success(result.message || 'Login successful!', {
        autoClose: 1000,
        onClose: () => navigate('/profile'),
      });
    } else {
      toast.error('Login failed.');
    }
  } catch (error: any) {
    console.error('Login failed', error);
    toast.error(error?.data?.message || 'Login failed. Please try again.');
  }
};

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      {isSignUp ? (
        <>
          <MultiStepForm />
          <div className="text-center mt-3 mb-3">
            <span>Already have an account? </span>
            <button className="btn btn-link p-0" onClick={() => setIsSignUp(false)}>
              Sign In
            </button>
          </div>
        </>
      ) : (
        <div className="card shadow" style={{ width: '400px' }}>
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Sign In 👋</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <input
                  type="number"
                  className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
                  placeholder="Mobile number"
                  {...register('mobileNumber', { required: 'Email is required' })}
                />
                {errors.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber.message}</div>}
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Password"
                  {...register('password', { required: 'Password is required' })}
                />
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-2">
                Sign In
              </button>
            </form>

            <div className="text-center mt-3">
              <span>Don’t have an account? </span>
              <button className="btn btn-link p-0" onClick={() => setIsSignUp(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;

