import React from "react";
import ProfileImageCarousel from "./components/profileimage/profileimagecarosul";
import './profile.css';
import Plan from "./components/plan/plan";
import UploadProfile from "./components/uploadprofileimage/uploadprofile";


const Profile = () => {
    return (
        <>
            <div className="container-fluid">
                <p className="mt-3 profile_text">New Profile Matches</p>
                <ProfileImageCarousel />
                <Plan/>
                <UploadProfile/>
            </div>

        </>
    )
}

export default Profile;