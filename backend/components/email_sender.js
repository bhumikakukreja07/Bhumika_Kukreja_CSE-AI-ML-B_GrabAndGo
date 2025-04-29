const nodemailer = require('nodemailer');

/**
 * Sends an email using SMTP
 * @param {string} senderEmail - Sender's email address
 * @param {string} senderPassword - Sender's email password or app-specific secure key
 * @param {string} recipientEmail - Recipient's email address
 * @param {string} subject - Subject of the email
 * @param {string} message - Body of the email
 */
async function sendEmailSMTP(senderEmail, senderPassword, recipientEmail, subject, message) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: senderPassword,
      },
    });

    const mailOptions = {
      from: senderEmail,
      to: recipientEmail,
      subject: subject || "No Subject",
      text: message || "No Message Provided",
    };

    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    console.error('Error sending email:', error.message);
    return { success: false, message: error.message };
  }
}

module.exports = { sendEmailSMTP };