import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEditFormMutation } from "../../../../features/editform/editFormApi";
import Step1 from "../../../steps/step1";
import Step2 from "../../../steps/step2";
import Step3 from "../../../steps/step3";
import Step4 from "../../../steps/step4";
import Step5 from "../../../steps/step5";
import Step6 from "../../../steps/step6";
import Step7 from "../../../steps/step7";
import Step8 from "../../../steps/step8";
import './CompleteProfile.css';

type CompleteProfileFormProps = {
  userId: number;
  initialData?: any;
  onCompleted: () => void;
};

const CompleteProfileForm: React.FC<CompleteProfileFormProps> = ({
  userId,
  initialData,
  onCompleted,
}) => {
  const [editForm, { isLoading }] = useEditFormMutation();

  const defaultValues = useMemo(
    () => ({
      name: initialData?.name || "",
      age: initialData?.age || "",
      job: initialData?.job || "",
      monthlySalary: initialData?.monthlySalary || "",
      country: initialData?.country || "India",
      state: initialData?.state || "",
      district: initialData?.district || "",
      mobile: initialData?.phone_number || initialData?.mobile || "",
      whatsapp: initialData?.whatsapp || "",
      caste: initialData?.caste || "",
      religion: initialData?.religion || "",
      gender: initialData?.gender || "",
      count: initialData?.count || "",
      person: initialData?.person || "",
    }),
    [initialData],
  );

  const methods = useForm<any>({
    defaultValues,
    mode: "onTouched",
  });

  const onSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        phone_number: values.mobile,
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
          <h4 className="text-center mb-2">Complete Your Profile</h4>
          <p className="text-center text-muted mb-4">Fill all details in one form</p>

          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Step1 methods={methods} />
            <Step2 methods={methods} />
            <Step3 methods={methods} />
            <Step4 methods={methods} />
            <Step5 methods={methods} />
            <Step6 methods={methods} />
            {/* <Step7 methods={methods} /> */}
            <Step8 methods={methods} />

            <div className="d-flex justify-content-end mt-4 blinking-btn">
              <button type="submit" className="btn btn-success" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save & Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CompleteProfileForm);
