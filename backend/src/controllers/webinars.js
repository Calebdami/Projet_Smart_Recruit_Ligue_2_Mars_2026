import { db } from '../config/database.js';
import { auditLog } from '../utils/audit.js';
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';

const createWebinar = async (req, res) => {
  try {
    const { host_id, title, description, slug, scheduled_at, ...webinarData } = req.body;
    
    // Generate slug if not provided
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const [webinarId] = await db('webinars').insert({
      host_id: req.user.id, // From auth middleware
      title,
      description,
      slug: finalSlug,
      scheduled_at: scheduled_at ? new Date(scheduled_at) : null,
      status: 'draft',
      registered_count: 0,
      attended_count: 0,
      is_public: true,
      requires_registration: true,
      send_reminders: true,
      ...webinarData,
      created_at: new Date(),
      updated_at: new Date()
    }).returning('id');

    // Audit log
    await auditLog(req.user.id, 'webinar', webinarId[0], 'create', { title });

    res.status(201).json({ 
      id: webinarId[0],
      message: 'Webinar created successfully' 
    });
  } catch (err) {
    console.error('Create webinar error:', err);
    res.status(500).json({ error: 'Failed to create webinar' });
  }
};

const registerForWebinar = async (req, res) => {
  try {
    const { webinar_id } = req.params;
    const { email, first_name, last_name, phone, company, position, user_id, candidate_id } = req.body;
    
    // Check webinar exists and allows registration
    const webinar = await db('webinars')
      .where('id', webinar_id)
      .andWhere('status', 'in', ['scheduled', 'live'])
      .andWhere('requires_registration', true)
      .first();

    if (!webinar) {
      return res.status(404).json({ error: 'Webinar not found or registration closed' });
    }

    // Check if already registered
    const existing = await db('webinar_registrations')
      .where({ webinar_id, email })
      .first();

    if (existing) {
      return res.status(409).json({ 
        error: 'Already registered', 
        registration_id: existing.id,
        status: existing.status 
      });
    }

    // Create registration
    const registrationId = crypto.randomUUID();
    await db('webinar_registrations').insert({
      id: registrationId,
      webinar_id,
      user_id: user_id || null,
      candidate_id: candidate_id || null,
      email,
      first_name,
      last_name,
      phone,
      company,
      position,
      status: 'registered',
      registration_source: req.body.registration_source || 'direct',
      registered_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    });

    // Update webinar counter
    await db('webinars')
      .where('id', webinar_id)
      .increment('registered_count', 1);

    // Send confirmation email
    try {
      await sendEmail({
        to: email,
        subject: `Registration confirmed: ${webinar.title}`,
        template: 'webinar-confirmation',
        data: {
          webinar_title: webinar.title,
          scheduled_at: webinar.scheduled_at,
          registration_id: registrationId,
          host_name: 'Recruiter Team' // From host_id join later
        }
      });
    } catch (emailErr) {
      console.error('Email send failed:', emailErr);
    }

    // Audit if authenticated user
    if (req.user?.id) {
      await auditLog(req.user.id, 'webinar_registration', registrationId, 'create', { webinar_id });
    }

    res.json({ 
      message: 'Registration successful',
      registration_id: registrationId,
      webinar_id 
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const getWebinarStats = async (req, res) => {
  try {
    const { webinar_id } = req.params;

    // Verify ownership
    const webinar = await db('webinars')
      .where('id', webinar_id)
      .andWhere('host_id', req.user.id)
      .first();

    if (!webinar) {
      return res.status(404).json({ error: 'Webinar not found or access denied' });
    }

    // Stats aggregation
    const stats = await db('webinar_registrations')
      .where('webinar_id', webinar_id)
      .select(
        db.raw('status, count(*) as count'),
        db.raw("count(case when status = 'attended' then 1 end) as attended"),
        db.raw("count(case when status = 'no_show' then 1 end) as no_show")
      )
      .groupBy('status')
      .first();

    const totalRegistered = webinar.registered_count || 0;
    const totalAttended = stats?.attended || 0;
    const attendanceRate = totalRegistered > 0 ? ((totalAttended / totalRegistered) * 100).toFixed(1) : 0;

    res.json({
      webinar_id,
      total_registered: totalRegistered,
      total_attended: totalAttended,
      attendance_rate: `${attendanceRate}%`,
      status_breakdown: stats || { count: 0 },
      last_updated: new Date()
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

export { createWebinar, registerForWebinar, getWebinarStats };

