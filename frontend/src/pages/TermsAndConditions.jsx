import React from 'react';
import './StaticPages.css';

const TermsAndConditions = () => {
  return (
    <div className="static-page-container">
      <h1>Terms and Conditions</h1>
      <p>
        Welcome to TravelMate. By accessing and using our platform, you agree to comply with and be bound by the following terms and conditions:
      </p>
      <ul>
        <li><strong>Use of Services:</strong> You agree to use TravelMate solely for lawful purposes and in a manner that does not infringe the rights of others.</li>
        <li><strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account and password and for all activities that occur under your account.</li>
        <li><strong>Content Accuracy:</strong> While we strive to provide accurate and updated content, we do not guarantee the reliability, completeness, or timeliness of the information on our site.</li>
        <li><strong>Third-party Links:</strong> TravelMate may contain links to external websites. We are not responsible for the content or policies of these third-party sites.</li>
        <li><strong>Termination:</strong> We reserve the right to terminate or suspend access to our services at any time, without notice, for conduct that violates these terms.</li>
        <li><strong>Modifications:</strong> TravelMate reserves the right to modify these terms at any time. Continued use of the site signifies your acceptance of any changes.</li>
      </ul>
      <p>
        If you have any questions regarding these terms, feel free to contact us at <strong>support@travelmate.com</strong>.
      </p>
    </div>
  );
};

export default TermsAndConditions;
