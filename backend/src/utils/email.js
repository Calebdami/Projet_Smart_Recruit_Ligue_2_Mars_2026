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
const sendEmail = async (emailData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${config.email.fromName} <${config.email.from}>`,
      to: Array.isArray(emailData.to) ? emailData.to.join(', ') : emailData.to,
      subject: emailData.subject,
      html: await generateEmailContent(emailData.template, emailData.data),
      attachments: emailData.attachments?.map(att => ({
        filename: att.filename,
        path: att.path,
        contentType: att.contentType,
      })),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

// Generate email content from template
const generateEmailContent = async (template, data) => {
  const templates = {
    'email-verification': (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verify your SmartRecruit account</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SmartRecruit</h1>
          </div>
          <div class="content">
            <h2>Welcome to SmartRecruit, ${data.firstName}!</h2>
            <p>Thank you for creating an account. To complete your registration, please verify your email address by clicking the button below:</p>
            <a href="${data.verificationLink}" class="button">Verify Email Address</a>
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p>${data.verificationLink}</p>
            <p>This link will expire in 24 hours.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 SmartRecruit. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    
    'password-reset': (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset your SmartRecruit password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SmartRecruit</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hi ${data.firstName},</p>
            <p>We received a request to reset your password for your SmartRecruit account. Click the button below to reset your password:</p>
            <a href="${data.resetLink}" class="button">Reset Password</a>
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p>${data.resetLink}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 SmartRecruit. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    
    'application-received': (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Application Received - SmartRecruit</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .job-info { background: white; padding: 15px; border-radius: 4px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SmartRecruit</h1>
          </div>
          <div class="content">
            <h2>Application Received!</h2>
            <p>Hi ${data.candidateName},</p>
            <p>Thank you for your interest in the <strong>${data.jobTitle}</strong> position at ${data.companyName}.</p>
            <div class="job-info">
              <h3>Position Details:</h3>
              <p><strong>Job Title:</strong> ${data.jobTitle}</p>
              <p><strong>Department:</strong> ${data.department || 'N/A'}</p>
              <p><strong>Location:</strong> ${data.location || 'N/A'}</p>
              <p><strong>Application Date:</strong> ${data.applicationDate}</p>
            </div>
            <p>Your application has been successfully submitted and is now under review. Our team will carefully evaluate your qualifications and will get back to you soon.</p>
            <p>You can track the status of your application by logging into your SmartRecruit dashboard.</p>
            <p>Good luck!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 SmartRecruit. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    
    'interview-scheduled': (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Interview Scheduled - SmartRecruit</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .interview-info { background: white; padding: 15px; border-radius: 4px; margin: 15px 0; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SmartRecruit</h1>
          </div>
          <div class="content">
            <h2>Interview Scheduled!</h2>
            <p>Hi ${data.candidateName},</p>
            <p>Congratulations! We'd like to invite you for an interview for the <strong>${data.jobTitle}</strong> position.</p>
            <div class="interview-info">
              <h3>Interview Details:</h3>
              <p><strong>Date:</strong> ${data.interviewDate}</p>
              <p><strong>Time:</strong> ${data.interviewTime}</p>
              <p><strong>Duration:</strong> ${data.duration}</p>
              <p><strong>Type:</strong> ${data.interviewType}</p>
              <p><strong>Interviewer:</strong> ${data.interviewerName}</p>
              ${data.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${data.meetingLink}">Join Interview</a></p>` : ''}
            </div>
            <p>Please prepare for the interview by reviewing the job requirements and your experience. The interview will cover your background, skills, and how they align with the position requirements.</p>
            ${data.calendarInvite ? `<a href="${data.calendarInvite}" class="button">Add to Calendar</a>` : ''}
            <p>If you need to reschedule or have any questions, please reply to this email.</p>
            <p>We look forward to speaking with you!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 SmartRecruit. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    
    'webinar-reminder': (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Webinar Reminder - SmartRecruit</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .webinar-info { background: white; padding: 15px; border-radius: 4px; margin: 15px 0; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SmartRecruit</h1>
          </div>
          <div class="content">
            <h2>Webinar Reminder</h2>
            <p>Hi ${data.firstName},</p>
            <p>This is a friendly reminder that you're registered for our upcoming webinar:</p>
            <div class="webinar-info">
              <h3>${data.webinarTitle}</h3>
              <p><strong>Date:</strong> ${data.webinarDate}</p>
              <p><strong>Time:</strong> ${data.webinarTime}</p>
              <p><strong>Duration:</strong> ${data.duration} minutes</p>
              ${data.speakers ? `<p><strong>Speakers:</strong> ${data.speakers}</p>` : ''}
            </div>
            <p>The webinar will start in ${data.timeUntilWebinar}. Make sure you have a stable internet connection and your microphone ready if you plan to participate.</p>
            ${data.joinLink ? `<a href="${data.joinLink}" class="button">Join Webinar</a>` : ''}
            <p>If you can no longer attend, please let us know by replying to this email.</p>
            <p>We look forward to seeing you there!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 SmartRecruit. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    
    'offer-made': (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Job Offer - SmartRecruit</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .offer-info { background: white; padding: 15px; border-radius: 4px; margin: 15px 0; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SmartRecruit</h1>
          </div>
          <div class="content">
            <h2>🎉 Congratulations! Job Offer</h2>
            <p>Hi ${data.candidateName},</p>
            <p>We're thrilled to offer you the position of <strong>${data.jobTitle}</strong> at ${data.companyName}!</p>
            <div class="offer-info">
              <h3>Offer Details:</h3>
              <p><strong>Position:</strong> ${data.jobTitle}</p>
              <p><strong>Department:</strong> ${data.department}</p>
              <p><strong>Start Date:</strong> ${data.startDate}</p>
              <p><strong>Salary:</strong> ${data.salary}</p>
              <p><strong>Location:</strong> ${data.location}</p>
              <p><strong>Employment Type:</strong> ${data.employmentType}</p>
            </div>
            <p>We were impressed with your skills, experience, and how well you'd fit with our team. We believe you'll make a valuable contribution to our company.</p>
            <p>Please review the detailed offer letter attached to this email and let us know your decision by <strong>${data.responseDeadline}</strong>.</p>
            <a href="${data.offerLink}" class="button">View Offer Details</a>
            <p>If you have any questions or would like to discuss the offer further, please don't hesitate to reach out.</p>
            <p>We're excited about the possibility of you joining our team!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 SmartRecruit. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    
    'webinar-confirmation': (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmation: ${data.webinarTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SmartRecruit Webinars</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.firstName}, you're registered!</h2>
            <p>You have successfully registered for the upcoming webinar: <strong>${data.webinarTitle}</strong>.</p>
            <p><strong>Date:</strong> ${new Date(data.webinarDate).toLocaleString()}</p>
            <p>We'll send you a link to join the live stream 1 hour before it starts.</p>
            <a href="${data.webinarLink}" class="button">View Webinar Details</a>
          </div>
          <div class="footer">
            <p>&copy; 2024 SmartRecruit. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,

    'webinar-reminder': (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Starting Soon: ${data.webinarTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Starting in 1 Hour!</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.firstName}, get ready!</h2>
            <p>The webinar <strong>${data.webinarTitle}</strong> is starting in about 1 hour.</p>
            <p>Click the button below to join the live stream:</p>
            <a href="${data.streamLink}" class="button">Join Live Stream Now</a>
            <p>If you have any trouble, you can copy this link: ${data.streamLink}</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 SmartRecruit. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  const templateFunction = templates[template];
  if (!templateFunction) {
    throw new Error(`Email template '${template}' not found`);
  }

  return templateFunction(data);
};

// Send bulk emails
const sendBulkEmails = async (emails) => {
  let success = 0;
  let failed = 0;

  for (const email of emails) {
    try {
      await sendEmail(email);
      success++;
    } catch (error) {
      console.error(`Failed to send email to ${email.to}:`, error);
      failed++;
    }
  }

  return { success, failed };
};

// Email validation helper
const validateEmailTemplate = (template) => {
  const errors = [];

  if (!template.to) {
    errors.push('Recipient email address is required');
  }

  if (!template.subject) {
    errors.push('Email subject is required');
  }

  if (!template.template) {
    errors.push('Email template is required');
  }

  if (!template.data) {
    errors.push('Template data is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export {
  sendEmail,
  sendBulkEmails,
  validateEmailTemplate,
};
