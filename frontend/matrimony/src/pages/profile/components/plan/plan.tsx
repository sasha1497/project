import React from 'react';
import './plan.css';
import { motion } from 'framer-motion';
import axios from "axios";
import { useSelector } from 'react-redux';
import userEvent from '@testing-library/user-event';


interface Plan {
  name: string;
  description: string;
  price: number; // base USD
  features: string[];
  colorClass: string;
  plan_id: any,
  // bgColor: any
}

const plans: Plan[] = [
  {
    plan_id: 1,
    name: 'SILVER',
    description: 'Best for exploring the platform',
    price: 1,
    features: [
      'Create and manage profile',
      'Limited daily profile views',
      'Send up to 5 interests per day',
      'View basic contact info (limited)',
      'Basic support',
    ],
    colorClass: 'text-white',
    // bgColor: '#C0C0C0'
  },
  {
    plan_id: 2,
    name: 'GOLD',
    description: 'For serious users looking for quick matches',
    price: 1,
    features: [
      'Unlimited profile views',
      'Send up to 25 interests per day',
      'Chat with verified users',
      'See who viewed your profile',
      'Priority listing in search',
      'Access to full contact info',
      'Customer support',
    ],
    colorClass: 'text-white',
    // bgColor: '#FFD700',
  },
  {
    plan_id: 3,
    name: 'PLATINUM',
    description: 'For those who want maximum reach and priority',
    price: 1,
    features: [
      'All Gold features',
      'Top placement in search results',
      'Verified badge on your profile',
      'Unlimited interest sending',
      'Personal matchmaker assistance',
      'Dedicated support team',
      'Profile boost 5x per month',
      'Priority customer care',
    ],
    colorClass: 'text-white',
    // bgColor: '#E5E4E2',
  },
];

interface PlanProps {
  country?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}



// ✅ Function to show price labels based on country & currency
const getPriceLabel = (priceUSD: number, country?: string): string => {
  switch (country?.toLowerCase()) {
    case 'india': return `₹${priceUSD * 194}`;
    case 'bahrain':
    case 'kuwait': return `د.ك 10`;
    case 'oman': return `﷼ 10`;
    case 'qatar': return `﷼ 50`;
    case 'saudi':
    case 'saudi arabia': return `﷼ 50`;
    case 'dubai':
    case 'united arab emirates': return `د.إ 50`;
    case 'sharjah':
    case 'abhu dhabi': return `د.إ 50`;
    case 'brunei': return `$30`;
    case 'mauritius': return `₨250`;
    case 'philippine':
    case 'philippines': return `₱200`;
    case 'israel': return `₪50`;
    case 'sri lanka': return `රු600`;
    case 'sweeden':
    case 'sweden': return `kr100`;
    case 'wales': return `$10`;
    case 'finland': return `€10`;
    case 'bahamas': return `$10`;
    case 'fiji': return `$15`;
    case 'slomon island':
    case 'solomon island': return `$25`;
    case 'barbados': return `$25`;
    case 'saint lucia': return `$25`;
    case 'zambia': return `ZK100`;
    case 'botswana': return `P100`;
    case 'egypt': return `£200`;
    case 'mexico': return `₱100`;
    case 'thailand': return `฿100`;
    case 'colombia': return `$25`;
    case 'greece': return `€10`;
    case 'ghana': return `₵75`;
    case 'norway': return `kr75`;
    case 'malta':
    case 'germany':
    case 'switzerland':
    case 'new zealand':
    case 'netherland':
    case 'netherlands': return `€10`;
    case 'bermuda':
    case 'singapore': return `$15`;
    case 'malaysia': return `RM25`;
    case 'scotland': return `£10`;
    case 'england': return `£6`;
    case 'usa': return `$6`;
    case 'canada': return `CA$${(priceUSD * 1.35).toFixed(2)}`;
    case 'australia': return `A$${(priceUSD * 1.5).toFixed(2)}`;
    default: return `$${priceUSD}`;
  }
};

// ✅ Function to return numeric price for API payloads
// const getFinalPriceNumber = (priceUSD: number, country?: string): number => {
//   switch (country?.toLowerCase()) {
//     case 'india': return priceUSD * 194;
//     case 'canada': return priceUSD * 1.35;
//     case 'australia': return priceUSD * 1.5;
//     case 'malaysia': return priceUSD * 25;
//     case 'brunei': return priceUSD * 30;
//     case 'mauritius': return priceUSD * 250;
//     case 'philippine':
//     case 'philippines': return priceUSD * 200;
//     case 'israel': return priceUSD * 50;
//     case 'sri lanka': return priceUSD * 600;
//     case 'sweeden':
//     case 'sweden': return priceUSD * 100;
//     case 'fiji': return priceUSD * 15;
//     case 'slomon island':
//     case 'solomon island': return priceUSD * 25;
//     case 'barbados': return priceUSD * 25;
//     case 'saint lucia': return priceUSD * 25;
//     case 'zambia': return priceUSD * 100;
//     case 'botswana': return priceUSD * 100;
//     case 'egypt': return priceUSD * 200;
//     case 'mexico': return priceUSD * 100;
//     case 'thailand': return priceUSD * 100;
//     case 'colombia': return priceUSD * 25;
//     case 'ghana': return priceUSD * 75;
//     case 'norway': return priceUSD * 75;
//     default: return priceUSD;
//   }
// };

const getFinalPriceNumber = (priceUSD: number, country?: string): number => {
  switch (country?.toLowerCase()) {
    case 'india': return priceUSD * 194;
    case 'bahrain':
    case 'kuwait': return 10;              // matches label د.ك 10
    case 'oman': return 10;                // ﷼ 10
    case 'qatar': return 50;               // ﷼ 50
    case 'saudi':
    case 'saudi arabia': return 50;        // ﷼ 50
    case 'dubai':
    case 'united arab emirates':
    case 'sharjah':
    case 'abhu dhabi': return 50;          // د.إ 50
    case 'brunei': return 30;              // $30
    case 'mauritius': return 250;          // ₨250
    case 'philippine':
    case 'philippines': return 200;        // ₱200
    case 'israel': return 50;              // ₪50
    case 'sri lanka': return 600;          // රු600
    case 'sweeden':
    case 'sweden': return 100;             // kr100
    case 'wales': return 10;               // $10
    case 'finland': return 10;             // €10
    case 'bahamas': return 10;             // $10
    case 'fiji': return 15;                // $15
    case 'slomon island':
    case 'solomon island': return 25;      // $25
    case 'barbados': return 25;            // $25
    case 'saint lucia': return 25;         // $25
    case 'zambia': return 100;             // ZK100
    case 'botswana': return 100;           // P100
    case 'egypt': return 200;              // £200
    case 'mexico': return 100;             // ₱100 (as in your label)
    case 'thailand': return 100;           // ฿100
    case 'colombia': return 25;            // $25
    case 'greece': return 10;              // €10
    case 'ghana': return 75;               // ₵75
    case 'norway': return 75;              // kr75
    case 'malta':
    case 'germany':
    case 'switzerland':
    case 'new zealand':
    case 'netherland':
    case 'netherlands': return 10;         // €10
    case 'bermuda':
    case 'singapore': return 15;           // $15
    case 'malaysia': return 25;            // RM25
    case 'scotland': return 10;            // £10
    case 'england': return 6;              // £6
    case 'usa': return 6;                  // $6
    case 'canada': return priceUSD * 1.35; // keeps previous behavior
    case 'australia': return priceUSD * 1.5; // keeps previous behavior
    default: return priceUSD;
  }
};

// ✅ Return ISO currency codes for Razorpay
const getCurrencyCode = (country?: string): string => {
  switch (country?.toLowerCase()) {
    case 'india': return 'INR';
    case 'usa': return 'USD';
    case 'canada': return 'CAD';
    case 'australia': return 'AUD';
    case 'england':
    case 'wales':
    case 'scotland': return 'GBP';
    case 'sweden':
    case 'sweeden': return 'SEK';
    case 'denmark': return 'DKK';
    case 'norway': return 'NOK';
    case 'germany':
    case 'finland':
    case 'malta':
    case 'greece':
    case 'switzerland':
    case 'netherlands':
    case 'netherland':
    case 'new zealand': return 'EUR';
    case 'dubai':
    case 'united arab emirates':
    case 'sharjah':
    case 'abhu dhabi': return 'AED';
    case 'qatar':
    case 'saudi':
    case 'saudi arabia':
    case 'oman': return 'SAR';
    case 'bahrain': return 'BHD';
    case 'kuwait': return 'KWD';
    case 'malaysia': return 'MYR';
    case 'singapore': return 'SGD';
    case 'brunei': return 'BND';
    case 'philippines':
    case 'philippine': return 'PHP';
    case 'sri lanka': return 'LKR';
    case 'mauritius': return 'MUR';
    case 'ghana': return 'GHS';
    case 'zambia': return 'ZMW';
    case 'botswana': return 'BWP';
    case 'egypt': return 'EGP';
    case 'mexico': return 'MXN';
    case 'thailand': return 'THB';
    case 'colombia': return 'COP';
    case 'fiji': return 'FJD';
    case 'barbados':
    case 'saint lucia': return 'BBD';
    default: return 'USD';
  }
};


const Plan: React.FC<PlanProps> = ({ country }) => {

  const userId = useSelector((state: any) => state.auth.user?.id);

  const handleSelectPlan = async (planName: string, country?: string, priceUSD?: number) => {
    const finalPrice = getFinalPriceNumber(priceUSD || 1, country);

    const currencyCode = getCurrencyCode(country);


    // const finalPrice = getPriceLabel(priceUSD || 1, country);


    const payload = {
      country: country ?? 'Not selected',
      plan_id: planName,
      amount: finalPrice,
      receipt: "BAJOL MATRIMONY",
      currency: currencyCode,
      user_id: userId
    };

    try {
      const response = await axios.post('https://usrapi.bajolmatrimony.com/razorpay/create-subscription-order', payload);
      console.log('API Response:', response.data);

      // Pass razorpay_order object to checkout
      openRazorpayCheckout(response.data.razorpay_order);
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
    }
  };

  // Razorpay Checkout function

  const openRazorpayCheckout = (order: any) => {
    const options = {
      key: "rzp_test_RJsUDnhQyxxdk4",  // Razorpay key
      amount: order.amount,             // in paise
      currency: order.currency,
      order_id: order.id,               // v1 order id
      name: "BAJOL MATRIMONY",
      description: "Subscription Payment",
      handler: function (response: any) {
        console.log('Payment success:', response);
        // response will contain:
        // response.razorpay_payment_id
        // response.razorpay_order_id
        // response.razorpay_signature
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      modal: {
        ondismiss: function () {
          console.log('Checkout closed by user');
        }
      },
      theme: { color: "#4CAF50" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  console.log(userId, 'userID++++++');
  return (
    <section className="pricing-plans container py-5">
      <div className="row justify-content-center g-4">
        {/* <motion.p
          className="mt-3 text-center pro_text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ y: [0, -10, 0], opacity: [1, 0.8, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
        >
          🚀 Unlock your matches by upgrading your plan! 💖✨
        </motion.p> */}
        <p
          className="mt-3 text-center pro_text"
        >
          🚀 Unlock your matches by upgrading your plan! 💖✨
        </p>

        {/* <motion.p
          className="mt-3 text-center pro_text text-danger blinking-btn"
          initial={{ opacity: 0, y: -20 }}
          animate={{ y: [0, -10, 0], opacity: [1, 0.8, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
        >
          After payment you can go to profile gallery
        </motion.p> */}
        <motion.p
          className="mt-3 text-center pro_text blinking-btn"
          initial={{ opacity: 0, y: -20 }}
          animate={{
            y: [0, -10, 0],
            opacity: [1, 0.8, 1],
            color: ['#ff0000', '#00ff00'], // red -> yellow -> green
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        >
          * After payment you can go to profile gallery *
        </motion.p>

    <>
          <button
            className="btn btn-success px-4 py-2 shadow-lg fw-bold"
            onClick={() => window.location.reload()}
            style={{
              borderRadius: '50px',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            🔄 Reload
          </button>
        </>
       
        {plans.map((plan: any, index) => (
          
          <div key={index} className="col-md-6 col-lg-4">
            <div className="card h-100 bg-primary shadow pricing-card border-dark text-center position-relative">
              {/* <div
              className={`card h-100 shadow pricing-card border-dark text-center position-relative`}
              style={{ backgroundColor: plan.bgColor }}
            > */}
              <div className="card-body d-flex flex-column">
                <h4 className={`fw-normal ${plan.colorClass}`}>{plan.name}</h4>
                <p className="text-white small">{plan.description}</p>
                <h1 className={`my-3 fw-bold ${plan.colorClass}`}>
                  {getPriceLabel(plan.price, country)}
                  <sub className="fs-6 text-white"> / 90 days</sub>
                </h1>
                <ul className="list-unstyled text-start mt-3 flex-grow-1">
                  {plan.features.map((feature: any, idx: any) => (
                    <li key={idx} className="mb-2">
                      <i className="fa-solid fa-check me-2 text-light" />
                      <span className="text-light">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="btn mt-4 w-100 fw-bold bg-white text-dark border-0 blinking-btn"
                  onClick={() => handleSelectPlan(plan.plan_id, country, plan.price)}
                >
                  SELECT
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="flash-sale-banner bg-danger text-white py-2 mb-3 overflow-hidden">
          <div className="scrolling-text text-center fw-bold">
            🎉 Flash Sale: Get 50% OFF on Premium Plans — Limited Time Offer! ⏳
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Plan);

// import React from 'react';
// import './plan.css';
// import { motion } from 'framer-motion';
// import axios from "axios";
// import { useSelector } from 'react-redux';

// interface Plan {
//   name: string;
//   description: string;
//   price: number;
//   features: string[];
//   colorClass: string;
//   plan_id: any;
// }

// const plans: Plan[] = [
//   {
//     plan_id: 1,
//     name: 'SILVER',
//     description: 'Best for exploring the platform',
//     price: 1,
//     features: [
//       'Create and manage profile',
//       'Limited daily profile views',
//       'Send up to 5 interests per day',
//       'View basic contact info (limited)',
//       'Basic support',
//     ],
//     colorClass: 'text-white',
//   },
//   {
//     plan_id: 2,
//     name: 'GOLD',
//     description: 'For serious users looking for quick matches',
//     price: 1,
//     features: [
//       'Unlimited profile views',
//       'Send up to 25 interests per day',
//       'Chat with verified users',
//       'See who viewed your profile',
//       'Priority listing in search',
//       'Access to full contact info',
//       'Customer support',
//     ],
//     colorClass: 'text-white',
//   },
//   {
//     plan_id: 3,
//     name: 'PLATINUM',
//     description: 'For those who want maximum reach and priority',
//     price: 1,
//     features: [
//       'All Gold features',
//       'Top placement in search results',
//       'Verified badge on your profile',
//       'Unlimited interest sending',
//       'Personal matchmaker assistance',
//       'Dedicated support team',
//       'Profile boost 5x per month',
//       'Priority customer care',
//     ],
//     colorClass: 'text-white',
//   },
// ];

// interface PlanProps {
//   country?: string;
// }

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// // ✅ Currency label mapper
// const getPriceLabel = (priceUSD: number, country?: string): string => {
//   switch (country?.toLowerCase()) {
//     case 'india': return `₹${(priceUSD * 85).toFixed(0)}`;
//     case 'canada': return `CA$${(priceUSD * 1.35).toFixed(2)}`;
//     case 'australia': return `A$${(priceUSD * 1.55).toFixed(2)}`;
//     case 'sweden':
//     case 'sweeden': return `kr${(priceUSD * 11).toFixed(0)}`;
//     case 'denmark': return `kr${(priceUSD * 7.5).toFixed(0)}`;
//     case 'norway': return `kr${(priceUSD * 10.5).toFixed(0)}`;
//     case 'finland':
//     case 'germany':
//     case 'malta':
//     case 'switzerland':
//     case 'new zealand':
//     case 'netherlands':
//     case 'netherland':
//     case 'greece': return `€${(priceUSD * 0.9).toFixed(2)}`;
//     case 'england':
//     case 'wales':
//     case 'scotland': return `£${(priceUSD * 0.78).toFixed(2)}`;
//     case 'usa': return `$${priceUSD}`;
//     case 'dubai':
//     case 'united arab emirates':
//     case 'abhu dhabi':
//     case 'sharjah': return `د.إ${(priceUSD * 3.67).toFixed(2)}`;
//     case 'kuwait': return `د.ك${(priceUSD * 0.31).toFixed(2)}`;
//     case 'bahrain': return `د.ب${(priceUSD * 0.38).toFixed(2)}`;
//     case 'oman':
//     case 'qatar':
//     case 'saudi':
//     case 'saudi arabia': return `﷼${(priceUSD * 3.75).toFixed(2)}`;
//     case 'malaysia': return `RM${(priceUSD * 4.7).toFixed(2)}`;
//     case 'singapore': return `S$${(priceUSD * 1.35).toFixed(2)}`;
//     case 'brunei': return `B$${(priceUSD * 1.35).toFixed(2)}`;
//     case 'philippines':
//     case 'philippine': return `₱${(priceUSD * 58).toFixed(0)}`;
//     case 'sri lanka': return `රු${(priceUSD * 300).toFixed(0)}`;
//     case 'mauritius': return `₨${(priceUSD * 45).toFixed(0)}`;
//     case 'ghana': return `₵${(priceUSD * 15).toFixed(0)}`;
//     case 'zambia': return `ZK${(priceUSD * 25).toFixed(0)}`;
//     case 'botswana': return `P${(priceUSD * 13.5).toFixed(0)}`;
//     case 'egypt': return `£${(priceUSD * 50).toFixed(0)}`;
//     case 'mexico': return `$${(priceUSD * 18).toFixed(0)}`;
//     case 'thailand': return `฿${(priceUSD * 36).toFixed(0)}`;
//     case 'colombia': return `$${(priceUSD * 4000).toFixed(0)}`;
//     case 'fiji': return `$${(priceUSD * 2.25).toFixed(2)}`;
//     case 'barbados':
//     case 'saint lucia': return `$${(priceUSD * 2.05).toFixed(2)}`;
//     default: return `$${priceUSD}`;
//   }
// };

// // ✅ Currency conversion (numeric value)
// const getFinalPriceNumber = (priceUSD: number, country?: string): number => {
//   switch (country?.toLowerCase()) {
//     case 'india': return priceUSD * 85;
//     case 'canada': return priceUSD * 1.35;
//     case 'australia': return priceUSD * 1.55;
//     case 'sweden':
//     case 'sweeden': return priceUSD * 11;
//     case 'denmark': return priceUSD * 7.5;
//     case 'norway': return priceUSD * 10.5;
//     case 'germany':
//     case 'switzerland':
//     case 'new zealand':
//     case 'malta':
//     case 'finland':
//     case 'greece':
//     case 'netherlands':
//     case 'netherland': return priceUSD * 0.9;
//     case 'england':
//     case 'scotland':
//     case 'wales': return priceUSD * 0.78;
//     case 'dubai':
//     case 'united arab emirates':
//     case 'abhu dhabi':
//     case 'sharjah': return priceUSD * 3.67;
//     case 'kuwait': return priceUSD * 0.31;
//     case 'bahrain': return priceUSD * 0.38;
//     case 'oman':
//     case 'qatar':
//     case 'saudi':
//     case 'saudi arabia': return priceUSD * 3.75;
//     case 'malaysia': return priceUSD * 4.7;
//     case 'singapore': return priceUSD * 1.35;
//     case 'brunei': return priceUSD * 1.35;
//     case 'philippines':
//     case 'philippine': return priceUSD * 58;
//     case 'sri lanka': return priceUSD * 300;
//     case 'mauritius': return priceUSD * 45;
//     case 'ghana': return priceUSD * 15;
//     case 'zambia': return priceUSD * 25;
//     case 'botswana': return priceUSD * 13.5;
//     case 'egypt': return priceUSD * 50;
//     case 'mexico': return priceUSD * 18;
//     case 'thailand': return priceUSD * 36;
//     case 'colombia': return priceUSD * 4000;
//     case 'fiji': return priceUSD * 2.25;
//     case 'barbados':
//     case 'saint lucia': return priceUSD * 2.05;
//     default: return priceUSD;
//   }
// };


// // ✅ Return ISO currency codes for Razorpay
// const getCurrencyCode = (country?: string): string => {
//   switch (country?.toLowerCase()) {
//     case 'india': return 'INR';
//     case 'usa': return 'USD';
//     case 'canada': return 'CAD';
//     case 'australia': return 'AUD';
//     case 'england':
//     case 'wales':
//     case 'scotland': return 'GBP';
//     case 'sweden':
//     case 'sweeden': return 'SEK';
//     case 'denmark': return 'DKK';
//     case 'norway': return 'NOK';
//     case 'germany':
//     case 'finland':
//     case 'malta':
//     case 'greece':
//     case 'switzerland':
//     case 'netherlands':
//     case 'netherland':
//     case 'new zealand': return 'EUR';
//     case 'dubai':
//     case 'united arab emirates':
//     case 'sharjah':
//     case 'abhu dhabi': return 'AED';
//     case 'qatar':
//     case 'saudi':
//     case 'saudi arabia':
//     case 'oman': return 'SAR';
//     case 'bahrain': return 'BHD';
//     case 'kuwait': return 'KWD';
//     case 'malaysia': return 'MYR';
//     case 'singapore': return 'SGD';
//     case 'brunei': return 'BND';
//     case 'philippines':
//     case 'philippine': return 'PHP';
//     case 'sri lanka': return 'LKR';
//     case 'mauritius': return 'MUR';
//     case 'ghana': return 'GHS';
//     case 'zambia': return 'ZMW';
//     case 'botswana': return 'BWP';
//     case 'egypt': return 'EGP';
//     case 'mexico': return 'MXN';
//     case 'thailand': return 'THB';
//     case 'colombia': return 'COP';
//     case 'fiji': return 'FJD';
//     case 'barbados':
//     case 'saint lucia': return 'BBD';
//     default: return 'USD';
//   }
// };




// const Plan: React.FC<PlanProps> = ({ country }) => {
//   const userId = useSelector((state: any) => state.auth.user?.id);

//   const handleSelectPlan = async (planId: number, country?: string, priceUSD?: number) => {
//     const finalPrice = getFinalPriceNumber(priceUSD || 1, country);
//     const currencyCode = getCurrencyCode(country);


//     const payload = {
//       country: country ?? 'Not selected',
//       plan_id: planId,
//       amount: finalPrice,
//       receipt: "BAJOL MATRIMONY",
//       currency: ,
//       user_id: userId
//     };

//     try {
//       const response = await axios.post('https://usrapi.bajolmatrimony.com/razorpay/create-subscription-order', payload);
//       openRazorpayCheckout(response.data.razorpay_order);
//     } catch (error: any) {
//       console.error('API Error:', error.response?.data || error.message);
//     }
//   };

//   const openRazorpayCheckout = (order: any) => {
//     const options = {
//       key: "rzp_test_RJsUDnhQyxxdk4",
//       amount: order.amount,
//       currency: order.currency,
//       order_id: order.id,
//       name: "BAJOL MATRIMONY",
//       description: "Subscription Payment",
//       handler: function (response: any) {
//         console.log('Payment success:', response);
//         setTimeout(() => window.location.reload(), 1000);
//       },
//       modal: {
//         ondismiss: function () {
//           console.log('Checkout closed by user');
//         },
//       },
//       theme: { color: "#4CAF50" },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   return (
//     <section className="pricing-plans container py-5">
//       <div className="row justify-content-center g-4">
//         <p className="mt-3 text-center pro_text">
//           🚀 Unlock your matches by upgrading your plan! 💖✨
//         </p>

//         <motion.p
//           className="mt-3 text-center pro_text blinking-btn"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{
//             y: [0, -10, 0],
//             opacity: [1, 0.8, 1],
//             color: ['#ff0000', '#00ff00'],
//           }}
//           transition={{
//             duration: 3,
//             repeat: Infinity,
//             repeatType: 'loop',
//             ease: 'easeInOut',
//           }}
//         >
//           * After payment you can go to profile gallery *
//         </motion.p>

//         {plans.map((plan, index) => (
//           <div key={index} className="col-md-6 col-lg-4">
//             <div className="card h-100 bg-primary shadow pricing-card border-dark text-center position-relative">
//               <div className="card-body d-flex flex-column">
//                 <h4 className={`fw-normal ${plan.colorClass}`}>{plan.name}</h4>
//                 <p className="text-white small">{plan.description}</p>
//                 <h1 className={`my-3 fw-bold ${plan.colorClass}`}>
//                   {getPriceLabel(plan.price, country)}
//                   <sub className="fs-6 text-white"> / 90 days</sub>
//                 </h1>
//                 <ul className="list-unstyled text-start mt-3 flex-grow-1">
//                   {plan.features.map((feature, idx) => (
//                     <li key={idx} className="mb-2">
//                       <i className="fa-solid fa-check me-2 text-light" />
//                       <span className="text-light">{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//                 <button
//                   className="btn mt-4 w-100 fw-bold bg-white text-dark border-0 blinking-btn"
//                   onClick={() => handleSelectPlan(plan.plan_id, country, plan.price)}
//                 >
//                   SELECT
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}

//         <div className="flash-sale-banner bg-danger text-white py-2 mb-3 overflow-hidden">
//           <div className="scrolling-text text-center fw-bold">
//             🎉 Flash Sale: Get 50% OFF on Premium Plans — Limited Time Offer! ⏳
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default React.memo(Plan);
