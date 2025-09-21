import React from 'react';
import './plan.css';
import { motion } from 'framer-motion';
import axios from "axios";


interface Plan {
  name: string;
  description: string;
  price: number; // base USD
  features: string[];
  colorClass: string;
  plan_id:any
}

const plans: Plan[] = [
  { 
    plan_id : 1,
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
  },
  {
     plan_id : 2,
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
  },
  { 
    plan_id : 3,
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
const getFinalPriceNumber = (priceUSD: number, country?: string): number => {
  switch (country?.toLowerCase()) {
    case 'india': return priceUSD * 194;
    case 'canada': return priceUSD * 1.35;
    case 'australia': return priceUSD * 1.5;
    case 'malaysia': return priceUSD * 25;
    case 'brunei': return priceUSD * 30;
    case 'mauritius': return priceUSD * 250;
    case 'philippine':
    case 'philippines': return priceUSD * 200;
    case 'israel': return priceUSD * 50;
    case 'sri lanka': return priceUSD * 600;
    case 'sweeden':
    case 'sweden': return priceUSD * 100;
    case 'fiji': return priceUSD * 15;
    case 'slomon island':
    case 'solomon island': return priceUSD * 25;
    case 'barbados': return priceUSD * 25;
    case 'saint lucia': return priceUSD * 25;
    case 'zambia': return priceUSD * 100;
    case 'botswana': return priceUSD * 100;
    case 'egypt': return priceUSD * 200;
    case 'mexico': return priceUSD * 100;
    case 'thailand': return priceUSD * 100;
    case 'colombia': return priceUSD * 25;
    case 'ghana': return priceUSD * 75;
    case 'norway': return priceUSD * 75;
    default: return priceUSD;
  }
};

// {
//   "user_id": "1",
//   "plan_id": "1",
//   "country": "india",
//   "currency": "INR",
//   "amount": 1,
//   "receipt": "receipt_india_001"
// }

// ✅ Handle plan selection
// const handleSelectPlan = (planName: string, country?: string, priceUSD?: number) => {
//   const finalPrice = getFinalPriceNumber(priceUSD || 1, country);
//   const payload = {
//     country: country ?? 'Not selected',
//     plan_id: planName,
//     amount: finalPrice,
//     receipt : "BAJOL MATRIMONY",
//     currency : 'INR',
//     user_id : 11
//   };
//   console.log('Selected Plan Payload:', payload);
// };

// const handleSelectPlan = async (planName: string, country?: string, priceUSD?: number) => {
//   const finalPrice = getFinalPriceNumber(priceUSD || 1, country);

//   const payload = {
//     country: country ?? 'Not selected',
//     plan_id: planName,
//     amount: finalPrice,
//     receipt: "BAJOL MATRIMONY",
//     currency: 'INR',
//     user_id: 11
//   };

//   try {
//     const response = await axios.post('https://usrapi.bajolmatrimony.com/razorpay/create-subscription-order', payload);
//     console.log('API Response:', response.data);
   
//     openRazorpayCheckout(response?.data);
//   } catch (error: any) {
//     console.error('API Error:', error.response?.data || error.message);
//   }
// };

// // Razorpay Checkout function
// const openRazorpayCheckout = (orderData: any) => {
//   const options = {
//     key: orderData.key,
//     subscription_id: orderData.subscription_id,
//     amount: orderData.amount,
//     currency: orderData.currency,
//     name: "BAJOL MATRIMONY",
//     description: "Subscription Payment",
//     order_id: orderData.id,
//     handler: function (response: any) {
//       console.log('Payment Success:', response);
//       alert("Payment Successful!");
//     },
//     modal: {
//       ondismiss: function () {
//         console.log('Checkout closed by user');
//       }
//     },
//     theme: {
//       color: "#4CAF50"
//     }
//   };

//   const rzp = new (window as any).Razorpay(options);
//   rzp.open();
// };

const handleSelectPlan = async (planName: string, country?: string, priceUSD?: number) => {
  const finalPrice = getFinalPriceNumber(priceUSD || 1, country);

  const payload = {
    country: country ?? 'Not selected',
    plan_id: planName,
    amount: finalPrice,
    receipt: "BAJOL MATRIMONY",
    currency: 'INR',
    user_id: 11
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
const openRazorpayCheckout = (orderData: any) => {
  const options = {
    key: "YOUR_RAZORPAY_KEY_ID", // Put your Razorpay key here
    amount: orderData.amount, // in paise (e.g., 19400 = ₹194)
    currency: orderData.currency,
    name: "BAJOL MATRIMONY",
    description: "Subscription Payment",
    order_id: orderData.id, // Order ID from backend
    handler: function (response: any) {
      // Called on successful payment
      console.log('Payment Success:', response);
      alert("Payment Successful!");
    },
    modal: {
      ondismiss: function () {
        console.log('Checkout closed by user');
      }
    },
    theme: {
      color: "#4CAF50"
    }
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
};



const Plan: React.FC<PlanProps> = ({ country }) => {
  return (
    <section className="pricing-plans container py-5">
      <div className="row justify-content-center g-4">
        <motion.p
          className="mt-3 text-center pro_text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ y: [0, -10, 0], opacity: [1, 0.8, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
        >
          🚀 Unlock your matches by upgrading your plan! 💖✨
        </motion.p>

        {plans.map((plan, index) => (
          <div key={index} className="col-md-6 col-lg-4">
            <div className="card h-100 bg-primary shadow pricing-card border-dark text-center position-relative">
              <div className="card-body d-flex flex-column">
                <h4 className={`fw-normal ${plan.colorClass}`}>{plan.name}</h4>
                <p className="text-white small">{plan.description}</p>
                <h1 className={`my-3 fw-bold ${plan.colorClass}`}>
                  {getPriceLabel(plan.price, country)}
                  <sub className="fs-6 text-white"> / 90 days</sub>
                </h1>
                <ul className="list-unstyled text-start mt-3 flex-grow-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="mb-2">
                      <i className="fa-solid fa-check me-2 text-light" />
                      <span className="text-light">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="btn mt-4 w-100 fw-bold bg-success text-white border-0"
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



// const handleSelectPlan = async (planName: string, country?: string, priceUSD?: number) => {
//   try {
//     const finalPrice = getFinalPriceNumber(priceUSD || 1, country);

//     // Step 1: Create order on backend
//     const { data: order } = await axios.post("http://localhost:3002/razorpay/create-subscription-order", {
//       amount: finalPrice,
//       currency: "INR", // 🔹 you can make this dynamic based on country
//     });

//     // Step 2: Open Razorpay checkout
//     const options = {
//       key: "YOUR_RAZORPAY_KEY_ID", // 🔹 Replace with your Razorpay Test Key
//       amount: order.amount,
//       currency: order.currency,
//       name: "Bajol Matrimony",
//       description: `${planName} Plan Subscription`,
//       order_id: order.id,
//       handler: async function (response: any) {
//         // Step 3: Verify payment with backend
//         const verifyRes = await axios.post("http://localhost:3002/razorpay/create-subscription-order", response);
//         if (verifyRes.data.success) {
//           alert("✅ Payment Successful! Plan Activated");
//           console.log({
//             country: country ?? "Not selected",
//             plan: planName,
//             price: finalPrice,
//           });
//         } else {
//           alert("❌ Payment Verification Failed");
//         }
//       },
//       prefill: {
//         name: "User Name",
//         email: "user@example.com",
//         contact: "9876543210",
//       },
//       theme: {
//         color: "#0d6efd",
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   } catch (error) {
//     console.error("Payment Error:", error);
//   }
// };