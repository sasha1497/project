// import React from "react";
// import ProfileImageCarousel from "./components/profileimage/profileimagecarosul";
// import './profile.css';
// import Plan from "./components/plan/plan";
// import UploadProfile from "./components/uploadprofileimage/uploadprofile";
// import ViewProfile from "./components/viewprofile/viewprofile";
// import { useGetUserProfileQuery } from "../../features/profile/profileApi";
// import { skipToken } from '@reduxjs/toolkit/query';
// import { useSelector } from "react-redux";
// import Loader from "../../components/loader/loader";
// import ViewProfilePopup from "./components/popup/Profileview/ViewProfilePopup";


// const Profile = () => {

//   const userId = useSelector((state: any) => state.auth.user?.id);
//   const userIds = useSelector((state: any) => state.form.authUser?.id);

//   const finalUserId = userId || userId?.id;


//   console.log(userIds,'usefecbhdsc');
  

//   const { data, isLoading, error } = useGetUserProfileQuery(finalUserId);

//   const showPopup = useSelector((state: any) => state.profileUi.showViewPopup);


//   if (isLoading) return <Loader />;

  
//   console.log(error, 'data+++');

//   return (
//     <>
//       {
//         showPopup && <ViewProfilePopup />
//       }

//       <div className="container-fluid">
//         {data?.hasPayments ? (
//           data?.imageData.length > 0 ? (
//             <>
//               <ViewProfile />
//             </>
//           ) : <UploadProfile />
//         ) : (
//           <Plan country={data?.country} />
//         )}
//       </div>
//     </>
//   )
// }

// export default React.memo(Profile);

import React, { useEffect, useState } from "react";
import ProfileImageCarousel from "./components/profileimage/profileimagecarosul";
import './profile.css';
import Plan from "./components/plan/plan";
import UploadProfile from "./components/uploadprofileimage/uploadprofile";
import ViewProfile from "./components/viewprofile/viewprofile";
import { useGetUserProfileQuery } from "../../features/profile/profileApi";
import { skipToken } from '@reduxjs/toolkit/query';
import { useSelector } from "react-redux";
import Loader from "../../components/loader/loader";
import ViewProfilePopup from "./components/popup/Profileview/ViewProfilePopup";

const Profile = () => {
  const userId = useSelector((state: any) => state.auth.user?.id);
  const authUserId = useSelector((state: any) => state.form.authUser?.id);

  // Local state to hold the final userId once available
  const [finalUserId, setFinalUserId] = useState<any | null>(null);

  // Show popup state
  const showPopup = useSelector((state: any) => state.profileUi.showViewPopup);

  // Update finalUserId when Redux or localStorage changes
  useEffect(() => {
    if (userId) setFinalUserId(userId);
    else if (authUserId) setFinalUserId(authUserId);
    else {
      // Try to get from localStorage as fallback
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed?.id) setFinalUserId(parsed.id);
        } catch {}
      }
    }
  }, [userId, authUserId]);

  // RTK Query, skip if no userId yet
  const { data, isLoading, error, refetch } = useGetUserProfileQuery(finalUserId ?? skipToken);

  // Retry if 400 error
  useEffect(() => {
    if (error && 'status' in error && error.status === 400) {
       window.location.reload();
    }
  }, [error, refetch]);

  if (isLoading || !finalUserId) return <Loader />;

  return (
    <>
      {showPopup && <ViewProfilePopup />}

      <div className="container-fluid">
        {data?.hasPayments ? (
          data?.imageData.length > 0 ? (
            <ViewProfile />
          ) : (
            <UploadProfile />
          )
        ) : (
          <Plan country={data?.country} />
        )}
      </div>
    </>
  );
};

export default React.memo(Profile);
