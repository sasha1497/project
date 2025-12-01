import { useEffect, useState } from "react";
import Banner from "../banner/banner";
import "./section.css";
import { motion } from "framer-motion";
import Couples from "../couples/couples";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { load } from '@cashfreepayments/cashfree-js'





const Section = () => {

  const [cashfree, setCashfree] = useState<any>(null);
  const [orderId, setOrderId] = useState("");

  const navigate = useNavigate(); // initialize it

  const handleClick = (flag: number) => {
    navigate("/signup", { state: { flag } });
  };

  useEffect(() => {
    (async () => {
      const cf = await load({ mode: "production" }); // initialize SDK here
      setCashfree(cf);
      console.log("Cashfree SDK Loaded ✔");
    })();
  }, []);

  

  const getSessionId = async () => {
  try {
    const res = await axios.post("https://usrapi.bajolmatrimony.com/cashfree/create-subscription-order", {
      order_id: "order_123456788",
      order_amount: 1000,
      order_currency: "INR",
      user_id: 5,
      plan_id: 1,
      order_note: "Monthly Subscription Payment",
      customer_id: "2",
      customer_phone: "9999997998",
      order_meta: {
        return_url: "https://app.bajolmatrimony.com/payment/callback"
      }
    });

    console.log("Order Response:", res.data);

    setOrderId(res.data.order_id);

    // 🔥 Correct session extraction
    return res.data.cashfree_order.payment_session_id;
  } catch (err) {
    console.log("Session Error:", err);
  }
};


const handlePayment = async () => {
  if (!cashfree) {
    alert("❌ Cashfree SDK not ready!");
    return;
  }

  const sessionId = await getSessionId();
  console.log("SESSION:", sessionId);

  if (!sessionId) {
    alert("❌ No Session ID received from backend");
    return;
  }

  await cashfree.checkout({
    paymentSessionId: sessionId,  // YES 🔥
    redirectTarget: "_modal",     // modal view
  });

  console.log("Payment window opened...");
};




  return (
    <div>
      {/* <button onClick={handlePayment}>
        Pay ₹499
      </button> */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hero-section"
      >
        <div className="container-fluid">
          <div className="row justify-content-md-center align-items-center">
            <div className="col-12 col-md-11 col-lg-9 col-xl-8 col-xxl-7">

              <motion.div
                className="text-center mb-5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="fw-semibold text-light mb-3 blink-text fs-larger">
                  Are you already registered ?
                </p>

                <div className="d-flex justify-content-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 fw-bold shadow-sm rounded-pill cursor-pointer bg-white"
                    onClick={() => handleClick(1)}
                  >
                    ✅ Yes
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className=" px-4 py-2 fw-bold shadow-sm rounded-pill cursor-pointer bg-white"
                    onClick={() => handleClick(2)}
                  >
                    🚀 No
                  </motion.button>
                </div>
              </motion.div>

              <motion.h2
                className="hero-title"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <p>💍 <span className="text-danger white-shadow-text">Dream</span> of <span className="text-danger white-shadow-text">Marriage</span></p>
              </motion.h2>
              <motion.p
                className="hero-subtext"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <span className="hero-subtext-inner">
                  There are three ways to a happy marriage: The first way is to be kind. The second way is to be kind. The third way is to be kind.              </span>
              </motion.p>
              <motion.div
                className="hero-btn-wrapper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                {/* <motion.button
                  type="button"
                  className="btn bsb-btn-2xl btn-outline-light"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
                  onClick={() => navigate("/signup")}
                >
                  🎉 Register Now
                </motion.button> */}

              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
      <div>
        {/* <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-sm-6 col-lg-3">Box 1</div>
            <div className="col-12 col-sm-6 col-lg-3">Box 2</div>
            <div className="col-12 col-sm-6 col-lg-3">Box 3</div>
          </div>
        </div>
      </div> */}
        <Couples />
        <Banner />
      </div>
    </div>
  );
};

export default Section;
