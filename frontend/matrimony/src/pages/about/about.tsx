import React from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import './about.css';
import { useNavigate } from "react-router-dom";


const About = () => {

    const navigate = useNavigate(); // initialize it


    //     const aboutText = `
    //     Dear Sir / Madam,

    //     The heartfelt gratitude and thankfulness are being presented by madam BAJOL ONLINE APP on the outset of this venture.

    //     What does BAJOL mean shall be clarified here concisely.
    //     In our society, so many males and females are being astrayed in pursuit of finding an ideal couple, after they are being driven, by manipulated, and thereby happened to be married in disharmony.

    //     Assist you too instead, BAJOL is endeavoring to detect apt and appropriate spouse in your personal life.
    //     Through this platform each one of you can have a healthy, happy, colorful, and glorious married life.

    //     Those who aspire to be married, whether it is the first time or second time, by making a nominal payment, you will be able to enter the app and access appropriate future brides and grooms within the states and countries abroad.

    //     Nowadays, a large number of people are outrightly betrayed by personal matrimonial agencies as well as other online matrimonial apps. Therefore, so many people are dissuaded from these streams. Due to this reason, millions of first and second marriage aspirants are becoming incapable of fulfilling their nuptial dreams.

    //     But herein, BAJOL is creating a reliable platform, whereby being levied a small amount, the needy can utilize unlimited services both domestically and internationally. You can select suitable persons matchable to your wish.

    //     We do pray for this app to be a great opportunity to find a suitable match to get happy, healthy, and harmonious family life.

    //     Thank you
    //   `;
    const aboutText = `
പ്രിയ സാർ / മാഡം,

ഈ സംരംഭത്തിന്റെ തുടക്കത്തിൽ BAJOL ONLINE APP ആത്മാർത്ഥമായ നന്ദിയും സ്നേഹപൂർവ്വമായ നന്ദിയും അർപ്പിക്കുന്നു.

BAJOL എന്നത് എന്താണ് എന്നത് ഇവിടെ സാന്ദ്രമായി വിശദീകരിക്കുന്നു.
നമ്മുടെ സമൂഹത്തിൽ, അനേകം പുരുഷന്മാരും സ്ത്രീകളും, മനോഹരമായ ഒരു കൂട്ടുപതിപ്പ് കണ്ടെത്താനുള്ള ശ്രമത്തിൽ വഴിതെറ്റി പോകുന്നുവെന്ന് കാണാം. പലപ്പോഴും അവർ നിയന്ത്രിതമായ സാഹചര്യങ്ങളിൽ അമാനുഷികമായ വിവാഹത്തിലേർപ്പെടുന്നു.

പകരം നിങ്ങളെ സഹായിക്കാൻ, BAJOL നിങ്ങളുടെ വ്യക്തിപരമായ ജീവിതത്തിൽ അനുയോജ്യമായ പങ്കാളിയെ കണ്ടെത്താൻ ശ്രമിക്കുന്നു.
ഈ പ്ലാറ്റ്ഫോമിന്റെ മുഖേന, നിങ്ങൾക്ക് ആരോഗ്യകരമായ, സന്തോഷഭരിതമായ, വർണാഭമായ, മഹത്തായ വിവാഹ ജീവിതം നേടാൻ സാധിക്കും.

വിവാഹം ആഗ്രഹിക്കുന്നവർ, ആദ്യമായോ രണ്ടാംമായോ, ഒരു ചെറിയ ഫീസ് നൽകികൊണ്ട് ആപ്പ് പ്രവേശിച്ച് സംസ്ഥാനങ്ങളിലെയും വിദേശ രാജ്യങ്ങളിലെയും അനുയോജ്യമായ വരനും വധുവിനെയും കാണാനും അവരെ തിരഞ്ഞെടുക്കാനും കഴിയും.

ഇന്നകാലത്ത്, അനേകം പേർ വ്യക്തിഗത മാട്രിമോണിയൽ ഏജൻസികളാൽ, മറ്റ് ഓൺലൈൻ മാട്രിമോണിയൽ ആപ്പുകളാൽ നിസ്സഹായമായി വഞ്ചിക്കപ്പെടുന്നു. അതിനാൽ, പലരും ഈ മാർഗങ്ങളിൽ നിന്ന് തിരിഞ്ഞു പോകുന്നു. ഈ കാരണത്താൽ, ആദ്യമോ രണ്ടാംമോ വിവാഹം ആഗ്രഹിക്കുന്ന ദശക്കണക്കിന് ആളുകൾ അവരുടെ വിവാഹ സ്വപ്നങ്ങൾ നടപ്പിലാക്കാൻ കഴിയുന്നില്ല.

എങ്കിലും, BAJOL ഒരു വിശ്വസനീയമായ പ്ലാറ്റ്ഫോം സൃഷ്ടിച്ചു, കുറഞ്ഞ ഫീസ് അടച്ച്, ആവശ്യക്കാരൻ ആഭ്യന്തരവും അന്താരാഷ്ട്രവുമായ അനിയന്ത്രിത സേവനങ്ങൾ ഉപയോഗിക്കാവുന്നതാണ്. നിങ്ങളുടെ ഇഷ്ടാനുസരണം അനുയോജ്യമായ വ്യക്തികളെ തിരഞ്ഞെടുക്കാം.

ഈ ആപ്പ് സന്തോഷകരമായ, ആരോഗ്യകരമായ, സഹപ്രവർത്തനപരമായ കുടുംബജീവിതത്തിനായി അനുയോജ്യമായ കൂട്ടുപതിപ്പ് കണ്ടെത്താൻ ഒരു വലിയ അവസരമാകുമെന്ന് ഞങ്ങൾ പ്രാർത്ഥിക്കുന്നു.

നന്ദി
`;


    return (
        <div className="about-container">
            <motion.div
                className="about-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 120 }}
            >
                <p className="typewriter-text">
                    <Typewriter
                        words={[aboutText]}
                        cursor
                        typeSpeed={30} // adjust speed as you like
                        deleteSpeed={0}
                        delaySpeed={1000}
                        loop={1} // type only once
                    />
                </p>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate("/profile")}
                >
                    Back
                </button>
            </motion.div>
        </div>
    );
};

export default About;
