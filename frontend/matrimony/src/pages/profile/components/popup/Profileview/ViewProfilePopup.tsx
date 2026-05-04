import React, { useEffect, useMemo, useState } from "react";
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
import { STATE_DISTRICT_MAP } from "../../../../steps/step2";
import { useAppLanguage } from "../../../../../i18n/LanguageContext";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
// import {
//   startEdit,
//   editSuccess,
//   editFailure,
// } from "../../features/editForm/editFormSlice";

const API_BASE_URL = String(process.env.REACT_APP_API_BASE_URL || 'https://usrapi.bajolmatrimony.com').replace(/\/+$/, '');

const ViewProfilePopup = () => {
  const dispatch = useDispatch();
  const showPopup = useSelector((state: RootState) => state.profileUi.showViewPopup);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { t } = useAppLanguage();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [cashfree, setCashfree] = useState<any>(null);
  const [unlockingContact, setUnlockingContact] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

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
    watch,
    setValue,
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
      notes: "",
      count: "",
      person: "",
    },
  });

  const [editForm] = useEditFormMutation();
  const selectedState = watch("state");
  const lockedState = useMemo(() => {
    const rawState = String(data?.state || "").trim();
    if (!rawState) return "";
    const matchedState = Object.keys(STATE_DISTRICT_MAP).find(
      (stateName) => stateName.toLowerCase() === rawState.toLowerCase()
    );
    return matchedState || rawState;
  }, [data?.state]);
  const stateOptions = lockedState ? [lockedState] : selectedState ? [selectedState] : [];
  const districts = useMemo(
    () => (selectedState ? STATE_DISTRICT_MAP[selectedState] || [] : []),
    [selectedState]
  );

  useEffect(() => {
    (async () => {
      const cfInstance = await load({ mode: 'production' });
      setCashfree(cfInstance);
    })();
  }, []);

  // ✅ Prefill form when profile data is fetched
  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  useEffect(() => {
    if (lockedState && selectedState !== lockedState) {
      setValue("state", lockedState, { shouldValidate: true });
    }
  }, [lockedState, selectedState, setValue]);

  useEffect(() => {
    setContactVisible(false);
  }, [showPopup, data?.id]);

  const handleUnlockContact = async () => {
    if (!userId) {
      toast.error('Unable to start payment');
      return;
    }

    if (!cashfree) {
      toast.error('Payment is loading. Please wait a moment.');
      return;
    }

    try {
      setUnlockingContact(true);

      const orderResponse = await axios.post(
        `${API_BASE_URL}/cashfree/create-profile-access-order`,
        {
          viewer_user_id: userId,
          target_user_id: userId,
          order_amount: 1,
          order_currency: 'INR',
          receipt: `profile_popup_${userId}_${Date.now()}`,
          customer_phone: data?.phone_number || '',
          customer_email: data?.email || '',
        }
      );

      const sessionId = orderResponse?.data?.cashfree_order?.payment_session_id;
      const cashfreeOrderId = orderResponse?.data?.cashfree_order?.order_id;

      if (!sessionId || !cashfreeOrderId) {
        throw new Error('Failed to create payment order');
      }

      await cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget: '_modal',
        onSuccess: async () => {
          try {
            await axios.post(
              `${API_BASE_URL}/cashfree/confirm-profile-access-order`,
              { cashfree_order_id: cashfreeOrderId }
            );
            await refetch();
            setContactVisible(true);
            toast.success('Contact unlocked successfully');
          } catch (confirmError) {
            console.error(confirmError);
            toast.error('Payment succeeded but contact unlock failed');
          } finally {
            setUnlockingContact(false);
          }
        },
        onFailure: () => {
          toast.error('Payment failed, please try again');
          setUnlockingContact(false);
        },
        onClose: () => {
          setUnlockingContact(false);
        },
      });
    } catch (paymentError: any) {
      console.error(paymentError);
      toast.error(
        paymentError?.response?.data?.message ||
        paymentError?.message ||
        'Unable to start profile payment'
      );
      setUnlockingContact(false);
    }
  };

  const onSubmit = async (formData: any) => {
    try {
      dispatch(startEdit());

      const { password, confirmPassword, imageData, hasPayments, paymentExpiryInfo, ...cleanedData } = formData;

      await editForm({ id: userId, ...cleanedData }).unwrap();

      dispatch(editSuccess());
      toast.success(t('profile.popup.updateSuccess'));
      refetch();
      setIsEditMode(false);
    } catch (error: any) {
      dispatch(editFailure(error?.data?.message || t('profile.popup.updateFailed')));
      toast.error(error?.data?.message || t('profile.popup.updateError'));
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

        <h4>{isEditMode ? t('profile.popup.editTitle') : t('profile.popup.viewTitle')}</h4>

        {isLoading ? (
          <p>{t('profile.popup.loading')}</p>
        ) : isEditMode ? (
          // ✅ EDIT MODE FORM
          <div className="view-profile-content">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">

              {/* Name */}
              <div className="mb-3">
                <label className="form-label">{t('profile.nameLabel')}</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("name", { required: t('profile.nameLabel') + " is required" })}
                />
                {errors.name && <small className="text-danger">{errors.name.message}</small>}
              </div>

              {/* Age */}
              <div className="mb-3">
                <label className="form-label">{t('profile.ageLabel')}</label>
                <input
                  type="number"
                  className="form-control"
                  {...register("age", { required: t('profile.ageLabel') + " is required" })}
                />
                {errors.age && <small className="text-danger">{errors.age.message}</small>}
              </div>

              {/* Gender */}
              <div className="mb-3">
                <label className="form-label">{t('profile.view.label.gender')}</label>
                <select className="form-select" {...register("gender", { required: t('profile.view.label.gender') + " is required" })}>
                  <option value="">{t('profile.popup.genderPlaceholder')}</option>
                  <option value="male">{t('profile.popup.gender.male')}</option>
                  <option value="female">{t('profile.popup.gender.female')}</option>
                  <option value="other">{t('profile.popup.gender.other')}</option>
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
                <label className="form-label">{t('profile.jobLabel')}</label>
                <input type="text" className="form-control" {...register("job", { required: t('profile.jobLabel') + " is required" })} />
                {errors.job && <small className="text-danger">{errors.job.message}</small>}

              </div>

              {/* Monthly Salary */}
              <div className="mb-3">
                <label className="form-label">{t('profile.monthlySalaryLabel')}</label>
                <input type="text" className="form-control" {...register("monthlySalary", { required: t('profile.monthlySalaryLabel') + " is required" })} />
                {errors.monthlySalary && <small className="text-danger">{errors.monthlySalary.message}</small>}

              </div>

              <div className="mb-3">
                <label className="form-label">{t('profile.notesLabel')}</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder={t('profile.notesPlaceholder')}
                  {...register("notes")}
                />
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
                <label className="form-label">{t('profile.casteLabel')}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t('profile.castePlaceholder')}
                  {...register("caste", { required: t('profile.casteLabel') + " is required" })}
                />
                {errors.caste && <small className="text-danger">{errors.caste.message}</small>}
              </div>

              {/* Religion */}
              <div className="mb-3">
                <label className="form-label">{t('profile.religionLabel')}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t('profile.religionPlaceholder')}
                  {...register("religion", { required: t('profile.religionLabel') + " is required" })}
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
                    <label className="form-label">{t('profile.popup.mobileLabel')}</label>
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
                      placeholder={t('profile.popup.mobilePlaceholder')}
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
                    <label className="form-label">{t('profile.popup.whatsappLabel')}</label>
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
                      placeholder={t('profile.popup.whatsappPlaceholder')}
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
                <label className="form-label">{t('profile.popup.districtLabel')}</label>

                <select
                  className="form-control"
                  {...register("district", { required: t('profile.popup.districtLabel') + " is required" })}
                  disabled={!selectedState}
                >
                  <option value="">
                    {selectedState ? t('profile.popup.districtPlaceholder') : t('profile.popup.stateLocked')}
                  </option>
                  {districts.map((districtName) => (
                    <option key={districtName} value={districtName}>
                      {districtName}
                    </option>
                  ))}
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
                <label htmlFor="state" className="form-label">{t('profile.popup.stateLabel')}</label>

                <select
                  id="state"
                  className="form-select"
                  {...register("state", { required: t('profile.popup.stateLabel') + " is required" })}
                >
                  {!lockedState && <option value="">{t('profile.popup.statePlaceholder')}</option>}
                  {stateOptions.map((stateName) => (
                    <option key={stateName} value={stateName}>
                      {stateName}
                    </option>
                  ))}
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
                <label className="form-label">{t('profile.popup.countryLabel')}</label>
                <select className="form-select" {...register("country", { required: t('profile.popup.countryLabel') + " is required" })}>
                  <option value="">{t('profile.popup.countryPlaceholder')}</option>
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
                <label className="form-label">{t('profile.popup.marriageCountLabel')}</label>
                <select className="form-select" {...register("count", { required: t('profile.popup.marriageCountLabel') + " is required" })}>
                  <option value="">{t('profile.popup.marriageCountPlaceholder')}</option>
                  <option value="first">{t('profile.popup.marriageCount.first')}</option>
                  <option value="second">{t('profile.popup.marriageCount.second')}</option>
                  <option value="third">{t('profile.popup.marriageCount.third')}</option>
                </select>
                {errors.count && <small className="text-danger">{errors.count.message}</small>}
              </div>

              {/* {person} */}
              <div className="mb-3">
                <label className="form-label">{t('profile.popup.marriagePersonLabel')}</label>
                <select className="form-select" {...register("person", { required: t('profile.popup.marriagePersonLabel') + " is required" })}>
                  <option value="">{t('profile.popup.marriagePersonPlaceholder')}</option>
                  <option value="me">{t('profile.popup.marriagePerson.me')}</option>
                  <option value="sister">{t('profile.popup.marriagePerson.sister')}</option>
                  <option value="brother">{t('profile.popup.marriagePerson.brother')}</option>
                  <option value="son">{t('profile.popup.marriagePerson.son')}</option>
                  <option value="daughter">{t('profile.popup.marriagePerson.daughter')}</option>

                </select>
                {errors.person && <small className="text-danger">{errors.person.message}</small>}
              </div>

              {/* Submit + Cancel */}
              <div className="d-flex justify-content-end mt-4 gap-2">

                <button type="submit" className="btn btn-primary px-4" >
                  {t('profile.popup.saveChanges')}
                </button>
                <button type="button" className="btn btn-danger px-4 mt-3 mx-0" onClick={() => dispatch(closeViewPopup())}>
                  {t('profile.popup.cancel')}
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
              <p><strong>{t('profile.view.label.name')} :</strong> {data?.name}</p>
              <p><strong>{t('profile.view.label.age')} :</strong> {data?.age}</p>
              <p><strong>{t('profile.view.label.gender')} :</strong> {data?.gender}</p>
              <p><strong>{t('profile.view.label.caste')}:</strong> {data?.caste}</p>
              <p><strong>{t('profile.view.label.religion')}:</strong> {data?.religion}</p>
              <p><strong>{t('profile.view.label.district')}:</strong> {data?.district}</p>
              <p><strong>{t('profile.view.label.state')}:</strong> {data?.state}</p>
              <p><strong>{t('profile.view.label.country')}:</strong> {data?.country}</p>
              {!contactVisible ? (
                <div className="contact-unlock-card mt-3 mb-3 p-3 border rounded text-center">
                  <p className="mb-3"><strong>Contact details are locked.</strong></p>
                  <button
                    type="button"
                    className="btn btn-warning"
                    disabled={unlockingContact}
                    onClick={handleUnlockContact}
                  >
                    {unlockingContact ? 'Processing...' : 'Pay Now'}
                  </button>
                </div>
              ) : (
                <>
                  <p><strong>{t('profile.view.label.mobile')}:</strong> {data?.phone_number}</p>
                  <p><strong>{t('profile.view.label.whatsapp')}:</strong> {data?.whatsapp}</p>
                </>
              )}
              <p><strong>{t('profile.view.label.job')}:</strong> {data?.job}</p>
              <p><strong>{t('profile.view.label.salary')}:</strong> {data?.monthlySalary}</p>
              <p><strong>{t('profile.notesLabel')}:</strong> {data?.notes || t('profile.view.notAvailable')}</p>
              <p><strong>{t('profile.view.label.marriageStatus')}:</strong> {data?.count}</p>
              <p><strong>{t('profile.view.label.whoseMarriage')}:</strong> {data?.person}</p>
            </div>
            <div className="d-flex justify-content-end mt-3 gap-2">
              <button
                type="button"
                className="btn btn-primary px-4"
                onClick={() => setIsEditMode(true)}
              >
                {t('profile.popup.editProfile')}
              </button>

              <button
                type="button"
                className="btn btn-danger px-4"
                onClick={() => dispatch(closeViewPopup())}
              >
                {t('profile.popup.cancel')}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ViewProfilePopup;
