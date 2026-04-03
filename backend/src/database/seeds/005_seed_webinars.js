export async function seed(knex) {
  await knex('webinars').del();

  await knex('webinars').insert([
    {
      id: '99999999-9999-4999-8999-999999999991',
      host_id: '22222222-2222-4222-8222-222222222222',
      title: 'Réussir son entretien technique en 2026',
      description: 'Un webinar pratique pour préparer les candidats aux entretiens techniques dans la tech.',
      slug: 'reussir-entretien-technique-2026',
      scheduled_at: '2026-04-10T17:00:00.000Z',
      duration_minutes: 75,
      timezone: 'Europe/Paris',
      stream_link: 'https://meet.smartrecruit.com/webinar/entretien-technique',
      registration_link: 'https://smartrecruit.com/webinars/reussir-entretien-technique-2026',
      status: 'scheduled',
      max_attendees: 300,
      registered_count: 2,
      attended_count: 0,
      is_public: true,
      requires_registration: true,
      send_reminders: true,
      thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&q=80',
      tags: JSON.stringify(['interview', 'career', 'tech']),
      settings: JSON.stringify({
        qa_enabled: true,
        chat_enabled: true,
      }),
      agenda: 'Préparation, erreurs fréquentes, démonstration en live, questions-réponses.',
      speakers: JSON.stringify([
        { name: 'Sarah Mensah', role: 'Lead Recruiter' },
      ]),
      language: 'fr',
      metadata: JSON.stringify({
        seeded: true,
      }),
    },
    {
      id: '99999999-9999-4999-8999-999999999992',
      host_id: '33333333-3333-4333-8333-333333333333',
      title: 'People Analytics : mesurer l efficacité du recrutement',
      description: 'Webinar dédié aux recruteurs et data analysts pour comprendre les KPIs du recrutement.',
      slug: 'people-analytics-recrutement',
      scheduled_at: '2026-04-15T12:00:00.000Z',
      duration_minutes: 60,
      timezone: 'Europe/Paris',
      stream_link: 'https://meet.smartrecruit.com/webinar/people-analytics',
      registration_link: 'https://smartrecruit.com/webinars/people-analytics-recrutement',
      status: 'scheduled',
      max_attendees: 200,
      registered_count: 1,
      attended_count: 0,
      is_public: true,
      requires_registration: true,
      send_reminders: true,
      thumbnail_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=640&q=80',
      tags: JSON.stringify(['analytics', 'recruitment', 'data']),
      settings: JSON.stringify({
        qa_enabled: true,
        replay_enabled: true,
      }),
      agenda: 'Sources de données, dashboards, métriques de conversion et recommandations.',
      speakers: JSON.stringify([
        { name: 'Marc Traore', role: 'Data Hiring Lead' },
      ]),
      language: 'fr',
      metadata: JSON.stringify({
        seeded: true,
      }),
    },
  ]);
}
