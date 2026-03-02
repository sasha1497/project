import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setTokens, setUse } from '../../features/form/formSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";

import './multi.css';
import { useSubmitFormMutation } from '../../features/form/formApi';
import Loader from '../../components/loader/loader';

import logo from '../../asset/bajollogo.jpeg';

type SignupFormValues = {
  mobile: string;
  state: string;
  password: string;
  confirmPassword: string;
};

const INDIAN_STATES_AND_UTS = [
  'Kerala',
  'Tamil Nadu',
  'Andhra Pradesh',
  'Telangana',
  'Karnataka',
  'Punjab',
  'Manipur',
  'Gujarat',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Madhya Pradesh',
  'Maharashtra',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Rajasthan',
  'Sikkim',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    defaultValues: {
      mobile: '',
      state: '',
      password: '',
      confirmPassword: '',
    },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitForm, { isLoading }] = useSubmitFormMutation();

  const onSubmit = async (data: any) => {
    try {
      const result = await submitForm(data).unwrap();

      dispatch(setTokens(result?.data?.token));
      dispatch(setUse(result?.data));

      toast.success(result?.message || 'User created successfully', {
        autoClose: 500,
        onClose: () => navigate('/profile'),
      });
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        'Registration failed. Please try again later.';

      toast.error(errorMessage, {
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-10">
      {isLoading && <Loader />}
      <div className="card shadow" style={{ width: '400px' }}>
        <div className="card-body">
          <motion.img
            src={logo}
            alt="Company Logo"
            style={{ width: "120px" }}
            className="d-block mx-auto"
            animate={{
              x: [0, 15, -15, 0], // move right → left → center
            }}
            transition={{
              duration: 3, // total time per loop
              repeat: Infinity, // repeat forever
              ease: "easeInOut",
            }}
          />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3 mt-3">
              <input
                type="text"
                className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                placeholder="Phone Number"
                {...register('mobile', {
                  required: 'Phone number is required',
                })}
              />
              {errors.mobile && <div className="invalid-feedback">{errors.mobile.message}</div>}
            </div>

            <div className="mb-3">
              <select
                className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                {...register('state', {
                  required: 'State is required',
                })}
                defaultValue=""
              >
                <option value="" disabled>
                  Select State
                </option>
                {INDIAN_STATES_AND_UTS.map((stateName) => (
                  <option key={stateName} value={stateName}>
                    {stateName}
                  </option>
                ))}
              </select>
              {errors.state && <div className="invalid-feedback">{errors.state.message}</div>}
            </div>

            <div className="mb-3">
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Password"
                {...register('password', {
                  required: 'Password is required',
                })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>

            <div className="mb-3">
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Confirm Password"
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: (value) =>
                    value === watch('password') || 'Password and confirm password do not match',
                })}
              />
              {errors.confirmPassword && (
                <div className="invalid-feedback">{errors.confirmPassword.message}</div>
              )}
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button type="submit" className="btn btn-primary blinking-btn">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
