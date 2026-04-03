import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const EmailService = {
    /**
     * Send an email notification to the recruiter for high-scoring candidates
     * @param {string} to - Recruiter's email
     * @param {Object} data - Candidate and Job info
     */
    async sendHighMatchNotification(to, { candidateName, jobTitle, score, breakdown }) {
        try {
            const mailOptions = {
                from: `"SmartRecruit AI" <${process.env.EMAIL_FROM}>`,
                to,
                subject: `🔥 High Match Alert: ${candidateName} for ${jobTitle}`,
                html: `
                    <h1>Excellent Match Detected!</h1>
                    <p>A new candidate has applied for <strong>${jobTitle}</strong> with a score of <strong>${score}%</strong>.</p>
                    <h3>Match Breakdown:</h3>
                    <ul>
                        <li>Skills: ${breakdown.skills.value}%</li>
                        <li>Experience: ${breakdown.experience_level.value}%</li>
                        <li>Location: ${breakdown.location.value}%</li>
                    </ul>
                    <p><a href="${process.env.FRONTEND_URL}/jobs/${jobTitle}/matching">View full matching results</a></p>
                `,
            };

            await transporter.sendMail(mailOptions);
            console.log(`High-match notification sent to ${to}`);
        } catch (error) {
            console.error('Email Notification Error:', error);
        }
    },

    /**
     * Send generic email
     */
    async sendEmail(to, subject, html) {
        try {
            await transporter.sendMail({
                from: `"SmartRecruit" <${process.env.EMAIL_FROM}>`,
                to,
                subject,
                html,
            });
        } catch (error) {
            console.error('Email Error:', error);
        }
    }
};
