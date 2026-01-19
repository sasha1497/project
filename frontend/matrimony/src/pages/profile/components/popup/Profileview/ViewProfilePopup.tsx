import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { useGetUserProfileQuery } from "../../../../../features/profile/profileApi";
import { closeViewPopup } from "../../../../../features/profileui/profileUISlice";
import { RootState } from "../../../../../app/store";
import "./ViewProfilePopup.css";
import { editFailure, editSuccess, startEdit } from "../../../../../features/editform/editFormSlice";
import { toast } from "react-toastify";
import { useEditFormMutation } from "../../../../../features/editform/editFormApi";
import PhoneInput from "react-phone-input-2";
// import {
//   startEdit,
//   editSuccess,
//   editFailure,
// } from "../../features/editForm/editFormSlice";

const ViewProfilePopup = () => {
  const dispatch = useDispatch();
  const showPopup = useSelector((state: RootState) => state.profileUi.showViewPopup);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // ✅ Fetch user profile
  const { data, isLoading, refetch } = useGetUserProfileQuery(userId, {
    skip: !userId,
    refetchOnMountOrArgChange: false,
  });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      age: "",
      gender: "",
      height: "",
      weight: "",
      caste: "",
      religion: "",
      district: "",
      state: "",
      country: "",
      phone_number: "",
      whatsapp: "",
      job: "",
      monthlySalary: "",
      count: "",
      person: "",
    },
  });

  const [editForm] = useEditFormMutation();


  // ✅ Prefill form when profile data is fetched
  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const onSubmit = async (formData: any) => {
    try {
      dispatch(startEdit());

      const { password, confirmPassword, imageData, hasPayments, paymentExpiryInfo, ...cleanedData } = formData;

      await editForm({ id: userId, ...cleanedData }).unwrap();

      dispatch(editSuccess());
      toast.success("Profile updated successfully!");
      refetch();
      setIsEditMode(false);
    } catch (error: any) {
      dispatch(editFailure(error?.data?.message || "Failed to update profile"));
      toast.error(error?.data?.message || "Update failed!");
      console.error("Update failed:", error);
    }
  };


  if (!showPopup) return null;

  return (
    <motion.div className="popup-overlay mt-5" onClick={() => dispatch(closeViewPopup())}>
      <motion.div
        className="popup-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Close Icon */}
        <div className="close-icon" onClick={() => dispatch(closeViewPopup())}>
          ×
        </div>

        <h4>{isEditMode ? "Edit Profile" : "View Profile"}</h4>

        {isLoading ? (
          <p>Loading...</p>
        ) : isEditMode ? (
          // ✅ EDIT MODE FORM
          <div className="view-profile-content">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">

              {/* Name */}
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <small className="text-danger">{errors.name.message}</small>}
              </div>

              {/* Age */}
              <div className="mb-3">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  {...register("age", { required: "Age is required" })}
                />
                {errors.age && <small className="text-danger">{errors.age.message}</small>}
              </div>

              {/* Gender */}
              <div className="mb-3">
                <label className="form-label">Gender</label>
                <select className="form-select" {...register("gender", { required: "Gender is required" })}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <small className="text-danger">{errors.gender.message}</small>}
              </div>

              {/* Height */}
              {/* <div className="mb-3">
                <label className="form-label">Height (cm)</label>
                <input type="text" className="form-control" {...register("height",  { required: "height is required" })} />
                {errors.height && <small className="text-danger">{errors.height.message}</small>}

              </div> */}

              {/* Weight */}
              {/* <div className="mb-3">
                <label className="form-label">Weight (kg)</label>
                <input type="text" className="form-control" {...register("weight", {required: "weight is required" })} />
                {errors.weight && <small className="text-danger">{errors.weight.message}</small>}

              </div> */}

              {/* Job */}
              <div className="mb-3">
                <label className="form-label">Job</label>
                <input type="text" className="form-control" {...register("job", { required: "job is required" })} />
                {errors.job && <small className="text-danger">{errors.job.message}</small>}

              </div>

              {/* Monthly Salary */}
              <div className="mb-3">
                <label className="form-label">Monthly Salary</label>
                <input type="text" className="form-control" {...register("monthlySalary", { required: "monthlySalary is required" })} />
                {errors.monthlySalary && <small className="text-danger">{errors.monthlySalary.message}</small>}

              </div>

              {/* {caste} */}
              {/* <div className="mb-3">
                <label className="form-label">Caste</label>
                <select className="form-select" {...register("caste", { required: "caste is required" })}>
                  <option value="">Select Caste</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="No Caste">No Caste</option>
                </select>
                {errors.caste && <small className="text-danger">{errors.caste.message}</small>}
              </div> */}

              {/* Religion */}
              {/* <div className="mb-3">
                <label className="form-label">Religion</label>
                <select className="form-select" {...register("religion", { required: "religion is required" })}>
                  <option value="">Select Religion</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Other">Other</option>
                  <option value="No Religion">No Religion</option>
                </select>
                {errors.religion && <small className="text-danger">{errors.religion.message}</small>}
              </div> */}
              {/* Caste */}
              <div className="mb-3">
                <label className="form-label">Caste</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your caste"
                  {...register("caste", { required: "Caste is required" })}
                />
                {errors.caste && <small className="text-danger">{errors.caste.message}</small>}
              </div>

              {/* Religion */}
              <div className="mb-3">
                <label className="form-label">Religion</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your religion"
                  {...register("religion", { required: "Religion is required" })}
                />
                {errors.religion && <small className="text-danger">{errors.religion.message}</small>}
              </div>


              {/* Mobile */}
              {/* <div className="mb-3">
                <label className="form-label">Mobile</label>
                <input
                  type="tel"
                  className="form-control"
                  {...register("phone_number", {
                    required: "Mobile number is required",
                    pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
                  })}
                />
                {errors.phone_number && <small className="text-danger">{errors.phone_number.message}</small>}
              </div> */}


              {/* <Controller
                name="phone_number"
                control={control}
                rules={{ required: "Mobile number is required" }}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    country="in"
                    enableSearch
                    inputClass="form-control"
                    onChange={(value) => field.onChange("+" + value)}
                  />
                )}
              /> */}

              {/* {WA} */}
              {/* <div className="mb-3">
                <label className="form-label">Whatsapp Number</label>
                <input
                  type="tel"
                  className="form-control"
                  {...register("whatsapp", {
                    required: "whatsapp number is required",
                    pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
                  })}
                />
                {errors.whatsapp && <small className="text-danger">{errors.whatsapp.message}</small>}
              </div> */}
              {/* <Controller
                name="whatsapp"
                control={control}
                rules={{ required: "whatsapp number is required" }}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    country="in"
                    enableSearch
                    inputClass="form-control"
                    onChange={(value) => field.onChange("+" + value)}
                  />
                )}
              /> */}


              {/* <Controller
                name="phone_number"
                control={control}
                rules={{
                  required: "Mobile number is required",
                  validate: (value) => {
                    // Remove any non-digit characters for validation
                    const digitsOnly = value.replace(/\D/g, "");
                    if (digitsOnly.length < 10) return "Enter a valid 10-digit number";
                    return true;
                  },
                }}
                render={({ field }) => (
                  <div className="mb-3">
                    <label className="form-label">Mobile</label>
                    <PhoneInput
                      {...field}
                      country="in"
                      enableSearch
                      inputClass="form-control phone-input"
                      containerClass="phone-input-container"
                      inputStyle={{ width: "100%", height: "45px" }}
                      onChange={(value) => field.onChange("+" + value)}
                      placeholder="Enter mobile number"
                    />
                    {errors.phone_number && (
                      <small className="text-danger">{errors.phone_number.message}</small>
                    )}
                  </div>
                )}
              />

              <Controller
                name="whatsapp"
                control={control}
                rules={{
                  required: "Whatsapp number is required",
                  validate: (value) => {
                    const digitsOnly = value.replace(/\D/g, "");
                    if (digitsOnly.length < 10) return "Enter a valid 10-digit number";
                    return true;
                  },
                }}
                render={({ field }) => (
                  <div className="mb-3">
                    <label className="form-label">Whatsapp Number</label>
                    <PhoneInput
                      {...field}
                      country="in"
                      enableSearch
                      inputClass="form-control phone-input"
                      containerClass="phone-input-container"
                      inputStyle={{ width: "100%", height: "45px" }}
                      onChange={(value) => field.onChange("+" + value)}
                      placeholder="Enter whatsapp number"
                    />
                    {errors.whatsapp && (
                      <small className="text-danger">{errors.whatsapp.message}</small>
                    )}
                  </div>
                )}
              /> */}

              <Controller
                name="phone_number"
                control={control}
                rules={{
                  required: "Mobile number is required", // only empty check
                }}
                render={({ field }) => (
                  <div className="mb-3">
                    <label className="form-label">Mobile</label>
                    <PhoneInput
                      {...field}
                      country="in"
                      // enableSearch
                      onlyCountries={['in']}        // ✅ restrict to India only
                      disableDropdown={true}        // ✅ hide country dropdown
                      countryCodeEditable={false}
                      inputClass="form-control phone-input"
                      containerClass="phone-input-container"
                      inputStyle={{ width: "100%", height: "45px" }}
                      onChange={(value) => field.onChange(value ? "+" + value : "")} // add + prefix
                      placeholder="Enter mobile number"
                      inputProps={{
                        name: field.name,
                        required: true,
                      }}
                    />
                    {errors.phone_number && (
                      <small className="text-danger">{errors.phone_number.message}</small>
                    )}
                  </div>
                )}
              />

              <Controller
                name="whatsapp"
                control={control}
                rules={{
                  required: "Whatsapp number is required", // only empty check
                }}
                render={({ field }) => (
                  <div className="mb-3">
                    <label className="form-label">Whatsapp Number</label>
                    <PhoneInput
                      {...field}
                      country="in"
                      // enableSearch
                      onlyCountries={['in']}        // ✅ restrict to India only
                      disableDropdown={true}        // ✅ hide country dropdown
                      countryCodeEditable={false}
                      inputClass="form-control phone-input"
                      containerClass="phone-input-container"
                      inputStyle={{ width: "100%", height: "45px" }}
                      onChange={(value) => field.onChange(value ? "+" + value : "")}
                      placeholder="Enter whatsapp number"
                      inputProps={{
                        name: field.name,
                        required: true,
                      }}
                    />
                    {errors.whatsapp && (
                      <small className="text-danger">{errors.whatsapp.message}</small>
                    )}
                  </div>
                )}
              />





              {/* {district} */}
              {/* <div className="mb-3">
                <label className="form-label">District</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("district", { required: "district is required" })}
                />
                {errors.district && <small className="text-danger">{errors.district.message}</small>}
              </div> */}
              <div className="mb-3">
                <label className="form-label">District</label>

                <select
                  className="form-control"
                  {...register("district", { required: "District is required" })}
                >
                  <option value="">Select District</option>
                  <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                  <option value="Kollam">Kollam</option>
                  <option value="Pathanamthitta">Pathanamthitta</option>
                  <option value="Alappuzha">Alappuzha</option>
                  <option value="Kottayam">Kottayam</option>
                  <option value="Idukki">Idukki</option>
                  <option value="Ernakulam">Ernakulam</option>
                  <option value="Thrissur">Thrissur</option>
                  <option value="Palakkad">Palakkad</option>
                  <option value="Malappuram">Malappuram</option>
                  <option value="Kozhikode">Kozhikode</option>
                  <option value="Wayanad">Wayanad</option>
                  <option value="Kannur">Kannur</option>
                  <option value="Kasaragod">Kasaragod</option>
                </select>

                {errors.district && (
                  <small className="text-danger">
                    {errors.district.message}
                  </small>
                )}
              </div>


              {/* State */}
              {/* <div className="mb-3">
                <label className="form-label">State</label>
                <input type="text" className="form-control" {...register("state", { required: "state is required" })} />
                {errors.state && <small className="text-danger">{errors.state.message}</small>}
              </div> */}
              <div className="mb-3">
                <label htmlFor="state" className="form-label">State</label>

                <select
                  id="state"
                  className="form-select"
                  {...register("state", { required: "State is required" })}
                >
                  <option value="">-- Select State --</option>
                  <option value="Kerala">Kerala</option>
                  {/* <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
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
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Dadra and Nagar Haveli and Daman and Diu">
                    Dadra and Nagar Haveli and Daman and Diu
                  </option>
                  <option value="Delhi">Delhi</option>
                  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                  <option value="Ladakh">Ladakh</option>
                  <option value="Lakshadweep">Lakshadweep</option>
                  <option value="Puducherry">Puducherry</option> */}
                </select>

                {errors.state && (
                  <small className="text-danger">{errors.state.message}</small>
                )}
              </div>



              {/* Country */}
              <div className="mb-3">
                <label className="form-label">Country</label>
                <select className="form-select" {...register("country", { required: "country is required" })}>
                  <option value="">You can select your interest country to get Bride / Groom </option>
                  <option value="India">India</option>
                  {/* <option value="USA">USA</option>
                  <option value="England">England</option>
                  <option value="Australia">Australia</option>
                  <option value="Canada">Canada</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Scotland">Scotland</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Ireland">Ireland</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Oman">Oman</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Malta">Malta</option>
                  <option value="Bermuda">Bermuda</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Germany">Germany</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Sharjah">Sharjah</option>
                  <option value="Abhudhabi">Abhu Dhabi</option>
                  <option value="Brunei">Brunei</option>
                  <option value="Mauritius">Mauritius</option>
                  <option value="Philippine">Philippine</option>
                  <option value="Israel">Israel</option>
                  <option value="srilanka">Sri Lanka</option>
                  <option value="wales">wales</option>
                  <option value="Finland">Finland</option>
                  <option value="Bahamas">Bahamas</option>
                  <option value="Fiji">Fiji</option>
                  <option value="Solomonisland">Solomon Island</option>
                  <option value="Barbados">Barbados</option>
                  <option value="Saintlucia">Saint Lucia</option>
                  <option value="Zambia">Zambia</option>
                  <option value="Botswana">Botswana</option>
                  <option value="Egypt">Egypt</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Greece">Greece</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Norway">Norway</option> */}
                </select>
                {errors.country && <small className="text-danger">{errors.country.message}</small>}
              </div>

              {/* {count} */}
              <div className="mb-3">
                <label className="form-label">which Marraige this for you ?</label>
                <select className="form-select" {...register("count", { required: "count is required" })}>
                  <option value="">Select number of marraige</option>
                  <option value="first">First</option>
                  <option value="second">Second</option>
                  <option value="third">Third</option>
                </select>
                {errors.count && <small className="text-danger">{errors.count.message}</small>}
              </div>

              {/* {person} */}
              <div className="mb-3">
                <label className="form-label">Who are you going to marry ?</label>
                <select className="form-select" {...register("person", { required: "person is required" })}>
                  <option value="">Select your person</option>
                  <option value="me">me</option>
                  <option value="sister">sister</option>
                  <option value="brother">brother</option>
                  <option value="son">son</option>
                  <option value="daughter">daughter</option>

                </select>
                {errors.person && <small className="text-danger">{errors.person.message}</small>}
              </div>

              {/* Submit + Cancel */}
              <div className="d-flex justify-content-end mt-4 gap-2">

                <button type="submit" className="btn btn-primary px-4" >
                  Save Changes
                </button>
                <button type="button" className="btn btn-danger px-4 mt-3 mx-0" onClick={() => dispatch(closeViewPopup())}>
                  Cancel
                </button>
                {/* <button type="button" className="btn btn-danger px-4 mt-3 mx-0" onClick={() => dispatch(closeViewPopup())}>
                  delete account
                </button> */}
              </div>
              {/* <div className="d-flex flex-column flex-md-row justify-content-end gap-2 mt-4">
                <button type="submit" className="btn btn-primary px-4 mb-2 mb-md-0">
                  Save Changes
                </button>

                <button
                  type="button"
                  className="btn btn-danger px-4 mb-2 mb-md-0"
                  onClick={() => dispatch(closeViewPopup())}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-danger px-4 mb-2 mb-md-0"
                  onClick={() => dispatch(closeViewPopup())}
                >
                  Delete Account
                </button>
              </div> */}
            </form>
          </div>
        ) : (
          // ✅ VIEW MODE CONTENT
          <>
            <div className="view-profile-content">
              <p><strong>Name :</strong> {data?.name}</p>
              <p><strong>Age :</strong> {data?.age}</p>
              <p><strong>Gender :</strong> {data?.gender}</p>
              <p><strong>Caste:</strong> {data?.caste}</p>
              <p><strong>Religion:</strong> {data?.religion}</p>
              <p><strong>District:</strong> {data?.district}</p>
              <p><strong>State:</strong> {data?.state}</p>
              <p><strong>Country:</strong> {data?.country}</p>
              <p><strong>Mobile:</strong> {data?.phone_number}</p>
              <p><strong>Whatsapp:</strong> {data?.whatsapp}</p>
              <p><strong>Job:</strong> {data?.job}</p>
              <p><strong>Salary:</strong> {data?.monthlySalary}</p>
              <p><strong>Marriage status:</strong> {data?.count}</p>
              <p><strong>Whose marriage:</strong> {data?.person}</p>
            </div>
            <div className="d-flex justify-content-end mt-3 gap-2">
              <button
                type="button"
                className="btn btn-primary px-4"
                onClick={() => setIsEditMode(true)}
              >
                Edit Profile
              </button>

              <button
                type="button"
                className="btn btn-danger px-4"
                onClick={() => dispatch(closeViewPopup())}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ViewProfilePopup;
