import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './viewprofile.css';
import { useGetAllUsersQuery } from '../../../../features/view/viewApi';
import { openViewPopup } from "../../../../features/profileui/profileUISlice";
import { useDispatch } from 'react-redux';


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
  "USA",
  "England",
  "Australia",
  "Canada",
  "New Zealand",
  "Scotland",
  "Netherlands",
  "Switzerland",
  "Ireland",
  "Bahrain",
  "Kuwait",
  "Oman",
  "Qatar",
  "Saudi Arabia",
  "Dubai",
  "Malta",
  "Bermuda",
  "Malaysia",
  "Singapore",
  "Germany",
  "Sharjah",
  "Abhudhabi",
  "Brunei",
  "Mauritius",
  "Philippine",
  "Israel",
  "Sri Lanka",
  "Walves",
  "Finland",
  "Bahamas",
  "Fiji",
  "Solomon Island",
  "Barbados",
  "Saint Lucia",
  "Zambia",
  "Botswana",
  "Egypt",
  "Mexico",
  "Thailand",
  "Colombia",
  "Greece",
  "Ghana",
  "Norway"
];

const genders = ["Male", "Female", "Transgender"];



const ViewProfile: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

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
    search: ""
  });

  // Update payload and trigger API refetch on submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setPayload({
      ...payload,
      page: 1, // reset page on new search
      filter: {
        country: countryInput,
        state: stateInput,
        district: districtInput,
        gender: genderInput
      }
    });
  };

  const dispatch = useDispatch();


  const { data: users = [], isLoading, error } = useGetAllUsersQuery(payload);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users.</div>;
  // if (users.length === 0) {
  //   return (
  //     <div className="no-users-container">
  //       <div className="no-users-card">
  //         <h3>No Users Found</h3>
  //         <p>
  //           We couldn’t find any matching users. Try adjusting your search or
  //           filters.
  //         </p>
  //         <button className="retry-btn" onClick={() => window.location.reload()}>
  //           Retry
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

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


  return (
    <div className="gallery-container">
      {/* <h2 className="gallery-title text-primary ">Image Gallery</h2> */}
      <motion.div
        className="relative bg-primary text-white shadow-lg rounded-xl p-2 text-center max-w-2xl mx-auto mt-6 mb-3
             ring-4 ring-blue-500/70"
        initial={{ opacity: 0, y: -30, scale: 0.9, boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          boxShadow: [
            "0 0 10px rgba(59, 130, 246, 0.5)",
            "0 0 20px rgba(59, 130, 246, 0.8)",
            "0 0 30px rgba(59, 130, 246, 1)",
            "0 0 20px rgba(59, 130, 246, 0.8)",
            "0 0 10px rgba(59, 130, 246, 0.5)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
      >
        <h2 className="text-2xl font-bold text-blue-300 mb-2 drop-shadow-lg">
          ✨📷 Image Gallery 📷✨
        </h2>
        {/* <p className="text-blue-100 text-sm">
    Browse beautiful profiles and find your perfect match
  </p> */}
      </motion.div>




      {/* Search form */}
      <form
        onSubmit={handleSearchSubmit}
        className="custom-search-form"
      >

        {/* Gender Select */}
        <select
          value={genderInput}
          onChange={(e) => setGenderInput(e.target.value)}
          className="custom-input text-primary fw-bold"
          aria-label="Select Gender"
        >
          <option value="">Select Gender</option>
          {genders.map((g) => (
            <option key={g} value={g.toLowerCase()}>
              {g}
            </option>
          ))}
        </select>

        {/* District Input */}
        <input
          type="text"
          placeholder="Enter District"
          value={districtInput}
          onChange={(e) => setDistrictInput(e.target.value)}
          className="custom-input text-primary fw-bold"
        />


        <input
          type="text"
          placeholder="Enter State"
          value={stateInput}
          onChange={(e) => setStateInput(e.target.value)}
          className="custom-input text-primary placeholder-primary fw-bold "
          aria-label="State input"
        />



        <select
          value={countryInput}
          onChange={(e) => setCountryInput(e.target.value)}
          className="custom-input text-primary fw-bold"
          aria-label="Select Country"
        >
          <option value="">You can select your interest country to get Bride / Groom</option>
          {countries.map((c) => (
            <option key={c} value={c.toLowerCase()}>
              {c}
            </option>
          ))}
        </select>

        <button type="submit" className="custom-button">
          🔍 Search
        </button>
      </form>

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
                View Profile
              </button>

              <button
                className="btn btn-danger px-4 py-2 shadow-lg fw-bold"
                style={{
                  borderRadius: '50px',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Delete Account
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
              {/* <button className="retry-btn" onClick={() => window.location.reload()}>
                Retry
              </button> */}
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
                <p><strong>Marriage status:</strong> {selectedUser?.count}</p>
                <p><strong>Whose marriage:</strong> {selectedUser?.person}</p>
              </div>

              {/* <button
                className="nav-arrow prev-arrow"
                onClick={prevImage}
                aria-label="Previous Image"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '10px',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '24px',
                  userSelect: 'none',
                }}
              >
                ‹
              </button>

              <button
                className="nav-arrow next-arrow"
                onClick={nextImage}
                aria-label="Next Image"
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '24px',
                  userSelect: 'none',
                }}
              >
                ›
              </button> */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(ViewProfile);
