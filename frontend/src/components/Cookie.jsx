import React from 'react';

const CookiePolicy = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl text-gray-800">
      <h1 className="text-4xl text-blue-500 font-bold mb-6 text-center">Cookie Policy</h1>
      <p className="text-sm text-center text-gray-500 mb-10">Last updated: August 3, 2025</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">1. What are Cookies?</h2>
        <p className="text-lg leading-relaxed">
          Cookies are small text files stored on your device when you visit a website. They are used to make websites work more efficiently and to provide information to the site owners.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">2. How We Use Cookies</h2>
        <p className="text-lg leading-relaxed">
          We use cookies for a variety of reasons, including:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>**Functionality:** To remember your preferences and settings, like your login details.</li>
            <li>**Performance & Analytics:** To understand how visitors use our website and to improve our services.</li>
            <li>**Security:** To protect our website and our users from malicious activity.</li>
          </ul>
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">3. Types of Cookies We Use</h2>
        <p className="text-lg leading-relaxed">
          We use strictly necessary cookies, performance cookies, and functionality cookies to ensure our website operates smoothly and provides a personalized experience.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">4. Your Choices Regarding Cookies</h2>
        <p className="text-lg leading-relaxed">
          You have the ability to manage or disable cookies through your web browser settings. Please be aware that blocking cookies may affect the functionality of our website.
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-3">6. Contact Us</h2>
        <p className="text-lg leading-relaxed">
          If you have any questions about this Cookie Policy, please contact us at <a href="mailto:thequietplace.contact@gmail.com" className="text-blue-600 hover:underline">thequietplace.contact@gmail.com</a>.
        </p>
      </section>
    </div>
  );
};

export default CookiePolicy;