import React, { useState } from 'react';
import './TermsAndConditions.css';

const termsData = [
  {
    title: "Introduction",
    content: "Welcome to MedInventory. By accessing or using our service, you agree to be bound by these terms and conditions. Please read them carefully before proceeding."
  },
  {
    title: "Use of Service",
    content: "You are responsible for any activity that occurs under your account. Ensure that your use complies with all applicable laws. Unauthorized use or abuse of our services will lead to immediate termination."
  },
  {
    title: "Account Responsibilities",
    content: "You must maintain the confidentiality of your account and password. Notify us immediately if there is any unauthorized use of your account. We are not responsible for any losses caused by unauthorized use of your account."
  },
  {
    title: "Limitations of Liability",
    content: "MedInventory will not be liable for any indirect, incidental, or consequential damages arising from your use of our services. We provide no warranties as to the performance or outcomes from using our software."
  },
  {
    title: "Modifications to Terms",
    content: "We reserve the right to modify these terms at any time. Continued use of the service implies acceptance of the modified terms. Please review this page periodically for updates."
  },
  {
    title: "Termination",
    content: "MedInventory may terminate your access if you breach these terms. Upon termination, your rights to use our services will cease immediately."
  },
];

const TermsAndConditions = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <div className="terms-container">
      <h1>Terms & Conditions</h1>
      <p>Please read our terms and conditions carefully before using MedInventory.</p>

      {termsData.map((section, index) => (
        <div
          key={index}
          className={`terms-section ${expandedSection === index ? 'expanded' : ''}`}
        >
          <h2 onClick={() => toggleSection(index)}>{section.title}</h2>
          {expandedSection === index && <p>{section.content}</p>}
        </div>
      ))}
    </div>
  );
};

export default TermsAndConditions;
