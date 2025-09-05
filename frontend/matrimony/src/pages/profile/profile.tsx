import React from "react";
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

    const userId = useSelector((state:any) => state.auth.user?.id);
    const { data, isLoading, error } = useGetUserProfileQuery(userId);

      const showPopup = useSelector((state: any) => state.profileUi.showViewPopup);


    if (isLoading) return <Loader/>;
   
    
    console.log(data,'data+++');

    return (
        <>  
          {
            showPopup && <ViewProfilePopup/>
          }
          
            <div className="container-fluid">
                 {/* <h2>Welcome, {data?.name}</h2> */}
                {/* <p className="mt-3 profile_text">New Profile Matches</p> */}
                {/* <ProfileImageCarousel /> */}
                <Plan country={data?.country} />
                <UploadProfile />
                <ViewProfile />
            </div>
        </>
    )
}

export default React.memo(Profile);