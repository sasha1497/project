import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './viewprofile.css';
import { useGetAllUsersQuery } from '../../../../features/view/viewApi';
import { closeViewPopup, openViewPopup } from "../../../../features/profileui/profileUISlice";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useDeleteUserAccountMutation } from '../../../../features/deleteaccount/deleteAccountApi';
import { STATE_DISTRICT_MAP } from '../../../steps/step2';
import { useAppLanguage } from '../../../../i18n/LanguageContext';
import { RELIGION_OPTIONS } from '../../../../constants/religionOptions';
import { useNavigate } from 'react-router-dom';


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
const JOB_OPTIONS = [
  'Accountant',
  'Business',
  'Doctor',
  'Driver',
  'Engineer',
  'Farmer',
  'Government Job',
  'IT Professional',
  'Lawyer',
  'Nurse',
  'Police',
  'Private Job',
  'Teacher',
];

const clearClientStorage = () => {
  localStorage.clear();
  sessionStorage.clear();

  document.cookie.split(';').forEach((cookie) => {
    const cookieName = cookie.split('=')[0]?.trim();
    if (!cookieName) return;

    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
  });
};



const ViewProfile: React.FC = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const { t } = useAppLanguage();
  const navigate = useNavigate();


  const [step, setStep] = useState<number>(1);


  const [formValues, setFormValues] = useState({
    country: "",
    state: "",
    district: "",
    gender: "",
    religion: "",
    job: ""
  });

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => prev - 1);


  const submitSearch = (nextValues = formValues) => {
    setHasSearched(true);
    setPayload({
      page: 1,
      limit: 1000,
      viewerUserId: userId || null,
      filter: { ...nextValues },
      // search: ""
    });
  };

  const handleSubmitSearch = () => {
    submitSearch();
  };

  const handleNoDistrict = () => {
    setFormValues((prev) => ({
      ...prev,
      district: "N/A",
    }));

    toast.info(t('profile.view.districtSkipped'));
    handleNextStep();
  };

  const handleNoJob = () => {
    const nextValues = {
      ...formValues,
      job: "N/A",
    };

    setFormValues(nextValues);
    toast.info(t('profile.view.jobSkipped'));
    submitSearch(nextValues);
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
      gender: '',
      religion: '',
      job: ''
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

  const { data: users = [], isLoading, isFetching, error } = useGetAllUsersQuery(payload);

  const authUser = useSelector((state: any) => state.auth.user);
  const userId = authUser?.id;

  useEffect(() => {
    if (!userId) return;
    setPayload((prev: any) => ({
      ...prev,
      viewerUserId: userId,
    }));
  }, [userId]);

  if (isLoading) return <div>{t('profile.view.loading')}</div>;
  if (error) return <div>{t('profile.view.errorLoading')}</div>;

  const visibleUsers = users.filter((user: any) => user?.userDetails?.imageData?.[0]);

  const openUserImages = (user: User) => {
    navigate(`/profile/${user.id}`);
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

      clearClientStorage();

      dispatch(closeViewPopup());
      window.location.href = "/dashboard"; // redirect
    } catch (err: any) {
      toast.error(t('profile.view.deleteFailed'));
      console.error(err);
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
                style={{ width: `${(step / 6) * 100}%` }}
                aria-valuenow={(step / 6) * 100}
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
                    onClick={handleNextStep}
                    className="btn btn-primary blinking-btn"
                  >
                    {t('profile.view.next')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Religion */}
            {step === 5 && (
              <div className="mb-3">
                <motion.h4
                  className="form-label fw-bold mb-5 text-primary jump-heading"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {t('profile.religionLabel')}
                </motion.h4>
                <select
                  value={formValues.religion}
                  onChange={(e) => setFormValues({ ...formValues, religion: e.target.value })}
                  className="form-select"
                >
                  <option value="">{t('profile.religionPlaceholder')}</option>
                  {RELIGION_OPTIONS.map((religion) => (
                    <option key={religion} value={religion}>
                      {religion}
                    </option>
                  ))}
                </select>
                <div className="d-flex justify-content-between mt-3">
                  <button onClick={handlePrevStep} className="btn btn-outline-secondary">
                    {t('profile.view.back')}
                  </button>
                  <button
                    disabled={!formValues.religion}
                    onClick={handleNextStep}
                    className="btn btn-primary blinking-btn"
                  >
                    {t('profile.view.next')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 6: Job */}
            {step === 6 && (
              <div className="mb-3">
                <motion.h4
                  className="form-label fw-bold mb-5 text-primary jump-heading"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {t('profile.view.step5Title')}
                </motion.h4>
                <input
                  type="search"
                  list="job-options"
                  value={formValues.job}
                  onChange={(e) => setFormValues({ ...formValues, job: e.target.value })}
                  className="form-control"
                  placeholder={t('profile.view.selectJob')}
                />
                <datalist id="job-options">
                  {JOB_OPTIONS.map((jobName) => (
                    <option key={jobName} value={jobName} />
                  ))}
                </datalist>
                <p
                  className="text-primary mt-2 dont-have-text cursor-pointer"
                  onClick={handleNoJob}
                >
                  {t('profile.view.noJob')}
                </p>
                <div className="d-flex justify-content-between mt-3">
                  <button onClick={handlePrevStep} className="btn btn-outline-secondary">
                    {t('profile.view.back')}
                  </button>
                  <button
                    disabled={!formValues.job}
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

      {hasSearched && (
        <div className="profile-count-card">
          {isFetching
            ? t('profile.view.searchingProfiles')
            : `${t('profile.view.foundProfiles')}: ${visibleUsers.length}`}
        </div>
      )}

      <>
        {visibleUsers.length > 0 ? (
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
              {visibleUsers.map((user: any) => {
                const firstImage = user?.userDetails?.imageData?.[0];

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
    </div>
  );
};

export default React.memo(ViewProfile);
