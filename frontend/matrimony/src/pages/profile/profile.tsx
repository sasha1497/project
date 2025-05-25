import React from "react";
import ProfileImageCarousel from "./components/profileimage/profileimagecarosul";
import './profile.css';
import Plan from "./components/plan/plan";


const Profile = () => {
    return (
        <>
            <div className="container-fluid">
                <p className="mt-3 profile_text">New Profile Matches</p>
                <ProfileImageCarousel />
                <Plan/>
                
            </div>

        </>
    )
}

export default Profile;