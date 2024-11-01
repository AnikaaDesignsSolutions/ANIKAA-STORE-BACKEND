import * as nodemailer from 'nodemailer';

// Async function to send OTP email
export const sendOtpEmail = async (email, otp) => {
  try {
    // Convert email to lowercase
    const lowerCaseEmail = email.toLowerCase();

    // Create a nodemailer transporter object
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_GMAIL_USER,
        pass: process.env.NODEMAILER_GMAIL_PASSWORD,
      },
    });

    // Define the email options for nodemailer
    const mailOptions = {
      from: process.env.NODEMAILER_GMAIL_USER,
      to: lowerCaseEmail,
      subject: 'Your OTP for Verification',
      html: `
        <div style="background-color: white; color: #000; padding: 50px;">
          <p style="margin-bottom: 20px; font-size: 20px;">
            Your OTP to reset password for Anikaa Store Account is: <strong>${otp}</strong>
          </p>
        </div>
      `,
    };

    // Send the email using nodemailer
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('OTP Email sent: ' + info.response);
      }
    });

  } catch (error) {
    // Logging any errors that occur during the process
    console.error("Error sending OTP email:", error);
  }
};
