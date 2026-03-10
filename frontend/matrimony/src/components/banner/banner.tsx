import './banner.css';
import { motion } from 'framer-motion';
import and from '../../asset/and.svg'
import ios from '../../asset/apple.svg'
import figure from '../../asset/figure.png'
import bajol from '../../asset/bajollogo.jpeg'
import { useState } from 'react';
import { useAppLanguage } from '../../i18n/LanguageContext';


const Banner = () => {

    const [showPopup, setShowPopup] = useState(false);
    
      const { t } = useAppLanguage();
    
    const cards = [
        {
            title: t('banner.card1.title'),
            text: t('banner.card1.text')
        },
        {
            title: t('banner.card2.title'),
            text: t('banner.card2.text')
        },
        {
            title: t('banner.card3.title'),
            text: t('banner.card3.text')
        },
    ];
   

    return (
        <div className="container-fluid" style={{ background: '#F5F5F5' }}>
            <div className="row">
                <div className="col-12 text-center">
                    <p className="hero-text">
                        {t('banner.findYourMatch')}
                    </p>
                </div>
            </div>
            <div className="container my-5">
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 justify-content-center">
                    {cards.map((card, index) => (
                        <div className="col d-flex justify-content-center" key={index}>
                            <motion.div
                                className="card card-3d bg-primary mb-5"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.05, rotate: 1 }}
                                transition={{ type: 'spring', stiffness: 100 }}
                            >
                                <div className="card-body">
                                    <h5 className="card-title text-white fs-50">{card.title}</h5>
                                    <p className="card-text text-white">{card.text}</p>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="row" style={{ background: '#251839' }}>
                <div className="col-12 col-md-6  text-white p-4 d-flex flex-column justify-content-center align-items-center text-center">
                    <p className='download-para'>
                        To speed up your partner search, download <b>Bajol App</b>
                    </p>
                  
                    <div className='d-flex'>
                        <div className='p-3'>
                            <img src={and} alt="couple" className="img-fluid" onClick={() => setShowPopup(true)}
                            />
                        </div>
                        <div className='p-3'>
                            <img src={ios} alt="couple" className="img-fluid" onClick={() => setShowPopup(true)}
                            />
                        </div>
                    </div>
                    {/* Popup */}
                    {showPopup && (
                        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
                            <div
                                className="popup-content"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h4 className='text-primary'>🚀 Coming Soon</h4>
                                <p className='text-primary'>Our mobile app is launching soon. Stay tuned!</p>

                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={() => setShowPopup(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                    <p className='mt-3'>
                        {t('banner.trustedMatrimonyLine')}
                        <b>&nbsp;{t('banner.downloadCount')}</b>
                    </p>
                </div>
                <div className="col-12 col-md-6 text-white p-4">
                    <div className='d-flex'>
                        <div className='p-3'>
                            {/* <img src={figure} alt="couple" className="img-fluid" /> */}
                            <motion.img
                                src={figure}
                                alt="couple"
                                className="img-fluid"
                                animate={{
                                    y: [0, -10, 0],       // vertical jump
                                    rotate: [0, 5, -5, 0]  // slight side-to-side rotation
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    ease: "easeInOut"
                                }}
                            />

                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-12  p-4 d-flex flex-column justify-content-center align-items-center text-center'>
                    <p className='download-para-millio d-flex  justify-content-center align-items-center text-center'>
                        <b>20,000+</b>&nbsp;{t('banner.foundPartnerLine')}
                    </p>
                    <div>
                        <img src={bajol} alt='' height={200} width={150} />
                    </div>
                    <div>
                        <p className='download-para-trust'>{t('banner.trustedByLine')} <b>20,000+</b>&nbsp;{t('banner.members')}</p>
                    </div>
                    <div className='container'>
                        <p className='text-justify'>
                            {t('banner.description')}
                        </p>
                        <div>
                            <p className='text-primary'>{t('banner.countryLine')}</p>
                        </div>
                        <div className='bg-primary'>
                            <p className='p-3 text-white' style={{ fontSize: '30px' }}>{t('banner.trustedBy')} <b>20,000+</b> {t('banner.members')}</p>
                            <div className='row'>
                                <div className='col-lg-4 col-md-12 col-sm-12'>
                                    <p className='p-3 text-white' style={{ fontSize: '20px' }}><b>{t('banner.bestMatches')}</b></p>
                                </div>
                                <div className='col-lg-4 col-md-12 col-sm-12'>
                                    <p className='p-3 text-white' style={{ fontSize: '20px' }}><b>{t('banner.verifiedProfiles')}</b></p>
                                </div>
                                <div className='col-lg-4 col-md-12 col-sm-12'>
                                    <p className='p-3 text-white' style={{ fontSize: '20px' }}><b>{t('banner.privacy')}</b></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className='row'>
                <div className='col-12 p-4 d-flex flex-column justify-content-center align-items-center text-center'>

                    <p className='download-para-millio d-flex justify-content-center align-items-center text-center'>
                        <b>20,000+</b>&nbsp;ലോകത്തിലെ ജീവിത പങ്കാളികളെ BajolMatrimony-യിൽ കണ്ടെത്തി!
                    </p>

                    <div>
                        <img src={bajol} alt='' height={200} width={150} />
                    </div>

                    <div>
                        <p className='download-para-trust'>
                            Bajol.com - <b>20,000+</b>&nbsp;അംഗങ്ങൾ വിശ്വസിക്കുന്നു
                        </p>
                    </div>

                    <div className='container'>
                        <p className='text-justify'>
                            Bajol.com, ലോകത്തെ പ്രശസ്ത ബ്രാൻഡുകളിലൊന്നും ഏറ്റവും വലിയ മാട്രിമോണിയൽ സേവന സ്ഥാപനങ്ങളിലൊന്നും, ഒരു ലളിതമായ ലക്ഷ്യത്തോടെ സ്ഥാപിതമായി – ആളുകൾക്ക് സന്തോഷം കണ്ടെത്താൻ സഹായിക്കുക. 1996-ൽ ഓൺലൈൻ മാട്രിമോണിയൽ സംവിധാനം തുടങ്ങിയ കമ്പനി, പതിന്മൂന്ന് വർഷങ്ങൾക്ക് ശേഷവും ഈ ശൃംഗാര മാട്രിമോണി വിഭാഗത്തിൽ മുൻതൂക്കം നിലനിർത്തുന്നു. ഇന്ത്യയിലെ വധൂ-വരന്മാർ വിവാഹത്തിനായി കാണാൻ ഉപയോഗിക്കുന്ന രീതികളെ മാറ്റി, BajolMatrimony.com ലോകപ്രശസ്ത സേവനമായി മാറി, 20,000+ ആളുകളെ സ്പർശിച്ചിട്ടുണ്ട്.
                        </p>

                        <div>
                            <p className='text-primary'>
                                ഇന്ത്യ | യുഎസ്എ | കാനഡ | യുഎക് | സിങ്കപ്പൂർ | ഓസ്‌ട്രേലിയ | യുഎഇ | NRI മാട്രിമോണിയൽസ്
                            </p>
                        </div>

                        <div className='bg-primary'>
                            <p className='p-3 text-white' style={{ fontSize: '30px' }}>
                                <b>20,000+</b> അംഗങ്ങൾ വിശ്വസിക്കുന്നു
                            </p>

                            <div className='row'>
                                <div className='col-lg-4 col-md-12 col-sm-12'>
                                    <p className='p-3 text-white' style={{ fontSize: '20px' }}>
                                        <b>💑 മികച്ച മാച്ചുകൾ</b>
                                    </p>
                                </div>
                                <div className='col-lg-4 col-md-12 col-sm-12'>
                                    <p className='p-3 text-white' style={{ fontSize: '20px' }}>
                                        <b>✅ പരിശോധിച്ച പ്രൊഫൈലുകൾ</b>
                                    </p>
                                </div>
                                <div className='col-lg-4 col-md-12 col-sm-12'>
                                    <p className='p-3 text-white' style={{ fontSize: '20px' }}>
                                        <b>🔒 100% സ്വകാര്യത</b>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div> */}


            {/* <div className='row'>
                <div className='col-12'>
                    <Footer />
                </div>

            </div> */}
        </div>
    );
};

export default Banner;
