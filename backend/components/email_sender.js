require('dotenv').config();

/**
 * Sends an email via Brevo's HTTPS transactional email API (port 443).
 * Render's free tier blocks outbound SMTP ports (25/465/587) entirely, so
 * SMTP (nodemailer) can never work there — this goes over plain HTTPS instead,
 * which can't be blocked without breaking the whole platform.
 *
 * @param {string} senderEmail - Sender's email address (must be a verified sender in Brevo)
 * @param {string} _unusedSenderPassword - Kept for call-site compatibility; Brevo auth uses BREVO_API_KEY instead
 * @param {string} recipientEmail - Recipient's email address
 * @param {string} subject - Subject of the email
 * @param {string} message - Body of the email
 */
async function sendEmailSMTP(senderEmail, _unusedSenderPassword, recipientEmail, subject, message) {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: 'Grab&Go' },
        to: [{ email: recipientEmail }],
        subject: subject || 'No Subject',
        textContent: message || 'No Message Provided'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error sending email:', data);
      return { success: false, message: data.message || 'Failed to send email' };
    }

    console.log('Email sent, Brevo messageId:', data.messageId);
    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    console.error('Error sending email:', error.message);
    return { success: false, message: error.message };
  }
}

module.exports = { sendEmailSMTP };
