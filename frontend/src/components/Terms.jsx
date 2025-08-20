import React from 'react';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl text-gray-800">
      <h1 className="text-4xl text-blue-500 font-bold mb-6 text-center">Terms of Service</h1>
      <p className="text-sm text-center text-gray-500 mb-10">Last updated: August 3, 2025</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p className="text-lg leading-relaxed">
          By accessing and using our service, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">2. Use of Service</h2>
        <p className="text-lg leading-relaxed">
          You agree to use the service only for purposes that are permitted by these Terms and any applicable law. You are responsible for all your activity in connection with the service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">3. Intellectual Property</h2>
        <p className="text-lg leading-relaxed">
          The service and its original content, features, and functionality are and will remain the exclusive property of Quiet Place and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Quiet Place.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">4. User Content</h2>
        <p className="text-lg leading-relaxed">
          Any content you submit to our service remains yours, but you grant Quiet Place a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such content in connection with the service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">5. Termination</h2>
        <p className="text-lg leading-relaxed">
          We may terminate or suspend your access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">6. Disclaimer of Warranties</h2>
        <p className="text-lg leading-relaxed">
          The service is provided on an "AS IS" and "AS AVAILABLE" basis. Quiet Place makes no warranties, expressed or implied, and hereby disclaims all other warranties.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">7. Limitation of Liability</h2>
        <p className="text-lg leading-relaxed">
          In no event shall Quiet Place, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">8. Governing Law</h2>
        <p className="text-lg leading-relaxed">
          These Terms shall be governed and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">9. Changes to Terms</h2>
        <p className="text-lg leading-relaxed">
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">10. Contact Us</h2>
        <p className="text-lg leading-relaxed">
          If you have any questions about these Terms, please contact us at <a href="mailto:thequietplace.contact@gmail.com" className="text-blue-600 hover:underline">thequietplace.contact@gmail.com</a>.
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;