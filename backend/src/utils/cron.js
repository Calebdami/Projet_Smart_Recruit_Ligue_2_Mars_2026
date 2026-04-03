import cron from 'node-cron';
import { db } from '../config/database.js';
import { sendEmail } from './email.js';

/**
 * Initialize all cron jobs for the application
 */
export const initCronJobs = () => {
    // Every 15 minutes: Check for webinars starting in 1 hour
    cron.schedule('*/15 * * * *', async () => {
        console.log('[CRON] Checking for upcoming webinars to send reminders...');
        try {
            const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
            const oneHourAndFifteenFromNow = new Date(Date.now() + 75 * 60 * 1000);

            // Find webinars starting in roughly 1 hour that haven't had reminders sent
            const upcomingWebinars = await db('webinars')
                .where('scheduled_at', '>=', oneHourFromNow)
                .where('scheduled_at', '<', oneHourAndFifteenFromNow)
                .where('status', 'scheduled')
                .where('send_reminders', true);

            for (const webinar of upcomingWebinars) {
                // Find all registered users for this webinar who haven't received a reminder
                const registrations = await db('webinar_registrations')
                    .where('webinar_id', webinar.id)
                    .where('status', 'registered')
                    .where('reminder_sent_count', 0);

                console.log(`[CRON] Sending ${registrations.length} reminders for webinar: ${webinar.title}`);

                for (const reg of registrations) {
                    try {
                        await sendEmail({
                            to: reg.email,
                            subject: `Starting Soon: ${webinar.title}`,
                            template: 'webinar-reminder',
                            data: {
                                firstName: reg.first_name,
                                webinarTitle: webinar.title,
                                streamLink: webinar.stream_link || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/webinars/${webinar.slug}/live`,
                            }
                        });

                        // Mark reminder as sent
                        await db('webinar_registrations')
                            .where('id', reg.id)
                            .update({
                                reminder_sent_count: 1,
                                last_reminder_sent_at: db.fn.now(),
                                status: 'confirmed'
                            });
                    } catch (err) {
                        console.error(`[CRON] Failed to send reminder to ${reg.email}:`, err);
                    }
                }
            }
        } catch (error) {
            console.error('[CRON] Webinar reminder job failed:', error);
        }
    });

    // Every day at midnight: Clean up old logs or perform daily maintenance
    cron.schedule('0 0 * * *', async () => {
        console.log('[CRON] Running daily maintenance tasks...');
        // Add maintenance logic here (e.g., archiving old webinars)
    });
};
