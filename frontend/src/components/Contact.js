// import React from 'react';
// import '../styles/Contact.css';

// function Contact() {
//   return (
//     <div className="contact-page">
//       <h2>Contact Us</h2>
//       <p>
//         If you have any questions, feedback, or suggestions, please feel free to
//         reach out to us. We value your input and are always looking for ways to
//         improve our service.
//       </p>
//       <p>
//         You can contact us via email at: <a href="mailto:info@healthyfoodchecker.com">info@healthyfoodchecker.com</a>
//       </p>
//       <p>
//         We aim to respond to all inquiries within 24-48 hours. Thank you for
//         using Healthy Food Checker!
//       </p>
//     </div>
//   );
// }

// export default Contact;
import React, { useState } from 'react';
import '../styles/Contact.css';

function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Here you would typically send the form data to a server
        // For this example, we will just simulate the submission
        setSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <div className="contact-page">
            <h2>Contact Us</h2>
            {submitted ? (
                <div className="submission-message">
                    <p>Thank you for your message! We will get back to you soon.</p>
                </div>
            ) : (
                <>
                    <p>
                        If you have any questions, feedback, or suggestions, please feel free to
                        reach out to us. We value your input and are always looking for ways to
                        improve our service.
                    </p>
                    <p>
                        You can also contact us via email at: <a href="mailto:abhishekg272004@gmail.com">abhishekg272004@gmail.com</a>
                    </p>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Your Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                </>
            )}
        </div>
    );
}

export default Contact;
