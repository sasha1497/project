// import React from 'react';
// import { UseFormReturn } from 'react-hook-form';

// type Props = {
//     methods: UseFormReturn<any>;
// };

// const Step2: React.FC<Props> = ({ methods }) => {
//     const {
//         register,
//         formState: { errors }
//     } = methods;

//     return (
//         <div style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
//             {/* Mobile num */}
//             <div style={{ marginBottom: '1rem' }}>
//                 <label htmlFor="country">Mobile Number</label>
//                 <input
//                     id="mobile"
//                     type='number'
//                     {...register('mobile', { required: 'mobile is required' })}
//                     style={{ width: '100%', padding: '8px', marginTop: '4px' }}
//                 />
//                 {errors.mobile && (
//                     <p style={{ color: 'red', marginBottom: '10px' }}>
//                         {errors.mobile.message as string}
//                     </p>
//                 )}
//             </div>

//             {/* WA num */}
//             <div style={{ marginBottom: '1rem' }}>
//                 <label htmlFor="whatsapp">Whatsapp Number</label>
//                 <input
//                     id="whatsapp"
//                     type='number'
//                     {...register('whatsapp', {
//                         required: 'whatsapp is required'
//                     })}
//                     style={{ width: '100%', padding: '8px', marginTop: '4px' }}
//                 />
//                 {errors.whatsapp && (
//                     <p style={{ color: 'red', marginBottom: '10px' }}>
//                         {errors.whatsapp.message as string}
//                     </p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Step2;





import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

type Props = {
  methods: UseFormReturn<any>;
};

const Step2: React.FC<Props> = ({ methods }) => {
  const {
    control,
    formState: { errors },
  } = methods;

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
      {/* Internal CSS */}
      <style>
        {`
          .react-tel-input {
            width: 100%;
          }
          .react-tel-input .flag-dropdown {
            border: 1px solid #ccc;
            border-right: none;
            background: #fff;
            border-radius: 4px 0 0 4px;
          }
          .react-tel-input .selected-flag {
            background: #fff !important;
            padding: 0 12px;
            display: flex;
            align-items: center;
          }
          .react-tel-input .form-control {
            width: 100% !important;
            padding-left: 70px !important; /* space for code */
            height: 40px !important;
            border-radius: 0 4px 4px 0;
          }
        `}
      </style>

      {/* Mobile Number */}
      {/* <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="mobile">Enter your Mobile Number</label>
        <Controller
          name="mobile"
          control={control}
          rules={{ required: 'Mobile number is required' }}
          render={({ field }) => (
            <PhoneInput
              {...(field as any)}
              country="in"
              enableSearch={true}
              separateDialCode={true}
              inputStyle={{ width: '100%' }}
              placeholder="Enter mobile number"
              onChange={(value) => field.onChange("+" + value)}
            />
          )}
        />
        {errors.mobile && (
          <p style={{ color: 'red', marginBottom: '10px' }}>
            {errors.mobile.message as string}
          </p>
        )}
      </div> */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="mobile">Enter your Mobile Number</label>
        <Controller
          name="mobile"
          control={control}
          // rules={{
          //   required: 'Mobile number is required', pattern: {
          //     value: /^[6-9]\d{9}$/,
          //     message: 'Enter a valid 10-digit mobile number',
          //   },
          // }}
           rules={{
            required: 'Mobile number is required'
          }}

          render={({ field }) => (
            <PhoneInput
              {...(field as any)}
              country="in"
              onlyCountries={['in']}
              disableDropdown={true}
              disableCountryCode={false}
              countryCodeEditable={false}
              inputStyle={{ width: '100%' }}
              placeholder="Enter mobile number"
              inputProps={{
                name: field.name,
                ref: field.ref, // ✅ Attach ref here
                required: true,
              }}
              onChange={(value) => field.onChange("+" + value)}
            />
          )}
        />
        {errors.mobile && (
          <p style={{ color: 'red', marginBottom: '10px' }}>
            {errors.mobile.message as string}
          </p>
        )}
      </div>

      {/* WhatsApp Number */}
      {/* <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="whatsapp">Enter your WhatsApp Number</label>
        <Controller
          name="whatsapp"
          control={control}
          rules={{ required: 'WhatsApp number is required' }}
          render={({ field }) => (
            <PhoneInput
              {...(field as any)}
              country="in"
              enableSearch={true}
              separateDialCode={true}
              inputStyle={{ width: '100%' }}
              placeholder="Enter WhatsApp number"
              onChange={(value) => field.onChange("+" + value)}
            />
          )}
        />
        {errors.whatsapp && (
          <p style={{ color: 'red', marginBottom: '10px' }}>
            {errors.whatsapp.message as string}
          </p>
        )}
      </div> */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="whatsapp">Enter your WhatsApp Number</label>
        <Controller
          name="whatsapp"
          control={control}
          // rules={{
          //   required: 'WhatsApp number is required', pattern: {
          //     value: /^[6-9]\d{9}$/,
          //     message: 'Enter a valid 10-digit mobile number',
          //   },
          // }}
           rules={{
            required: 'WhatsApp number is required'
          }}
          render={({ field }) => (
            <PhoneInput
              {...(field as any)}
              country="in"
              onlyCountries={['in']}
              disableDropdown={true}
              disableCountryCode={false}
              countryCodeEditable={false}
              inputStyle={{ width: '100%' }}
              placeholder="Enter WhatsApp number"
              inputProps={{
                name: field.name,
                ref: field.ref, // ✅ Attach ref here
                required: true,
              }}
              onChange={(value) => field.onChange("+" + value)}
            />
          )}
        />
        {errors.whatsapp && (
          <p style={{ color: 'red', marginBottom: '10px' }}>
            {errors.whatsapp.message as string}
          </p>
        )}
      </div>
    </div>
  );
};

export default Step2;

