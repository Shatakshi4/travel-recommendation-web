import React from 'react';
import './StaticPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="static-page-container">
      <h1>Privacy Policy</h1>
      <p>
        At TravelMate, your privacy is our priority. We ensure all your personal data is handled securely and transparently.
      </p>
      <ul>
        <li>We collect only necessary information to enhance your travel experience.</li>
        <li>We do not sell your personal data to third parties.</li>
        <li>We use cookies to personalize your browsing experience.</li>
        <li>All data is encrypted and securely stored.</li>
      </ul>
      <p>
        By using our services, you agree to this privacy policy. For any concerns, contact us at support@travelmate.com.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
