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
import './profile.css';
import UploadProfile from "./components/uploadprofileimage/uploadprofile";
import ViewProfile from "./components/viewprofile/viewprofile";
import { useGetUserProfileQuery } from "../../features/profile/profileApi";
import { skipToken } from '@reduxjs/toolkit/query';
import { useSelector } from "react-redux";
import Loader from "../../components/loader/loader";
import ViewProfilePopup from "./components/popup/Profileview/ViewProfilePopup";
import CompleteProfileForm from "./components/completeprofileform/CompleteProfileForm";

const hasRequiredProfileData = (data: any) => {
  if (!data) return false;
  const requiredFields = [
    "name",
    "age",
    "job",
    "monthlySalary",
    "country",
    "state",
    "district",
    "phone_number",
    "whatsapp",
    "caste",
    "religion",
    "gender",
    "count",
    "person",
    "height",
    "weight",
  ];

  return requiredFields.every((field) => {
    const value = data?.[field];
    return value !== undefined && value !== null && String(value).trim() !== "";
  });
};

const Profile = () => {
  const userId = useSelector((state: any) => state.auth.user?.id);
  const authUserId = useSelector((state: any) => state.form.authUser?.id);

  // Local state to hold the final userId once available
  const [finalUserId, setFinalUserId] = useState<any | null>(null);
  const [profileFormCompleted, setProfileFormCompleted] = useState(false);

  // Show popup state
  const showPopup = useSelector((state: any) => state.profileUi.showViewPopup);
  const uploadedProfileImage = localStorage.getItem('profileImageUploaded') === 'true';

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
  const { data, isLoading, refetch } = useGetUserProfileQuery(finalUserId ?? skipToken);

  if (isLoading || !finalUserId) return <Loader />;

  const hasImages = uploadedProfileImage || (data?.imageData?.length || 0) > 0;
  const shouldShowProfileForm =
    !profileFormCompleted &&
    !hasRequiredProfileData(data);

  if (uploadedProfileImage && (data?.imageData?.length || 0) > 0) {
    localStorage.removeItem('profileImageUploaded');
  }

  return (
    <>
      {showPopup && <ViewProfilePopup />}

      <div className="container-fluid">
        {hasImages ? (
          <ViewProfile />
        ) : shouldShowProfileForm ? (
          <CompleteProfileForm
            userId={Number(finalUserId)}
            initialData={data}
            onCompleted={async () => {
              setProfileFormCompleted(true);
              await refetch();
            }}
          />
        ) : (
          <UploadProfile userId={finalUserId} />
        )}
      </div>
    </>
  );
};

export default React.memo(Profile);
