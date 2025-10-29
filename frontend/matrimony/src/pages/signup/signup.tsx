import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import MultiStepForm from '../multiStep/MultiStepForm';
import { useLoginUserMutation } from '../../features/auth/authApi';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setToken, setUser } from '../../features/auth/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './signup.css';
import { useSendOtpMutation, useVerifyOtpMutation, useResetPasswordMutation } from '../../features/otp/otpApi';
import { setOtpLoading, setOtpSent, setOtpVerified, setOtpError } from '../../features/otp/otpSlice';

interface FormData {
  mobileNumber: string;
  password: string;
}

const SignUp: React.FC = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: { mobileNumber: '', password: '' }
  });

  const [isSignUp, setIsSignUp] = useState(true);
  const [loginUser] = useLoginUserMutation();
  const [sendOtp] = useSendOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [resetPassword] = useResetPasswordMutation();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.otp);

  // Forgot password states
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [passwordStep, setPasswordStep] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // OTP timer
  const [timer, setTimer] = useState(0);

  const location = useLocation();

  const flag = location.state?.flag;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Login handler
  const onSubmit = async (data: FormData) => {
    try {
      const result = await loginUser(data).unwrap();
      if (result?.user?.token) {
        const { token, ...userData } = result.user;
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
      toast.error(error?.data?.message || 'Login failed. Please try again.');
    }
  };

  // Send OTP
  const handleMobileSubmit = async () => {
    if (!/^\+\d{6,14}$/.test(mobile)) {
      toast.error("Enter valid mobile number with country code");
      return;
    }

    try {
      dispatch(setOtpLoading(true));
      await sendOtp({ mobileNumber: mobile }).unwrap();
      dispatch(setOtpSent(mobile));
      toast.success("OTP sent to " + mobile);
      setStep("otp");
      setTimer(60);
    } catch (err: any) {
      dispatch(setOtpError(err?.data?.message || "Failed to send OTP"));
      toast.error(err?.data?.message || "Failed to send OTP");
    } finally {
      dispatch(setOtpLoading(false));
    }
  };

  // Verify OTP
  const handleOtpSubmit = async () => {
    if (!/^\d{4}$/.test(otp)) {
      toast.error("Enter a valid 4-digit OTP");
      return;
    }

    try {
      dispatch(setOtpLoading(true));
      const result = await verifyOtp({ mobileNumber: mobile, otp }).unwrap();

      if (result?.success) {
        dispatch(setOtpVerified());
        toast.success(result.message || "OTP verified successfully!");
        setPasswordStep(true);
      } else {
        dispatch(setOtpError(result.message || "OTP verification failed"));
        toast.error(result.message || "OTP verification failed");
      }
    } catch (err: any) {
      dispatch(setOtpError(err?.data?.message || "OTP verification failed"));
      toast.error(err?.data?.message || "OTP verification failed");
    } finally {
      dispatch(setOtpLoading(false));
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      dispatch(setOtpLoading(true));
      await sendOtp({ mobileNumber: mobile }).unwrap();
      toast.info("New OTP sent to " + mobile);
      setTimer(60);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend OTP");
    } finally {
      dispatch(setOtpLoading(false));
    }
  };

  // Set new password
  const handleSetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Both password fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      dispatch(setOtpLoading(true));
      const result = await resetPassword({
        mobileNumber: mobile,
        password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();

      if (result?.success) {
        toast.success(result.message || "Password updated successfully!");
        setShowForgotPopup(false);
        setPasswordStep(false);
        setStep("mobile");
        setMobile("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setTimer(0);
      } else {
        toast.error(result.message || "Failed to update password");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password");
    } finally {
      dispatch(setOtpLoading(false));
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      {flag == 2 ? (
        <>
          {/* <div className="text-center mt-4 mb-3 bg-primary text-white p-2">
            <span>Already have an account? </span>
            <button className="btn btn-link p-0 blinking-btn text-white" onClick={() => setIsSignUp(false)}>Sign In</button>
          </div> */}
          <MultiStepForm />
        </>
      ) : (
        <div className="card shadow" style={{ width: '400px' }}>
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Sign In 👋</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Mobile input with country code, connected to react-hook-form */}
              {/* <div className="mb-3">
                <PhoneInput
                  country="in"
                  value={mobile}
                  onChange={(phone) => {
                    const fullPhone = "+" + phone;
                    setMobile(fullPhone);
                    setValue("mobileNumber", fullPhone, { shouldValidate: true });
                  }}
                  inputClass={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
                  inputStyle={{ width: "100%" }}
                  placeholder="Enter mobile number"
                />
                {errors.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber.message}</div>}
              </div> */}
              <div className="mb-3">
                <PhoneInput
                  country="in"
                  onlyCountries={['in']}       // ✅ Restrict to India only
                  disableDropdown={true}       // ✅ Hide the country selector
                  countryCodeEditable={false}  // ✅ Prevent editing +91
                  value={mobile}
                  onChange={(phone) => {
                    const fullPhone = "+" + phone;
                    setMobile(fullPhone);
                    setValue("mobileNumber", fullPhone, { shouldValidate: true });
                  }}
                  inputClass={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
                  inputStyle={{ width: "100%" }}
                  placeholder="Enter mobile number"
                />

                {errors.mobileNumber && (
                  <div className="invalid-feedback">
                    {errors.mobileNumber.message}
                  </div>
                )}

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

              <button type="submit" className="btn btn-primary w-100 mb-2 blinking-btn">Next →</button>
            </form>

            <div className="text-center">
              <button className="btn btn-link p-0" onClick={() => setShowForgotPopup(true)}>Forgot Password?</button>
            </div>

            {/* <div className="text-center mt-3">
              <span>Don’t have an account? </span>
              <button className="btn btn-link p-0" onClick={() => setIsSignUp(true)}>Sign Up</button>
            </div> */}
          </div>
        </div>
      )}

      {/* Forgot Password Popup */}
      {showForgotPopup && (
        <div className="modal-backdrop d-flex align-items-center justify-content-center">
          <div className="card shadow p-4" style={{ width: "350px" }}>
            <h5 className="text-center mb-3">Forgot Password</h5>

            {!passwordStep && step === "mobile" && (
              // <>
              //   <PhoneInput
              //     country="in"
              //     value={mobile}
              //     onChange={(phone) => setMobile("+" + phone)}
              //     inputClass="form-control mb-3"
              //     inputStyle={{ width: "100%" }}
              //     placeholder="Enter mobile number"
              //   />
              //   <button className="btn btn-primary w-100 mt-3" onClick={handleMobileSubmit} disabled={loading}>
              //     {loading ? 'Sending...' : 'Send OTP'}
              //   </button>
              // </>
              <>
                <PhoneInput
                  country="in"
                  onlyCountries={['in']}        // ✅ Restrict to India only
                  disableDropdown={true}        // ✅ Hide country dropdown
                  countryCodeEditable={false}   // ✅ Prevent editing +91
                  value={mobile}
                  onChange={(phone) => setMobile("+" + phone)}
                  inputClass="form-control mb-3"
                  inputStyle={{ width: "100%" }}
                  placeholder="Enter mobile number"
                />

                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={handleMobileSubmit}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </>
            )}

            {!passwordStep && step === "otp" && (
              <>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d{0,4}$/.test(val)) setOtp(val);
                  }}
                />
                <button className="btn btn-success w-100 mb-2" onClick={handleOtpSubmit} disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                {timer > 0 ? (
                  <p className="text-center text-muted">Resend OTP in <strong>{timer}s</strong></p>
                ) : (
                  <button className="btn btn-link w-100" onClick={handleResendOtp} disabled={loading}>Resend OTP</button>
                )}
              </>
            )}

            {passwordStep && (
              <>
                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button className="btn btn-success w-100" onClick={handleSetPassword} disabled={loading}>
                  {loading ? 'Updating...' : 'Set Password'}
                </button>
              </>
            )}

            <button
              className="btn btn-link mt-3 w-100"
              onClick={() => {
                setShowForgotPopup(false);
                setStep("mobile");
                setPasswordStep(false);
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
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
