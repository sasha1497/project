// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import './viewprofile.css';
// import { useGetAllUsersQuery } from '../../../../features/view/viewApi';

// type ImageData = {
//   name: string;
//   url: string;
//   date: string;
// };

// type UserDetails = {
//   imageData: ImageData[];
// };

// type User = {
//   id: number;
//   name: string;
//   userDetails: UserDetails;
// };

// const ViewProfile: React.FC = () => {
//   const [selectedUser, setSelectedUser] = useState<any | null>(null);
//   const [currentIndex, setCurrentIndex] = useState<number>(0);

//   const payload: any = {
//     page: 1,
//     limit: 10,
//     filter: {
//       country: ''
//     },
//     search: ""
//   };

//   const { data: users = [], isLoading, error } = useGetAllUsersQuery(payload);

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading users.</div>;
//   if (users.length === 0) return <div>No users found.</div>;

//   // Handler for opening popup and resetting index
//   const openUserImages = (user: User) => {
//     setSelectedUser(user);
//     setCurrentIndex(0);
//   };

//   // Next image with wrap-around
//   const nextImage = () => {
//     if (!selectedUser) return;
//     setCurrentIndex((prevIndex) =>
//       prevIndex === selectedUser.userDetails.imageData.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   // Previous image with wrap-around
//   const prevImage = () => {
//     if (!selectedUser) return;
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? selectedUser.userDetails.imageData.length - 1 : prevIndex - 1
//     );
//   };

//   return (
//     <div className="gallery-container">
//       <h2 className="gallery-title">Image Gallery</h2>

//       <div className="gallery-grid">
//         {users.map((user: any) => {
//           const firstImage = user?.userDetails?.imageData?.[0];
//           if (!firstImage) return null;

//           return (
//             <motion.div
//               key={user.id}
//               className="gallery-card"
//               whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}
//               onClick={() => openUserImages(user)}
//             >
//               <motion.img
//                 src={firstImage.url}
//                 alt={`Name: ${user.name}`}
//                 className="gallery-image"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               />
//               <div className="gallery-description">Name: {user.name}</div>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* Popup for selected user images */}
//       <AnimatePresence>
//         {selectedUser && (
//           <motion.div
//             className="popup-overlay"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setSelectedUser(null)}
//           >
//             <motion.div
//               className="popup-content"
//               initial={{ scale: 0.8 }}
//               animate={{ scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
//               exit={{ scale: 0.8 }}
//               onClick={(e) => e.stopPropagation()}
//               style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
//             >
//               <div className="close-icon" onClick={() => setSelectedUser(null)}>
//                 &times;
//               </div>

//               {/* Display current image */}
//               <img
//                 src={selectedUser.userDetails.imageData[currentIndex].url}
//                 alt={selectedUser.userDetails.imageData[currentIndex].name}
//                 className="popup-image"
//                 style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }}
//               />
             

//               <div className="view-profile-content">
//                 <p><strong>Name :</strong> {selectedUser?.name}</p>
//                 <p><strong>Age :</strong> {selectedUser?.age}</p>
//                 <p><strong>Gender :</strong> {selectedUser?.gender}</p>
//                 <p><strong>Height:</strong> {selectedUser?.height}</p>
//                 <p><strong>Weight:</strong> {selectedUser?.weight}</p>
//                 <p><strong>Caste:</strong> {selectedUser?.caste}</p>
//                 <p><strong>Religion:</strong> {selectedUser?.religion}</p>
//                 <p><strong>District:</strong> {selectedUser?.district}</p>
//                 <p><strong>State:</strong> {selectedUser?.state}</p>
//                 <p><strong>Country:</strong> {selectedUser?.country}</p>
//                 <p><strong>Mobile:</strong> {selectedUser?.phone_number}</p>
//                 <p><strong>Whatsapp:</strong> {selectedUser?.whatsapp}</p>
//                 <p><strong>Job:</strong> {selectedUser?.job}</p>
//                 <p><strong>Salary:</strong> {selectedUser?.monthlySalary}</p>
//                 <p><strong>Marriage status:</strong> {selectedUser?.count}</p>
//                 <p><strong>Whose marriage:</strong> {selectedUser?.person}</p>
//               </div>



//               {/* Navigation arrows */}
//               <button
//                 className="nav-arrow prev-arrow"
//                 onClick={prevImage}
//                 aria-label="Previous Image"
//                 style={{
//                   position: 'absolute',
//                   top: '50%',
//                   left: '10px',
//                   transform: 'translateY(-50%)',
//                   background: 'rgba(0,0,0,0.5)',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '50%',
//                   width: '40px',
//                   height: '40px',
//                   cursor: 'pointer',
//                   fontSize: '24px',
//                   userSelect: 'none',
//                 }}
//               >
//                 ‹
//               </button>

//               <button
//                 className="nav-arrow next-arrow"
//                 onClick={nextImage}
//                 aria-label="Next Image"
//                 style={{
//                   position: 'absolute',
//                   top: '50%',
//                   right: '10px',
//                   transform: 'translateY(-50%)',
//                   background: 'rgba(0,0,0,0.5)',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '50%',
//                   width: '40px',
//                   height: '40px',
//                   cursor: 'pointer',
//                   fontSize: '24px',
//                   userSelect: 'none',
//                 }}
//               >
//                 ›
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default React.memo(ViewProfile);

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './viewprofile.css';
import { useGetAllUsersQuery } from '../../../../features/view/viewApi';

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


const ViewProfile: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Form inputs
  const [countryInput, setCountryInput] = useState<string>('');
  const [stateInput, setStateInput] = useState<string>('');

  // Payload state for API query
  const [payload, setPayload] = useState<any>({
    page: 1,
    limit: 10,
    filter: {
      country: '',
      state: ''
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
        state: stateInput
      }
    });
  };

  const { data: users = [], isLoading, error } = useGetAllUsersQuery(payload);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users.</div>;
  if (users.length === 0) return <div>No users found.</div>;

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
      <h2 className="gallery-title">Image Gallery</h2>

      {/* Search form */}
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <select
          value={countryInput}
          onChange={(e) => setCountryInput(e.target.value)}
          style={{ padding: '8px', fontSize: '14px', minWidth: '350px' }}
          aria-label="Select Country"
        >
          <option value="">You can select your interest country to get Bride / Groom</option>
          {countries.map((c) => (
            <option key={c} value={c.toLowerCase()}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Enter State"
          value={stateInput}
          onChange={(e) => setStateInput(e.target.value)}
          style={{ padding: '8px', fontSize: '14px', minWidth: '350px' }}
          aria-label="State input"
        />

        <button
          type="submit"
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            display: 'inline-block'
          }}
        >
          Search
        </button>
      </form>

      <div className="gallery-grid">
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

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="popup-overlay"
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
                <p><strong>Height:</strong> {selectedUser?.height}</p>
                <p><strong>Weight:</strong> {selectedUser?.weight}</p>
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

              <button
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
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(ViewProfile);
