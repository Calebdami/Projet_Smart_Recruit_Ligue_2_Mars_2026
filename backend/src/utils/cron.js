import cron from 'node-cron';
import { config } from '../config/index.js';

// Store active cron jobs
const activeJobs = new Map();

// Initialize cron jobs
const initCronJobs = () => {
  console.log('Initializing cron jobs...');
  
  // Email reminder job - runs every hour
  if (config.cron.reminderEnabled) {
    const reminderJob = cron.schedule('0 * * * *', async () => {
      console.log('Running email reminder job...');
      try {
        // TODO: Implement email reminder logic
        // - Send webinar reminders
        // - Send application status updates
        // - Send profile completion reminders
        console.log('Email reminder job completed');
      } catch (error) {
        console.error('Error in email reminder job:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });
    
    activeJobs.set('reminder', reminderJob);
    reminderJob.start();
    console.log('Email reminder job scheduled');
  }

  // Database cleanup job - runs daily at 2 AM
  if (config.cron.cleanupEnabled) {
    const cleanupJob = cron.schedule('0 2 * * *', async () => {
      console.log('Running database cleanup job...');
      try {
        // TODO: Implement cleanup logic
        // - Clean expired tokens
        // - Clean old audit logs
        // - Clean temporary files
        console.log('Database cleanup job completed');
      } catch (error) {
        console.error('Error in database cleanup job:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });
    
    activeJobs.set('cleanup', cleanupJob);
    cleanupJob.start();
    console.log('Database cleanup job scheduled');
  }

  // Report generation job - runs weekly on Sunday at 1 AM
  if (config.cron.reportEnabled) {
    const reportJob = cron.schedule('0 1 * * 0', async () => {
      console.log('Running report generation job...');
      try {
        // TODO: Implement report generation logic
        // - Generate weekly recruitment reports
        // - Generate analytics reports
        // - Send reports to admins
        console.log('Report generation job completed');
      } catch (error) {
        console.error('Error in report generation job:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });
    
    activeJobs.set('report', reportJob);
    reportJob.start();
    console.log('Report generation job scheduled');
  }

  console.log(`Initialized ${activeJobs.size} cron jobs`);
};

// Stop all cron jobs
const stopAllCronJobs = () => {
  console.log('Stopping all cron jobs...');
  
  activeJobs.forEach((job, name) => {
    job.stop();
    console.log(`Stopped ${name} job`);
  });
  
  activeJobs.clear();
  console.log('All cron jobs stopped');
};

// Get status of all cron jobs
const getCronJobStatus = () => {
  const status = {};
  
  activeJobs.forEach((job, name) => {
    status[name] = {
      running: job.running,
      scheduled: job.scheduled,
      nextDate: job.nextDate()?.toISOString() || null,
      lastDate: job.lastDate()?.toISOString() || null,
    };
  });
  
  return status;
};

// Start a specific cron job
const startCronJob = (jobName) => {
  const job = activeJobs.get(jobName);
  if (job) {
    job.start();
    console.log(`Started ${jobName} job`);
    return true;
  }
  return false;
};

// Stop a specific cron job
const stopCronJob = (jobName) => {
  const job = activeJobs.get(jobName);
  if (job) {
    job.stop();
    console.log(`Stopped ${jobName} job`);
    return true;
  }
  return false;
};

// Add a new cron job dynamically
const addCronJob = (name, schedule, task, options = {}) => {
  if (activeJobs.has(name)) {
    console.warn(`Cron job ${name} already exists`);
    return false;
  }

  const job = cron.schedule(schedule, task, {
    scheduled: false,
    timezone: 'UTC',
    ...options
  });

  activeJobs.set(name, job);
  
  if (options.autoStart !== false) {
    job.start();
    console.log(`Added and started ${name} job`);
  } else {
    console.log(`Added ${name} job (not started)`);
  }

  return true;
};

// Remove a cron job
const removeCronJob = (name) => {
  const job = activeJobs.get(name);
  if (job) {
    job.stop();
    activeJobs.delete(name);
    console.log(`Removed ${name} job`);
    return true;
  }
  return false;
};

export {
  initCronJobs,
  stopAllCronJobs,
  getCronJobStatus,
  startCronJob,
  stopCronJob,
  addCronJob,
  removeCronJob,
};