import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `${config.email.fromName} <${config.email.from}>`,
      to: options.to,
      subject: options.subject,
      html: options.html || generateEmailTemplate(options.template, options.data),
      text: options.text || generateTextTemplate(options.template, options.data),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Generate HTML email template
const generateEmailTemplate = (template, data) => {
  const templates = {
    'email-verification': `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verify your SmartRecruit account</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SmartRecruit</h1>
            <p>Verify Your Account</p>
          </div>
          <div class="content">
            <h2>Hello ${data.firstName},</h2>
            <p>Thank you for registering with SmartRecruit! Please click the button below to verify your email address and activate your account.</p>
            <div style="text-align: center;">
              <a href="${data.verificationLink}" class="button">Verify Email Address</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>${data.verificationLink}</p>
            <p>This link will expire in 24 hours.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 SmartRecruit. All rights reserved.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    'password-reset': `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset your SmartRecruit password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SmartRecruit</h1>
            <p>Password Reset</p>
          </div>
          <div class="content">
            <h2>Hello ${data.firstName},</h2>
            <p>We received a request to reset your password for your SmartRecruit account. Click the button below to reset your password.</p>
            <div style="text-align: center;">
              <a href="${data.resetLink}" class="button">Reset Password</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>${data.resetLink}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 SmartRecruit. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return templates[template] || `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>SmartRecruit Notification</h2>
      <p>${JSON.stringify(data, null, 2)}</p>
    </div>
  `;
};

// Generate text email template
const generateTextTemplate = (template, data) => {
  const templates = {
    'email-verification': `
Hello ${data.firstName},

Thank you for registering with SmartRecruit! Please visit the link below to verify your email address and activate your account.

${data.verificationLink}

This link will expire in 24 hours.

If you didn't request this verification, please ignore this email.

© 2024 SmartRecruit. All rights reserved.
    `,
    'password-reset': `
Hello ${data.firstName},

We received a request to reset your password for your SmartRecruit account. Visit the link below to reset your password.

${data.resetLink}

This link will expire in 24 hours.

If you didn't request this password reset, please ignore this email or contact support if you have concerns.

© 2024 SmartRecruit. All rights reserved.
    `,
  };

  return templates[template] || `SmartRecruit Notification:\n${JSON.stringify(data, null, 2)}`;
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

export {
  sendEmail,
  testEmailConfig,
  createTransporter,
  generateEmailTemplate,
  generateTextTemplate,
};