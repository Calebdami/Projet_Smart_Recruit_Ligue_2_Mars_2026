import { db } from '../config/database.js';

class AnalyticsController {
  // Get dashboard statistics
  static async getDashboardStats(req, res) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      // Base queries
      const totalUsersPromise = db('users').count('id as count').first();
      const activeUsersPromise = db('users').where('is_active', true).count('id as count').first();
      const totalJobsPromise = db('jobs').count('id as count').first();
      const totalApplicationsPromise = db('applications').count('id as count').first();
      const interviewsCountPromise = db('applications')
        .whereIn('status', ['interview', 'technical_test'])
        .count('id as count')
        .first();

      const [
        totalUsers,
        activeUsers,
        totalJobs,
        totalApplications,
        interviewsCount
      ] = await Promise.all([
        totalUsersPromise,
        activeUsersPromise,
        totalJobsPromise,
        totalApplicationsPromise,
        interviewsCountPromise
      ]);

      res.json({
        success: true,
        data: {
          stats: {
            totalUsers: parseInt(totalUsers.count) || 0,
            activeUsers: parseInt(activeUsers.count) || 0,
            totalJobs: parseInt(totalJobs.count) || 0,
            totalApplications: parseInt(totalApplications.count) || 0,
            interviewsCount: parseInt(interviewsCount.count) || 0
          }
        }
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve dashboard statistics'
      });
    }
  }

  // Get overview statistics (detailed)
  static async getOverviewStats(req, res) {
    try {
      // Applications by status
      const applicationsByStatus = await db('applications')
        .select('status', db.raw('count(*) as count'))
        .groupBy('status');

      // Jobs by status
      const jobsByStatus = await db('jobs')
        .select('status', db.raw('count(*) as count'))
        .groupBy('status');

      // Applications over time (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const applicationsOverTime = await db('applications')
        .select(db.raw('DATE(created_at) as date'), db.raw('count(*) as count'))
        .where('created_at', '>=', thirtyDaysAgo)
        .groupBy(db.raw('DATE(created_at)'))
        .orderBy('date', 'asc');

      // Top performing jobs by applications
      const topJobs = await db('jobs')
        .select('jobs.id', 'jobs.title', db.raw('count(applications.id) as applications_count'))
        .leftJoin('applications', 'jobs.id', 'applications.job_id')
        .groupBy('jobs.id', 'jobs.title')
        .orderBy('applications_count', 'desc')
        .limit(5);

      res.json({
        success: true,
        data: {
          applicationsByStatus,
          jobsByStatus,
          applicationsOverTime,
          topJobs
        }
      });
    } catch (error) {
      console.error('Get overview stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve overview statistics'
      });
    }
  }

  // Get recent activity
  static async getRecentActivity(req, res) {
    try {
      const { limit = 10 } = req.query;

      const activity = await db('audit_trail')
        .join('users', 'audit_trail.user_id', 'users.id')
        .select(
          'audit_trail.id',
          'audit_trail.action',
          'audit_trail.entity_type',
          'audit_trail.entity_id',
          'audit_trail.created_at',
          'users.first_name',
          'users.last_name'
        )
        .orderBy('audit_trail.created_at', 'desc')
        .limit(parseInt(limit));

      res.json({
        success: true,
        data: {
          activity: activity.map(item => ({
            id: item.id,
            action: item.action,
            entity_type: item.entity_type,
            entity_id: item.entity_id,
            created_at: item.created_at,
            user: {
              first_name: item.first_name,
              last_name: item.last_name
            }
          }))
        }
      });
    } catch (error) {
      console.error('Get recent activity error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve recent activity'
      });
    }
  }

  // Get pipeline statistics
  static async getPipelineStats(req, res) {
    try {
      const pipelineStats = await db('applications')
        .select('status', db.raw('count(*) as count'))
        .groupBy('status');

      res.json({
        success: true,
        data: {
          pipeline: pipelineStats
        }
      });
    } catch (error) {
      console.error('Get pipeline stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve pipeline statistics'
      });
    }
  }

  // Get time to hire metrics
  static async getTimeToHire(req, res) {
    try {
      // Calculate average time from application to hire
      const timeToHireData = await db('applications')
        .select(
          db.raw('AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/86400) as avg_days'),
          db.raw('count(*) as total_hired')
        )
        .where('status', 'hired');

      res.json({
        success: true,
        data: {
          timeToHire: timeToHireData[0] || { avg_days: 0, total_hired: 0 }
        }
      });
    } catch (error) {
      console.error('Get time to hire error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve time to hire metrics'
      });
    }
  }
}

export { AnalyticsController };
