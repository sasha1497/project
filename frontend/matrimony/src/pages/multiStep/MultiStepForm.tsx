import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { updateFormData, resetForm } from '../../features/form/formSlice';
import { useNavigate } from 'react-router-dom';
import Step1 from '../../pages/steps/step1';
import Step2 from '../../pages/steps/step2';
import Step3 from '../../pages/steps/step3';
import Step4 from '../../pages/steps/step4';
import Step5 from '../../pages/steps/step5';
import Step6 from '../../pages/steps/step6';
import Step7 from '../../pages/steps/step7';
import Step8 from '../../pages/steps/step8';
import Step9 from '../../pages/steps/step9';







import './multi.css';

const steps = [Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8, Step9];

export default function App() {
  const methods = useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const CurrentComponent = steps[currentStep];
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.form);
  const navigate = useNavigate();

  const handleNext = () => {
    const values = methods.getValues();
    dispatch(updateFormData(values));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: any) => {
    console.log(data, 'gygyghbh')
    dispatch(updateFormData(data));
    dispatch(resetForm());
    localStorage.setItem('authToken', '1');
    navigate('/profile');
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-10">
      <div className="card shadow" style={{ width: '400px' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Sign Up 👋</h2>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(currentStep === steps.length - 1 ? onSubmit : handleNext)}>
              <CurrentComponent methods={methods} />
              {/* {currentStep === 7 ? (
                <Step8 onPaymentSuccess={() => setCurrentStep(8)} />
              ) : currentStep === 8 ? (
                <Step9 methods={methods} />
              ) : (
                <CurrentComponent methods={methods} />
              )} */}

              <div className="d-flex justify-content-between mt-4">
                {currentStep > 0 && (
                  <button type="button" className="btn btn-secondary" onClick={handleBack}>
                    Back
                  </button>
                )}
                <button type="submit" className="btn btn-primary ms-auto">
                  {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

