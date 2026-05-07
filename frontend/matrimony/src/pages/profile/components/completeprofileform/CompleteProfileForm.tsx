import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEditFormMutation } from "../../../../features/editform/editFormApi";
import { useAppLanguage } from "../../../../i18n/LanguageContext";
import Step1 from "../../../steps/step1";
import Step2 from "../../../steps/step2";
import Step3 from "../../../steps/step3";
import Step4 from "../../../steps/step4";
import Step5 from "../../../steps/step5";
import Step6 from "../../../steps/step6";
import Step8 from "../../../steps/step8";
import { STATE_DISTRICT_MAP } from "../../../steps/step2";
import './CompleteProfile.css';

type CompleteProfileFormProps = {
  userId: number;
  initialData?: any;
  onCompleted: () => void;
};

const getRegisteredMobile = () => {
  try {
    const storedUser = localStorage.getItem("authUser");
    if (!storedUser) return "";

    const parsedUser = JSON.parse(storedUser);
    return parsedUser?.phone_number || parsedUser?.mobile || parsedUser?.mobileNumber || "";
  } catch {
    return "";
  }
};

const CompleteProfileForm: React.FC<CompleteProfileFormProps> = ({
  userId,
  initialData,
  onCompleted,
}) => {
  const [editForm, { isLoading }] = useEditFormMutation();
  const { t } = useAppLanguage();
  const registeredMobile = useMemo(() => getRegisteredMobile(), []);
  const initialState = useMemo(
    () =>
      Object.keys(STATE_DISTRICT_MAP).find(
        (stateName) =>
          stateName.toLowerCase() === String(initialData?.state || "").trim().toLowerCase()
      ) || "",
    [initialData?.state],
  );

  const defaultValues = useMemo(
    () => ({
      name: initialData?.name || "",
      age: initialData?.age || "",
      job: initialData?.job || "",
      monthlySalary: initialData?.monthlySalary || "",
      country: initialData?.country || "India",
      state: initialState || initialData?.state || "",
      district: initialData?.district || "",
      mobile: initialData?.phone_number || initialData?.mobile || registeredMobile,
      whatsapp: initialData?.whatsapp || "",
      caste: initialData?.caste || "",
      religion: initialData?.religion || "",
      gender: initialData?.gender || "",
      count: initialData?.count || "",
      person: initialData?.person || "",
    }),
    [initialData, initialState, registeredMobile],
  );

  const methods = useForm<any>({
    defaultValues,
    mode: "onTouched",
  });

  const onSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        phone_number: defaultValues.mobile,
      };
      delete payload.mobile;

      await editForm({ id: userId, ...payload }).unwrap();
      toast.success("Profile details saved. Now upload your photo.");
      onCompleted();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save profile details");
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "680px" }}>
        <div className="card-body">
          <h4 className="text-center mb-2">{t('profile.completeTitle')}</h4>
          <p className="text-center text-muted mb-4">{t('profile.completeSubtitle')}</p>

          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Step1 methods={methods} />
            <Step2 methods={methods} />
            <Step3 methods={methods} mobileReadOnly />
            <Step4 methods={methods} />
            <Step5 methods={methods} />
            <Step6 methods={methods} />
            {/* <Step7 methods={methods} /> */}
            <Step8 methods={methods} />

            <div className="d-flex justify-content-end mt-4 blinking-btn">
              <button type="submit" className="btn btn-success" disabled={isLoading}>
                {isLoading ? t('profile.saving') : t('profile.saveContinue')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CompleteProfileForm);
