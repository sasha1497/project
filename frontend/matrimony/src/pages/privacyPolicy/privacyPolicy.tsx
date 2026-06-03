import { useNavigate } from 'react-router-dom';
import './privacyPolicy.css';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <main className="privacy-policy-page">
      <section className="privacy-policy-card">
        <h1>Privacy Policy - Bajol Matrimony</h1>
        <p>
          Welcome to Bajol Matrimony, We value your privacy and are committed to protecting your personal information.
        </p>
        <p>
          This Privacy Policy explains how Bajol Matrimony collects, uses, stores, and protects your information when you use our mobile application and services.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We may collect the following information when you use Bajol Matrimony:</p>

        <h3>Personal Information</h3>
        <ul>
          <li>Name</li>
          <li>Age and gender</li>
          <li>Phone number</li>
          <li>WhatsApp number</li>
          <li>Email address, if applicable</li>
          <li>Profile information and preferences</li>
          <li>Profile photos uploaded by users</li>
        </ul>

        <h3>Usage Information</h3>
        <ul>
          <li>Device information</li>
          <li>App usage activity</li>
          <li>Login and authentication details</li>
          <li>Error logs and analytics for improving app performance</li>
        </ul>

        <h3>Payment Information</h3>
        <p>
          When payments are processed through third-party providers such as Cashfree, payment-related information may be collected and securely handled by those providers. We do not store sensitive payment information such as card details.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Create and manage user accounts</li>
          <li>Match and connect matrimony profiles</li>
          <li>Display profile information to other users based on app functionality</li>
          <li>Enable communication and contact sharing features</li>
          <li>Process payments and premium services</li>
          <li>Improve app performance, security, and user experience</li>
          <li>Prevent fraud, abuse, or misuse of the platform</li>
        </ul>

        <h2>3. Profile Visibility</h2>
        <p>
          Information you provide in your profile, including name, age, photos, and preferences, may be visible to other users of Bajol Matrimony as part of the matchmaking experience.
        </p>
        <p>Users should avoid sharing sensitive personal information publicly in profile descriptions.</p>

        <h2>4. Data Sharing</h2>
        <p>We do not sell personal information.</p>
        <p>We may share information only in the following cases:</p>
        <ul>
          <li>With trusted service providers required to operate the app</li>
          <li>With payment partners for secure payment processing</li>
          <li>When required by law or legal obligations</li>
          <li>To protect users, prevent fraud, or enforce policies</li>
        </ul>

        <h2>5. Data Security</h2>
        <p>
          We take reasonable technical and organizational measures to protect user information against unauthorized access, misuse, loss, or disclosure.
        </p>
        <p>However, no internet-based system is completely secure, and we cannot guarantee absolute security.</p>

        <h2>6. Data Retention</h2>
        <p>We retain user information as long as necessary to provide our services or comply with legal obligations.</p>
        <p>Users may request account deletion by contacting us.</p>

        <h2>7. Children's Privacy</h2>
        <p>Bajol Matrimony is intended only for adults, 18 years and older. We do not knowingly collect information from children.</p>

        <h2>8. Your Rights</h2>
        <p>You may:</p>
        <ul>
          <li>Update your profile information</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your account and associated data</li>
        </ul>
        <p>For privacy-related requests, contact us using the information below.</p>

        <h2>9. Third-Party Services</h2>
        <p>Our app may use third-party services including:</p>
        <ul>
          <li>Payment providers, such as Cashfree</li>
          <li>Hosting services</li>
          <li>Authentication or analytics services</li>
        </ul>
        <p>These providers may process information according to their own privacy policies.</p>

        <h2>10. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy periodically. Changes will be reflected on this page with an updated effective date.</p>

        <h2>11. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy or your data, contact us:</p>
        <address>
          <strong>Bajol Matrimony</strong><br />
          Email: <a href="mailto:bajolonlinematrimony@gmail.com">bajolonlinematrimony@gmail.com</a><br />
        </address>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate('/profile')}
        >
          Back
        </button>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
