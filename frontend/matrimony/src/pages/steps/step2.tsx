import React from 'react';
import { UseFormReturn } from 'react-hook-form';

type Props = {
    methods: UseFormReturn<any>;
};

const Step2: React.FC<Props> = ({ methods }) => {
    const {
        register,
        formState: { errors }
    } = methods;

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
            {/* country */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="country">Select Your Country</label>
                <select
                    id="country"
                    {...register('country', { required: 'country is required' })}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                >
                    {/* <option value="">You can select your interest country to get Bride / Groom </option> */}
                    <option value="">select your country</option>
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
                {errors.country && (
                    <p style={{ color: 'red', marginBottom: '10px' }}>
                        {errors.country.message as string}
                    </p>
                )}
            </div>


            {/* state */}
            {/* <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="state">State</label>
                <input
                    id="state"
                    {...register('state', {
                        required: 'state is required'
                    })}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
                {errors.state && (
                    <p style={{ color: 'red', marginBottom: '10px' }}>
                        {errors.state.message as string}
                    </p>
                )}
            </div> */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="state">Select Your State</label>
                <select
                    id="state"
                    {...register('state', {
                        required: 'State is required'
                    })}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                >
                    <option value="">Select Your State</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
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
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                    <option value="Ladakh">Ladakh</option>
                    <option value="Lakshadweep">Lakshadweep</option>
                    <option value="Puducherry">Puducherry</option>
                </select>

                {errors.state && (
                    <p style={{ color: 'red', marginBottom: '10px' }}>
                        {errors.state.message as string}
                    </p>
                )}
            </div>


            {/* district */}
            <div style={{ marginBottom: '1rem' }}>
                {/* <label htmlFor="district">District / Territory</label> */}
                <label htmlFor="district">Enter Your District</label>
                <input
                    id="district"
                    {...register('district', { required: 'district is required' })}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
                {errors.district && (
                    <p style={{ color: 'red', marginBottom: '10px' }}>
                        {errors.district.message as string}
                    </p>
                )}
            </div>

        </div>
    );
};

export default Step2;

