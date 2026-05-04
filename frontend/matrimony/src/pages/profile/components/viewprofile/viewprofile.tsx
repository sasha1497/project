import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './viewprofile.css';
import { useGetAllUsersQuery } from '../../../../features/view/viewApi';
import { closeViewPopup, openViewPopup } from "../../../../features/profileui/profileUISlice";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useDeleteUserAccountMutation } from '../../../../features/deleteaccount/deleteAccountApi';
import { STATE_DISTRICT_MAP } from '../../../steps/step2';
import { useAppLanguage } from '../../../../i18n/LanguageContext';
import axios from 'axios';
import { load } from '@cashfreepayments/cashfree-js';


type ImageData = {
  name: string;
  url: string;
  date: string;
};

type UserDetails = {
  imageData: ImageData[];
};

type User = {
  id: number;
  name: string;
  userDetails: UserDetails;
};

// const countries = ['India', 'USA']; // Example countries, update as needed
const countries = [
  "India",
  // "USA",
  // "England",
  // "Australia",
  // "Canada",
  // "New Zealand",
  // "Scotland",
  // "Netherlands",
  // "Switzerland",
  // "Ireland",
  // "Bahrain",
  // "Kuwait",
  // "Oman",
  // "Qatar",
  // "Saudi Arabia",
  // "Dubai",
  // "Malta",
  // "Bermuda",
  // "Malaysia",
  // "Singapore",
  // "Germany",
  // "Sweden",
  // "Denmark",
  // "Sharjah",
  // "Abhudhabi",
  // "Brunei",
  // "Mauritius",
  // "Philippine",
  // "Israel",
  // "Sri Lanka",
  // "wales",
  // "Finland",
  // "Bahamas",
  // "Fiji",
  // "Solomon Island",
  // "Barbados",
  // "Saint Lucia",
  // "Zambia",
  // "Botswana",
  // "Egypt",
  // "Mexico",
  // "Thailand",
  // "Colombia",
  // "Greece",
  // "Ghana",
  // "Norway"
];

const STATES = Object.keys(STATE_DISTRICT_MAP);
const API_BASE_URL = String(process.env.REACT_APP_API_BASE_URL || 'https://usrapi.bajolmatrimony.com').replace(/\/+$/, '');

const maskContactValue = (value?: string | null) => {
  const raw = String(value || '').trim();
  if (!raw) return 'XXXXXXXXXX';

  const visibleDigits = raw.replace(/\D/g, '').slice(-2);
  return `XXXXXX${visibleDigits || 'XX'}`;
};



const ViewProfile: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [cashfree, setCashfree] = useState<any>(null);
  const [unlockingProfileId, setUnlockingProfileId] = useState<number | null>(null);
  const { t } = useAppLanguage();


  const [step, setStep] = useState<number>(1);


  const [formValues, setFormValues] = useState({
    country: "",
    state: "",
    district: "",
    gender: ""
  });

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => prev - 1);


  const handleSubmitSearch = () => {
    setPayload({
      page: 1,
      limit: 1000,
      viewerUserId: userId || null,
      filter: { ...formValues },
      // search: ""
    });
  };

  const handleNoDistrict = () => {
    setFormValues((prev) => ({
      ...prev,
      district: "N/A",
    }));

    toast.info(t('profile.view.districtSkipped'));
    handleNextStep();
  };


  // Payload state for API query
  const [payload, setPayload] = useState<any>({
    page: 1,
    limit: 100,
    viewerUserId: null,
    filter: {
      country: '',
      state: '',
      district: '',
      gender: ''
    },
    // search: ""
  });

  // Update payload and trigger API refetch on submit
  // const handleSearchSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   setPayload({
  //     ...payload,
  //     page: 1, // reset page on new search
  //     filter: {
  //       country: countryInput,
  //       state: stateInput,
  //       district: districtInput,
  //       gender: genderInput
  //     }
  //   });
  // };

  const dispatch = useDispatch();
  const districts = formValues.state ? STATE_DISTRICT_MAP[formValues.state] || [] : [];

  const [deleteUserAccount] = useDeleteUserAccountMutation();

  const { data: users = [], isLoading, error, refetch: refetchUsers } = useGetAllUsersQuery(payload);

  const authUser = useSelector((state: any) => state.auth.user);
  const userId = authUser?.id;

  useEffect(() => {
    (async () => {
      const cfInstance = await load({ mode: 'production' });
      setCashfree(cfInstance);
    })();
  }, []);

  useEffect(() => {
    if (!userId) return;
    setPayload((prev: any) => ({
      ...prev,
      viewerUserId: userId,
    }));
  }, [userId]);

  if (isLoading) return <div>{t('profile.view.loading')}</div>;
  if (error) return <div>{t('profile.view.errorLoading')}</div>;

  const openUserImages = (user: User) => {
    setSelectedUser(user);
    setCurrentIndex(0);
  };

  const nextImage = () => {
    if (!selectedUser) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === selectedUser.userDetails.imageData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!selectedUser) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? selectedUser.userDetails.imageData.length - 1 : prevIndex - 1
    );
  };

  // const handleDeleteAccount = async () => {
  //   if (!userId) {
  //     toast.error("User ID not found");
  //     return;
  //   }

  //   const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
  //   if (!confirmDelete) return;

  //   try {
  //     const response = await fetch(`http://localhost:3002/user/delete/${userId}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`, // optional if auth is needed
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to delete account");
  //     }

  //     toast.success("Account deleted successfully!");

  //     // Optional: clear local storage and redirect to login
  //     localStorage.removeItem("token");
  //     localStorage.removeItem("user");

  //     // Close popup or redirect
  //     dispatch(closeViewPopup());
  //     window.location.href = "/dashboard"; // redirect to login page

  //   } catch (error) {
  //     console.error("Delete failed:", error);
  //     toast.error("Something went wrong while deleting your account.");
  //   }
  // };

  const handleDeleteAccount = async () => {

    if (!userId) {
      toast.error(t('profile.view.userIdMissing'));
      return;
    }

    const confirmDelete = window.confirm(t('profile.view.confirmDelete'));
    if (!confirmDelete) return;

    try {
      await deleteUserAccount(userId).unwrap();
      toast.success(t('profile.view.deleteSuccess'));

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      dispatch(closeViewPopup());
      window.location.href = "/dashboard"; // redirect
    } catch (err: any) {
      toast.error(t('profile.view.deleteFailed'));
      console.error(err);
    }
  };

  const normalizeUnlockedProfile = (profile: any) => ({
    ...profile,
    userDetails: {
      imageData: profile?.imageData || [],
    },
  });

  const handleUnlockContact = async () => {
    if (!selectedUser?.id || !userId) {
      toast.error('Unable to start payment');
      return;
    }

    if (!cashfree) {
      toast.error('Payment is loading. Please wait a moment.');
      return;
    }

    try {
      setUnlockingProfileId(Number(selectedUser.id));

      const orderResponse = await axios.post(
        `${API_BASE_URL}/cashfree/create-profile-access-order`,
        {
          viewer_user_id: userId,
          target_user_id: selectedUser.id,
          order_amount: 1,
          order_currency: 'INR',
          receipt: `profile_${userId}_${selectedUser.id}_${Date.now()}`,
          customer_phone: authUser?.phone_number || authUser?.mobile || '',
          customer_email: authUser?.email || '',
        }
      );

      const sessionId = orderResponse?.data?.cashfree_order?.payment_session_id;
      const cashfreeOrderId = orderResponse?.data?.cashfree_order?.order_id;

      if (!sessionId || !cashfreeOrderId) {
        throw new Error('Failed to create payment order');
      }

      await cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget: '_modal',
        onSuccess: async () => {
          try {
            const confirmResponse = await axios.post(
              `${API_BASE_URL}/cashfree/confirm-profile-access-order`,
              {
                cashfree_order_id: cashfreeOrderId,
              }
            );

            const unlockedProfile = confirmResponse?.data?.unlockedProfile;

            if (unlockedProfile) {
              setSelectedUser(normalizeUnlockedProfile(unlockedProfile));
            }

            await refetchUsers();
            toast.success('Contact unlocked successfully');
          } catch (confirmError) {
            console.error(confirmError);
            toast.error('Payment succeeded but contact unlock failed');
          } finally {
            setUnlockingProfileId(null);
          }
        },
        onFailure: () => {
          toast.error('Payment failed, please try again');
          setUnlockingProfileId(null);
        },
        onClose: () => {
          setUnlockingProfileId(null);
        },
      });
    } catch (paymentError: any) {
      console.error(paymentError);
      toast.error(
        paymentError?.response?.data?.message ||
        paymentError?.message ||
        'Unable to start profile payment'
      );
      setUnlockingProfileId(null);
    }
  };

  return (
    <div className="gallery-container">

      {/* Multi-Step Form */}
      <div className="d-flex justify-content-center mt-5">
        <motion.div
          className="animated-border-card shadow-sm"
          style={{ width: "100%", maxWidth: "500px" }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="card-body p-4">
            {/* Progress Bar */}
            <div className="progress mb-4" style={{ height: "8px", borderRadius: "8px" }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: `${(step / 4) * 100}%` }}
                aria-valuenow={(step / 4) * 100}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>

            {step === 1 && (
              <div className="mb-3 mt-5">
                <motion.h4
                  className="form-label fw-bold mb-5 text-primary jump-heading"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {t('profile.view.step1Title')}
                </motion.h4>
                <select
                  value={formValues.country}
                  onChange={(e) => setFormValues({ ...formValues, country: e.target.value })}
                  className="form-select"
                >
                  <option value="">{t('profile.view.selectCountry')}</option>
                  {countries.map((c) => (
                    <option key={c} value={c.toLowerCase()}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className="d-flex justify-content-end mt-3">
                  <button
                    disabled={!formValues.country}
                    onClick={handleNextStep}
                    className="btn btn-primary blinking-btn"
                  >
                    {t('profile.view.next')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: State */}
            {step === 2 && (
              // <div className="mb-3">
              //   <motion.h4
              //     className="form-label fw-bold mb-5 text-primary jump-heading"
              //     initial={{ opacity: 0, y: -50 }}
              //     animate={{ opacity: 1, y: 0 }}
              //     transition={{ duration: 0.6, ease: "easeOut" }}
              //   >
              //     {/* You can select your interest <span className='text-danger'>State / Region</span> to get bride or groom? */}
              //     You can select your interest <span className='text-danger'>State</span> to get bride or groom?
              //   </motion.h4>
              //   <input
              //     type="text"
              //     value={formValues.state}
              //     onChange={(e) => setFormValues({ ...formValues, state: e.target.value })}
              //     // placeholder="Enter State / Region"
              //     placeholder="Enter State"
              //     className="form-control"
              //   />

              //   {/* 👇 Clickable helper text */}
              //   <p
              //     className="text-primary mt-2 dont-have-text cursor-pointer"
              //     onClick={() => setFormValues({ ...formValues, state: "N/A" })}
              //   >
              //     I Don’t Know State / Region
              //   </p>
              //   <div className="d-flex justify-content-between mt-3">
              //     <button onClick={handlePrevStep} className="btn btn-outline-secondary">
              //       Back
              //     </button>
              //     <button
              //       disabled={!formValues.state}
              //       onClick={handleNextStep}
              //       className="btn btn-primary blinking-btn"
              //     >
              //       Next →
              //     </button>
              //   </div>
              // </div>
              <div className="mb-3">
                <motion.h4
                  className="form-label fw-bold mb-5 text-primary jump-heading"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {t('profile.view.step2Title')}
                </motion.h4>

                {/* ✅ Dropdown for Indian States */}
                <select
                  value={formValues.state}
                  onChange={(e) =>
                    setFormValues({ ...formValues, state: e.target.value, district: "" })
                  }
                  className="form-control"
                >
                  <option value="">{t('profile.view.selectState')}</option>
                  {STATES.map((stateName) => (
                    <option key={stateName} value={stateName}>
                      {stateName}
                    </option>
                  ))}
                </select>

                {/* 👇 Clickable helper text */}
                {/* <p
                  className="text-primary mt-2 dont-have-text cursor-pointer"
                  onClick={() => setFormValues({ ...formValues, state: "N/A" })}
                >
                  I Don’t Know State / Region
                </p> */}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-3">
                  <button onClick={handlePrevStep} className="btn btn-outline-secondary">
                    {t('profile.view.back')}
                  </button>
                  <button
                    disabled={!formValues.state}
                    onClick={handleNextStep}
                    className="btn btn-primary blinking-btn"
                  >
                    {t('profile.view.next')}
                  </button>
                </div>
              </div>

            )}

            {/* Step 3: District */}
            {step === 3 && (
              <div className="mb-3">
                <motion.h4
                  className="form-label fw-bold mb-5 text-primary jump-heading"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {t('profile.view.step3Title')}
                </motion.h4>
                {/* <input
                  type="text"
                  value={formValues.district}
                  onChange={(e) => setFormValues({ ...formValues, district: e.target.value })}
                  // placeholder="Enter District / Territory"
                  placeholder="Enter District"
                  className="form-control"
                /> */}
                <select
                  value={formValues.district}
                  onChange={(e) =>
                    setFormValues({ ...formValues, district: e.target.value })
                  }
                  className="form-control"
                  disabled={!formValues.state}
                >
                  <option value="">
                    {formValues.state ? t('profile.view.selectDistrict') : t('profile.view.selectStateFirst')}
                  </option>
                  {districts.map((districtName) => (
                    <option key={districtName} value={districtName}>
                      {districtName}
                    </option>
                  ))}
                </select>
                <p
                  className="text-primary mt-2 dont-have-text cursor-pointer"
                  // onClick={() => setFormValues({ ...formValues, district: "N/A" })}
                  onClick={handleNoDistrict}

                >
                  {t('profile.view.noDistrict')}
                </p>
                <div className="d-flex justify-content-between mt-3">
                  <button onClick={handlePrevStep} className="btn btn-outline-secondary">
                    {t('profile.view.back')}
                  </button>
                  <button
                    disabled={!formValues.district}
                    onClick={handleNextStep}
                    className="btn btn-primary blinking-btn"
                  >
                    {t('profile.view.next')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Gender */}
            {step === 4 && (
              <div className="mb-3">
                <motion.h4
                  className="form-label fw-bold mb-5 text-primary jump-heading"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                 {t('profile.view.step4Title')}
                </motion.h4>
                <label htmlFor="gender" className="form-label fw-bold fs-4 text-primary">
                  {t('profile.view.selectNow')}
                </label>
                <select
                  value={formValues.gender}
                  onChange={(e) => setFormValues({ ...formValues, gender: e.target.value })}
                  className="form-select"
                >
                  <option value="">{t('profile.view.selectGender')}</option>
                  <option value="male">{t('profile.gender.male')}</option>
                  <option value="female">{t('profile.gender.female')}</option>
                  <option value="transgender">{t('profile.gender.transgender')}</option>
                </select>
                <div className="d-flex justify-content-between mt-3">
                  <button onClick={handlePrevStep} className="btn btn-outline-secondary">
                    {t('profile.view.back')}
                  </button>
                  <button
                    disabled={!formValues.gender}
                    onClick={handleSubmitSearch}
                    className="btn btn-success blinking-btn"
                  >
                    {t('profile.view.next')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <>
        {users.length > 0 ? (
          <>
            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 my-3">
              <button
                className="btn btn-primary px-4 py-2 shadow-lg fw-bold"
                onClick={() => dispatch(openViewPopup())}
                style={{
                  borderRadius: '50px',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {t('profile.view.viewMyProfile')}
              </button>

              <button
                className="btn btn-danger px-4 py-2 shadow-lg fw-bold"
                style={{
                  borderRadius: '50px',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                onClick={handleDeleteAccount}
              >
                {t('profile.view.deleteMyAccount')}
              </button>
              {/* 🔄 Reload Button */}
              <button
                className="btn btn-success px-4 py-2 shadow-lg fw-bold"
                onClick={() => window.location.reload()}
                style={{
                  borderRadius: '50px',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {t('profile.view.reload')}
              </button>
            </div>
            <div className="gallery-grid">
              {/* <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li> */}
              {users.map((user: any) => {
                const firstImage = user?.userDetails?.imageData?.[0];
                if (!firstImage) return null;

                return (
                  <motion.div
                    key={user.id}
                    className="gallery-card"
                    whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}
                    onClick={() => openUserImages(user)}
                  >
                    <motion.img
                      src={firstImage.url}
                      alt={`${t('profile.view.label.name')}: ${user.name}`}
                      className="gallery-image"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="gallery-description">
                      {t('profile.view.label.name')}: {user.name}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="no-users-container">
            <div className="no-users-card">
              <h3>{t('profile.view.noUsersTitle')}</h3>
              <p>{t('profile.view.noUsersBody')}</p>
            </div>
          </div>
        )}
      </>



      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="popup-overlay mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              className="popup-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
            >
              <div className="close-icon" onClick={() => setSelectedUser(null)}>
                &times;
              </div>

              <img
                src={selectedUser.userDetails.imageData[currentIndex].url}
                alt={selectedUser.userDetails.imageData[currentIndex].name}
                className="popup-image"
                style={{ maxWidth: '50vh', maxHeight: '50vh', borderRadius: '8px' }}
              />

              <div className="view-profile-content">
                <p><strong>{t('profile.view.label.name')} :</strong> {selectedUser?.name}</p>
                <p><strong>{t('profile.view.label.age')} :</strong> {selectedUser?.age}</p>
                <p><strong>{t('profile.view.label.gender')} :</strong> {selectedUser?.gender}</p>
                {/* <p><strong>Height:</strong> {selectedUser?.height}</p>
                <p><strong>Weight:</strong> {selectedUser?.weight}</p> */}
                <p><strong>{t('profile.view.label.caste')}:</strong> {selectedUser?.caste}</p>
                <p><strong>{t('profile.view.label.religion')}:</strong> {selectedUser?.religion}</p>
                <p><strong>{t('profile.view.label.district')}:</strong> {selectedUser?.district || selectedUser?.userDetails?.district || t('profile.view.notAvailable')}</p>
                <p><strong>{t('profile.view.label.state')}:</strong> {selectedUser?.state || selectedUser?.userDetails?.state || t('profile.view.notAvailable')}</p>
                <p><strong>{t('profile.view.label.country')}:</strong> {selectedUser?.country}</p>
                <div
                  className="contact-unlock-card mt-3 mb-3 p-3 border rounded"
                  style={{ background: '#fff8e6', borderColor: '#f0c36d' }}
                >
                  <h6 className="mb-3" style={{ color: '#8a5a00' }}>Contact Details</h6>
                  <div className="mb-2">
                    <strong>{t('profile.view.label.mobile')}:</strong>{' '}
                    {selectedUser?.contactUnlocked
                      ? (selectedUser?.phone_number || t('profile.view.notAvailable'))
                      : maskContactValue(selectedUser?.phone_number)}
                  </div>
                  <div className="mb-3">
                    <strong>{t('profile.view.label.whatsapp')}:</strong>{' '}
                    {selectedUser?.contactUnlocked
                      ? (selectedUser?.whatsapp || t('profile.view.notAvailable'))
                      : maskContactValue(selectedUser?.whatsapp)}
                  </div>

                  {!selectedUser?.contactUnlocked && (
                    <>
                      <p className="mb-3">Pay now to unlock this profile mobile number and WhatsApp number.</p>
                      <button
                        type="button"
                        className="btn btn-warning"
                        disabled={unlockingProfileId === Number(selectedUser?.id)}
                        onClick={handleUnlockContact}
                      >
                        {unlockingProfileId === Number(selectedUser?.id) ? 'Processing...' : 'Pay Now'}
                      </button>
                    </>
                  )}
                </div>
                <p><strong>{t('profile.view.label.job')}:</strong> {selectedUser?.job}</p>
                <p><strong>{t('profile.view.label.salary')}:</strong> {selectedUser?.monthlySalary}</p>
                <p><strong>{t('profile.view.label.marriageStatus')}:</strong> {selectedUser?.count || selectedUser?.userDetails?.count || t('profile.view.notAvailable')}</p>
                <p><strong>{t('profile.view.label.whoseMarriage')}:</strong> {selectedUser?.person}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(ViewProfile);
