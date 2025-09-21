import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import MultiStepForm from '../multiStep/MultiStepForm';
import { useLoginUserMutation } from '../../features/auth/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUser } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './signup.css';
import { useSendOtpMutation, useVerifyOtpMutation } from '../../features/otp/otpApi';
import {
  setOtpLoading,
  setOtpSent,
  setOtpVerified,
  setOtpError,
  resetOtp,
} from '../../features/otp/otpSlice';
import { RootState } from '../../app/store';

import { useAppSelector, useAppDispatch } from '../../app/hooks';





interface FormData {
  mobileNumber: string;
  password: string;
}

const SignUp: React.FC = () => {
  const { control, register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isSignUp, setIsSignUp] = useState(true);
  const [loginUser] = useLoginUserMutation();
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  // Forgot password state
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  // OTP timer
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const dispatch = useAppDispatch();
const { otpSent, otpVerified, loading, error } = useAppSelector((state) => state.otp);

  // const { otpSent, otpVerified, loading, error } = useSelector((state: RootState) => state.otp);

  const [sendOtp] = useSendOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();

  const onSubmit = async (data: FormData) => {
    try {
      // Ensure mobile number has +
      // if (!/^\+[1-9]\d{6,14}$/.test(data.mobileNumber)) {
      //   toast.error("Enter valid mobile number with country code");
      //   return;
      // }

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

  // Forgot password handlers
  // const handleMobileSubmit = () => {
  //   if (!/^\+[1-9]\d{6,14}$/.test(mobile)) {
  //     toast.error("Enter valid mobile number with country code");
  //     return;
  //   }
  //   // Call API to send OTP
  //   toast.success("OTP sent to " + mobile);
  //   setStep("otp");
  //   setTimer(30); // Start 30s countdown
  // };

  // const handleOtpSubmit = () => {
  //   if (otp.length !== 4) {
  //     toast.error("Enter valid 4-digit OTP");
  //     return;
  //   }
  //   // Call API to verify OTP
  //   toast.success("OTP verified successfully!");
  //   setShowForgotPopup(false);
  //   setStep("mobile");
  //   setMobile("");
  //   setOtp("");
  //   setTimer(0);
  // };

   const handleMobileSubmit = async () => {
    try {
      dispatch(setOtpLoading(true));
      await sendOtp({ mobileNumber: mobile }).unwrap();
      dispatch(setOtpSent(mobile));
      toast.success("OTP sent to " + mobile);
      setStep("otp");
      setTimer(30);
    } catch (err: any) {
      dispatch(setOtpError(err?.data?.message || "Failed to send OTP"));
      toast.error(err?.data?.message || "Failed to send OTP");
    } finally {
      dispatch(setOtpLoading(false));
    }
  };

  const handleOtpSubmit = async () => {
    try {
      dispatch(setOtpLoading(true));
      await verifyOtp({ mobileNumber: mobile, otp }).unwrap();
      dispatch(setOtpVerified());
      toast.success("OTP verified successfully!");
      setShowForgotPopup(false);
      setStep("mobile");
      setMobile("");
      setOtp("");
      setTimer(0);
    } catch (err: any) {
      dispatch(setOtpError(err?.data?.message || "OTP verification failed"));
      toast.error(err?.data?.message || "OTP verification failed");
    } finally {
      dispatch(setOtpLoading(false));
    }
  };

  const handleResendOtp = () => {
    // Call API to resend OTP
    toast.info("New OTP sent to " + mobile);
    setTimer(30); // Restart countdown
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
              {/* Mobile number with country code */}
              {/* <div className="mb-3">
                <Controller
                  name="mobileNumber"
                  control={control}
                  rules={{ required: "Mobile number is required" }}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      country={'in'}
                      value={field.value}
                      onChange={(value) => field.onChange("+" + value)}
                      inputClass={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
                      inputStyle={{ width: "100%" }}
                      placeholder="Enter mobile number"
                    />
                  )}
                />
                {errors.mobileNumber && (
                  <div className="invalid-feedback">{errors.mobileNumber.message}</div>
                )}
              </div> */}
               <div className="mb-3">
                <input
                   type="number"
                   className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
                   placeholder="Mobile number"
                   {...register('mobileNumber', { required: 'Mobile number is required' })}
                 />
                 {errors.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber.message}</div>}
               </div>

              {/* Password */}
              <div className="mb-3">
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Password"
                  {...register('password', { required: 'Password is required' })}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password.message}</div>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-2">
                Sign In
              </button>
            </form>

            {/* Forgot password link */}
            <div className="text-center">
              <button
                className="btn btn-link p-0"
                onClick={() => setShowForgotPopup(true)}
              >
                Forgot Password?
              </button>
            </div>

            <div className="text-center mt-3">
              <span>Don’t have an account? </span>
              <button className="btn btn-link p-0" onClick={() => setIsSignUp(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Popup */}
      {showForgotPopup && (
        <div className="modal-backdrop d-flex align-items-center justify-content-center">
          <div className="card shadow p-4" style={{ width: "350px" }}>
            <h5 className="text-center mb-3">Forgot Password</h5>

            {step === "mobile" && (
              <>
                <PhoneInput
                  country={'in'}
                  value={mobile}
                  onChange={(phone) => setMobile("+" + phone)}
                  inputClass="form-control mb-3"
                  inputStyle={{ width: "100%" }}
                  placeholder="Enter mobile number"
                />
                <button className="btn btn-primary w-100 mt-3" onClick={handleMobileSubmit}>
                  Send OTP
                </button>
              </>
            )}

            {step === "otp" && (
              <>
                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button className="btn btn-success w-100 mb-2" onClick={handleOtpSubmit}>
                  Verify OTP
                </button>

                {/* Timer & Resend OTP */}
                {timer > 0 ? (
                  <p className="text-center text-muted">
                    Resend OTP in <strong>{timer}s</strong>
                  </p>
                ) : (
                  <button className="btn btn-link w-100" onClick={handleResendOtp}>
                    Resend OTP
                  </button>
                )}
              </>
            )}

            <button
              className="btn btn-link mt-3 w-100"
              onClick={() => {
                setShowForgotPopup(false);
                setStep("mobile");
                setTimer(0);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
