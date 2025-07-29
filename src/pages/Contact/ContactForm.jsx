import React, { useState } from "react";
import "./ContactForm.scss";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import TopBar from "../../components/TopBar";
import Navbar from "../../components/Navbar";
import Offers from "../../components/Offers";
import Footer from "../../components/Footer";

const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

const ContactForm = () => {
  const initialFormData = {
    from_name: "",
    from_email: "",
    subject: "",
    message: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    // Set defaults for missing fields
    const data = {
      ...formData,
      from_name: formData.from_name || "Not provided",
      from_email: formData.from_email,
      subject: formData.subject || "Not provided",
    };

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, data, PUBLIC_KEY)
      .then(() => {
        console.log("SUCCESS!");
        // Reset form after successful submission
        setFormData(initialFormData);
        toast.success("Recived your message");
      })
      .catch((error) => {
        console.log("FAILED TO SEND MAIL...", error);
        toast.error("Failed to send message");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="ContactPage">
      <TopBar />
      <Navbar />
      <Offers />
      <main>
        <div className="title">Contact Us</div>
        <form className="contactForm" onSubmit={handleSubmit}>
          <fieldset id="nameField">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="from_name"
              id="name"
              value={formData.from_name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </fieldset>
          <fieldset id="emailField">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="from_email"
              id="email"
              required6
              value={formData.from_email}
              onChange={handleChange}
              placeholder="Your Email"
            />
          </fieldset>
          <fieldset id="subjectField">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              name="subject"
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter Subject"
            />
          </fieldset>
          <fieldset id="messageBox">
            <label htmlFor="message">Message</label>
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Write me a message"
            ></textarea>
          </fieldset>
          <button
            type="submit"
            id="submit"
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? "Loading..." : <>Submit </>}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ContactForm;
