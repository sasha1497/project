import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './viewprofile.css';
import { useGetAllUsersQuery } from '../../../../features/view/viewApi';
import { closeViewPopup, openViewPopup } from "../../../../features/profileui/profileUISlice";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useDeleteUserAccountMutation } from '../../../../features/deleteaccount/deleteAccountApi';


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

const genders = ["Male", "Female", "Transgender"];



const ViewProfile: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);


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
      filter: { ...formValues },
      // search: ""
    });
  };


  // Form inputs
  const [countryInput, setCountryInput] = useState<string>('');
  const [stateInput, setStateInput] = useState<string>('');
  const [districtInput, setDistrictInput] = useState<string>('');
  const [genderInput, setGenderInput] = useState<string>('');

  // Payload state for API query
  const [payload, setPayload] = useState<any>({
    page: 1,
    limit: 100,
    filter: {
      country: '',
      state: '',
      district: districtInput,
      gender: genderInput
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

  const [deleteUserAccount] = useDeleteUserAccountMutation();

  const { data: users = [], isLoading, error } = useGetAllUsersQuery(payload);

  const userId = useSelector((state: any) => state.auth.user?.id);


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users.</div>;

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
      toast.error("User ID not found");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      await deleteUserAccount(userId).unwrap();
      toast.success("Account deleted successfully");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      dispatch(closeViewPopup());
      window.location.href = "/dashboard"; // redirect
    } catch (err: any) {
      toast.error("Failed to delete account");
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
                  You can select your interest <span className='text-danger'>Country</span> for get marraige ?
                </motion.h4>
                <select
                  value={formValues.country}
                  onChange={(e) => setFormValues({ ...formValues, country: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select Country</option>
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
                    Next →
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
                  You can select your interest <span className='text-danger'>State</span> for get marraige ?
                </motion.h4>

                {/* ✅ Dropdown for Indian States */}
                <select
                  value={formValues.state}
                  onChange={(e) => setFormValues({ ...formValues, state: e.target.value })}
                  className="form-control"
                >
                  <option value="">Select State</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                  <option value="Ladakh">Ladakh</option>
                  <option value="Lakshadweep">Lakshadweep</option>
                  <option value="Puducherry">Puducherry</option>
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
                    Back
                  </button>
                  <button
                    disabled={!formValues.state}
                    onClick={handleNextStep}
                    className="btn btn-primary blinking-btn"
                  >
                    Next →
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
                  {/* You can select your interest <span className='text-danger'> District / Territory</span> to get bride or groom? */}
                  You can select your interest <span className='text-danger'> District</span> for get marraige ?
                </motion.h4>
                <input
                  type="text"
                  value={formValues.district}
                  onChange={(e) => setFormValues({ ...formValues, district: e.target.value })}
                  // placeholder="Enter District / Territory"
                  placeholder="Enter District"
                  className="form-control"
                />
                <p
                  className="text-primary mt-2 dont-have-text cursor-pointer"
                  onClick={() => setFormValues({ ...formValues, district: "N/A" })}
                >
                  {/* I don’t have a District / Territory */}
                  I don’t have a District
                </p>
                <div className="d-flex justify-content-between mt-3">
                  <button onClick={handlePrevStep} className="btn btn-outline-secondary">
                    Back
                  </button>
                  <button
                    disabled={!formValues.district}
                    onClick={handleNextStep}
                    className="btn btn-primary blinking-btn"
                  >
                    Next →
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
                  You can select your interest <span className='text-danger'>Gender</span> for get marraige ?
                </motion.h4>
                <label htmlFor="gender" className="form-label fw-bold fs-4 text-primary">
                  Select Now
                </label>
                <select
                  value={formValues.gender}
                  onChange={(e) => setFormValues({ ...formValues, gender: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select Gender</option>
                  {genders.map((g) => (
                    <option key={g} value={g.toLowerCase()}>
                      {g}
                    </option>
                  ))}
                </select>
                <div className="d-flex justify-content-between mt-3">
                  <button onClick={handlePrevStep} className="btn btn-outline-secondary">
                    Back
                  </button>
                  <button
                    disabled={!formValues.gender}
                    onClick={handleSubmitSearch}
                    className="btn btn-success blinking-btn"
                  >
                    Next →
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
                View My Profile
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
                Delete My Account
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
                🔄 Reload
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
                      alt={`Name: ${user.name}`}
                      className="gallery-image"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="gallery-description">Name: {user.name}</div>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="no-users-container">
            <div className="no-users-card">
              <h3>No Users Found</h3>
              <p>We couldn’t find any matching users. Try adjusting your search or filters.</p>
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
                style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }}
              />

              <div className="view-profile-content">
                <p><strong>Name :</strong> {selectedUser?.name}</p>
                <p><strong>Age :</strong> {selectedUser?.age}</p>
                <p><strong>Gender :</strong> {selectedUser?.gender}</p>
                {/* <p><strong>Height:</strong> {selectedUser?.height}</p>
                <p><strong>Weight:</strong> {selectedUser?.weight}</p> */}
                <p><strong>Caste:</strong> {selectedUser?.caste}</p>
                <p><strong>Religion:</strong> {selectedUser?.religion}</p>
                <p><strong>District:</strong> {selectedUser?.district}</p>
                <p><strong>State:</strong> {selectedUser?.state}</p>
                <p><strong>Country:</strong> {selectedUser?.country}</p>
                <p><strong>Mobile:</strong> {selectedUser?.phone_number}</p>
                <p><strong>Whatsapp:</strong> {selectedUser?.whatsapp}</p>
                <p><strong>Job:</strong> {selectedUser?.job}</p>
                <p><strong>Salary:</strong> {selectedUser?.monthlySalary}</p>
                <p><strong>Marriage status:</strong> {selectedUser?.userDetails?.count}</p>
                <p><strong>Whose marriage:</strong> {selectedUser?.person}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(ViewProfile);
