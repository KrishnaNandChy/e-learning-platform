const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send email
const sendEmail = async (options) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email send failed: ${error.message}`);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  verification: (name, verificationUrl) => ({
    subject: 'Verify Your Email - EduPlatform',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📚 EduPlatform</h1>
            <p>Your Journey to Knowledge Begins Here</p>
          </div>
          <div class="content">
            <h2>Hello ${name}! 👋</h2>
            <p>Welcome to EduPlatform! We're excited to have you on board.</p>
            <p>Please verify your email address by clicking the button below:</p>
            <center>
              <a href="${verificationUrl}" class="button">Verify Email</a>
            </center>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} EduPlatform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hello ${name}, Welcome to EduPlatform! Please verify your email by visiting: ${verificationUrl}`
  }),

  passwordReset: (name, resetUrl) => ({
    subject: 'Password Reset Request - EduPlatform',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <center>
              <a href="${resetUrl}" class="button">Reset Password</a>
            </center>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} EduPlatform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hello ${name}, Reset your password by visiting: ${resetUrl}`
  }),

  enrollmentConfirmation: (name, courseName, instructorName) => ({
    subject: `🎉 You're Enrolled in ${courseName}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Enrollment Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Congratulations ${name}! 🎉</h2>
            <p>You've successfully enrolled in:</p>
            <h3 style="color: #11998e;">${courseName}</h3>
            <p>Instructor: <strong>${instructorName}</strong></p>
            <center>
              <a href="${process.env.FRONTEND_URL}/my-courses" class="button">Start Learning</a>
            </center>
            <p>Happy Learning! 📚</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} EduPlatform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Congratulations ${name}! You've enrolled in ${courseName} by ${instructorName}. Start learning now!`
  }),

  certificateReady: (name, courseName, certificateUrl) => ({
    subject: `🏆 Your Certificate is Ready - ${courseName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏆 Certificate Earned!</h1>
          </div>
          <div class="content">
            <h2>Amazing work, ${name}! 🎉</h2>
            <p>You've successfully completed:</p>
            <h3 style="color: #f5576c;">${courseName}</h3>
            <p>Your certificate of completion is ready for download!</p>
            <center>
              <a href="${certificateUrl}" class="button">Download Certificate</a>
            </center>
            <p>Share your achievement with the world! 🌟</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} EduPlatform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Congratulations ${name}! You've completed ${courseName}. Download your certificate at: ${certificateUrl}`
  }),

  doubtReply: (studentName, courseName, lessonName, instructorName) => ({
    subject: `Your doubt has been answered - ${courseName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 Doubt Answered!</h1>
          </div>
          <div class="content">
            <h2>Hello ${studentName},</h2>
            <p>Your doubt in <strong>${lessonName}</strong> (${courseName}) has been answered by <strong>${instructorName}</strong>.</p>
            <center>
              <a href="${process.env.FRONTEND_URL}/my-doubts" class="button">View Response</a>
            </center>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} EduPlatform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hello ${studentName}, Your doubt in ${lessonName} has been answered by ${instructorName}.`
  }),

  instructorAccountCreated: (name, email, tempPassword) => ({
    subject: 'Welcome to EduPlatform - Instructor Account Created',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .credentials { background: #fff; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #ddd; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Welcome, Instructor!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Your instructor account has been created on EduPlatform! You can now create and manage courses.</p>
            <div class="credentials">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Temporary Password:</strong> ${tempPassword}</p>
            </div>
            <p style="color: #e74c3c;"><strong>Important:</strong> Please change your password immediately after logging in.</p>
            <center>
              <a href="${process.env.FRONTEND_URL}/instructor/login" class="button">Login Now</a>
            </center>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} EduPlatform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hello ${name}, Your instructor account has been created. Email: ${email}, Temporary Password: ${tempPassword}. Please change your password after logging in.`
  })
};

module.exports = { sendEmail, emailTemplates };
