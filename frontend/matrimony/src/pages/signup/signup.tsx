import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import MultiStepForm from '../multiStep/MultiStepForm';
import { useLoginUserMutation } from '../../features/auth/authApi';
import { useDispatch } from 'react-redux';
import { setToken } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';


interface FormData {
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isSignUp, setIsSignUp] = useState(true); // true means sign-up (MultiStepForm), false means sign-in

  const onSubmit = (data: FormData) => {
    console.log('Sign In Data:', data);
  };

  // const [loginUser] = useLoginUserMutation();
  // const dispatch = useDispatch();
  // const navigate = useNavigate();


  // const onSubmit = async (data: FormData) => {
  //   try {
  //     const result = await loginUser(data).unwrap();
  //     if (result?.token) {
  //       dispatch(setToken(result.token));
  //       navigate('/profile');
  //     }
  //   } catch (error) {
  //     console.error('Login failed', error);
  //   }
  // };

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
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="📧 Email"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="🔒 Password"
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

