import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email templates
const templates = {
  'email-verification': {
    subject: 'Verify your SmartRecruit account',
    htmlTemplate: path.join(__dirname, '../templates/emails/verify-email.ejs')
  },
  'password-reset': {
    subject: 'Reset your SmartRecruit password',
    htmlTemplate: path.join(__dirname, '../templates/emails/password-reset.ejs')
  },
  'webinar-confirmation': {
    subject: '🎉 Webinar registration confirmed!',
    htmlTemplate: path.join(__dirname, '../templates/emails/webinar-confirmation.ejs')
  },
  'webinar-reminder-24h': {
    subject: '⏰ Reminder: Your webinar is tomorrow!',
    htmlTemplate: path.join(__dirname, '../templates/emails/webinar-reminder-24h.ejs')
  },
  'webinar-reminder-1h': {
    subject: '🚀 Webinar starts in 1 hour!',
    htmlTemplate: path.join(__dirname, '../templates/emails/webinar-reminder-1h.ejs')
  },
  'application-status': {
    subject: '📋 Update on your job application',
    htmlTemplate: path.join(__dirname, '../templates/emails/application-status.ejs')
  }
};

const sendEmail = async ({ to, subject, template, data = {}, cc = [], bcc = [] }) => {
  try {
    // Load and compile template
    const templateConfig = templates[template];
    if (!templateConfig) {
      throw new Error(`Template ${template} not found`);
    }

    const html = await ejs.renderFile(templateConfig.htmlTemplate, {
      ...data,
      appUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      supportEmail: process.env.SUPPORT_EMAIL || 'support@smartrecruit.com'
    });

    // Send email
    const mailOptions = {
      from: `"SmartRecruit" <${process.env.SMTP_USER}>`,
      to,
      cc,
      bcc,
      subject: templateConfig.subject || subject,
      html,
      headers: {
        'X-SmartRecruit-Template': template
      }
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email send failed:', error);
    throw error;
  }
};

// Test email connection
const testConnection = async () => {
  try {
    await transporter.verify();
    console.log('SMTP server ready');
    return true;
  } catch (error) {
    console.error('SMTP server not ready:', error);
    return false;
  }
};

export { sendEmail, testConnection };

