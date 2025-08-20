import React, { useContext, useRef } from 'react';
import emailjs from '@emailjs/browser'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext';

const ContactUs = () => {
  const { service_id, template_id, public_key } = useContext(AppContext)
  const form = useRef()

  const sendEmail = (e) => {
    e.preventDefault();

    try {
      emailjs.sendForm(service_id, template_id, form.current, public_key)
      toast.success('Message sent')
      form.current.reset()
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    };
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-2xl mt-15">
      <h2 className="text-2xl text-blue-500 font-bold mb-6">Contact Us</h2>
      <form ref={form} onSubmit={sendEmail} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <select
          name="subject"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="" disabled selected>Select a subject</option>
          <option value="Counsellor Registration">Counsellor Registration</option>
          <option value="Complaints and Reports">Complaints and Reports</option>
          <option value="Others">Others</option>
        </select>

        <textarea
          name="message"
          placeholder="Your Message"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 h-32"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
