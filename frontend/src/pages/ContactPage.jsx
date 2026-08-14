import React, { useState } from 'react';
import { apiBaseUrl, getContactDetails, whatsappUrl, SectionTitle, GoldIcon } from '../pageLibrary.jsx';



function ContactPage({ content }) {
  const contact = getContactDetails(content);
  const corporationAddress = contact.corporationAddress || contact.address;
  const registeredAddress = contact.registeredAddress || contact.address;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contacts = [
    ['Corporate Address', corporationAddress, 'location'],
    ['Register Address', registeredAddress, 'location'],
    ['Phone', `${contact.displayPhone}\nMon - Sat: 10 AM - 6 PM IST`, 'phone'],
    ['Email', `${contact.email}\n${contact.replyText}`, 'email'],
    ['Business Hours', contact.hours, 'clock'],
  ];
  const renderContactText = (title, text) => {
    if (title === 'Phone') {
      return <p><a href={`tel:${contact.phoneNumber}`}>{contact.displayPhone}</a><br />Mon - Sat: 10 AM - 6 PM IST</p>;
    }
    if (title === 'Email') {
      return <p><a href={`mailto:${contact.email}`}>{contact.email}</a><br />{contact.replyText}</p>;
    }
    return <p>{text}</p>;
  };

  const openContactCard = (title) => {
    if (title === 'Phone') {
      window.location.href = `tel:${contact.phoneNumber}`;
      return;
    }
    if (title === 'Email') {
      window.location.href = `mailto:${contact.email}`;
      return;
    }
    document.querySelector('.message-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleContactKeyDown = (event, title) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openContactCard(title);
  };

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus({ type: '', message: '' });

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setFormStatus({ type: 'error', message: 'Please fill all required fields.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setFormStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    if (formData.message.trim().length < 10) {
      setFormStatus({ type: 'error', message: 'Please enter a message with at least 10 characters.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/contact/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        throw new Error(result?.message || 'Unable to send message.');
      }
      setFormStatus({ type: 'success', message: result.message || 'Message sent successfully.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: 'Email service is not available right now. Please use WhatsApp or try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-block contact-page page-enter">
      <div className="container contact-grid">
        <div data-reveal>
          <h2 className="contact-heading">Contact Information</h2>
          <div className="contact-list">
            {contacts.map(([title, text, icon]) => (
              <article
                className="contact-card royal-text-card"
                key={title}
                role="button"
                tabIndex={0}
                onClick={() => openContactCard(title)}
                onKeyDown={(event) => handleContactKeyDown(event, title)}
              >
                <GoldIcon icon={icon} />
                <div>
                  <h3>{title}</h3>
                  <div className="card-small-line" aria-hidden="true" />
                  {renderContactText(title, text)}
                  <span className="explore-link">{title === 'Phone' ? 'Call Now' : title === 'Email' ? 'Send Email' : 'Open Form'} <b aria-hidden="true">-&gt;</b></span>
                </div>
              </article>
            ))}
          </div>
        </div>
        <form className="message-card" data-reveal onSubmit={handleSubmit}>
          <h2>{content.site.contactTitle}</h2>
          <p>{content.site.contactSubtitle}</p>
          <div className="form-two">
            <label>Your Name *<input required placeholder="Full name" value={formData.name} onChange={(event) => updateField('name', event.target.value)} /></label>
            <label>Email Address *<input required type="email" placeholder="your@email.com" value={formData.email} onChange={(event) => updateField('email', event.target.value)} /></label>
          </div>
          <label>Subject *<input required placeholder="What is your query about?" value={formData.subject} onChange={(event) => updateField('subject', event.target.value)} /></label>
          <label>Message *<textarea required rows="7" placeholder="Write your message here..." value={formData.message} onChange={(event) => updateField('message', event.target.value)} /></label>
          {formStatus.message && <p className={`form-status ${formStatus.type}`}>{formStatus.message}</p>}
          <div className="form-actions">
            <button className="gold-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send Message'}</button>
            <a className="dark-button inline-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">Enquire on WhatsApp</a>
          </div>
        </form>
      </div>
    </section>
  );
}



export default ContactPage;
export { ContactPage };

