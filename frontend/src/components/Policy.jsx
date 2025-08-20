import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl text-gray-800">
      <h1 className="text-4xl  text-blue-500 font-bold mb-6 text-center">Privacy Policy</h1>
      <p className="text-sm text-center text-gray-500 mb-10">Last updated: June 26, 2025</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
        <p className="text-lg leading-relaxed">
          We may collect personal information that you voluntarily provide to us, such as your name, email address, and any other information you choose to provide when you use our services. We may also collect non-personal information, such as your IP address, browser type, and usage data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
        <p className="text-lg leading-relaxed">
          We use the information we collect to: provide, operate, and maintain our services; improve, personalize, and expand our services; and communicate with you for customer service, updates, and marketing.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">3. Sharing Your Information</h2>
        <p className="text-lg leading-relaxed">
          We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website or conducting our business. We may also release your information when required by law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
        <p className="text-lg leading-relaxed">
          We use administrative, technical, and physical security measures to help protect your personal information. Please be aware that no security measures are perfect or impenetrable.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
        <p className="text-lg leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:thequietplace.contact@gmail.com" className="text-blue-600 hover:underline">thequietplace.contact@gmail.com</a>.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;