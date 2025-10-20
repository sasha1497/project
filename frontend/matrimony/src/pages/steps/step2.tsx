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
                <label htmlFor="country">Country</label>
                <select
                    id="country"
                    {...register('country', { required: 'country is required' })}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                >
                    {/* <option value="">You can select your interest country to get Bride / Groom </option> */}
                    <option value="">select your country</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
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
                    <option value="Norway">Norway</option>






                </select>
                {errors.country && (
                    <p style={{ color: 'red', marginBottom: '10px' }}>
                        {errors.country.message as string}
                    </p>
                )}
            </div>


            {/* state */}
            <div style={{ marginBottom: '1rem' }}>
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
            </div>

            {/* district */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="district">District</label>
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

