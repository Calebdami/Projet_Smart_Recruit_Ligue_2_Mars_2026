export async function seed(knex) {
  await knex('webinar_registrations').del();

  await knex('webinar_registrations').insert([
    {
      id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      webinar_id: '99999999-9999-4999-8999-999999999991',
      user_id: '44444444-4444-4444-8444-444444444444',
      candidate_id: '66666666-6666-4666-8666-666666666661',
      email: 'leo.kouassi@example.com',
      first_name: 'Leo',
      last_name: 'Kouassi',
      phone: '+33 7 01 02 03 04',
      company: 'TalentSoft',
      position: 'Full Stack Developer',
      status: 'confirmed',
      registration_source: 'direct',
      custom_fields: JSON.stringify({
        consent_marketing: true,
      }),
      registered_at: '2026-03-28T10:00:00.000Z',
      confirmed_at: '2026-03-28T10:05:00.000Z',
      send_reminders: true,
      reminder_sent_count: 1,
      last_reminder_sent_at: '2026-04-08T08:00:00.000Z',
      calendar_invite_url: 'https://calendar.google.com/event?eid=leo-webinar',
      metadata: JSON.stringify({
        seeded: true,
      }),
    },
    {
      id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
      webinar_id: '99999999-9999-4999-8999-999999999991',
      user_id: '55555555-5555-4555-8555-555555555555',
      candidate_id: '66666666-6666-4666-8666-666666666662',
      email: 'nadia.fofana@example.com',
      first_name: 'Nadia',
      last_name: 'Fofana',
      phone: '+33 7 11 12 13 14',
      company: 'People Insights',
      position: 'Senior Data Analyst',
      status: 'registered',
      registration_source: 'linkedin',
      custom_fields: JSON.stringify({
        consent_marketing: true,
      }),
      registered_at: '2026-03-29T14:20:00.000Z',
      send_reminders: true,
      reminder_sent_count: 0,
      metadata: JSON.stringify({
        seeded: true,
      }),
    },
    {
      id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
      webinar_id: '99999999-9999-4999-8999-999999999992',
      user_id: null,
      candidate_id: null,
      email: 'guest.hr@example.com',
      first_name: 'Camille',
      last_name: 'Bernard',
      phone: '+33 6 99 88 77 66',
      company: 'HR Vision',
      position: 'Talent Acquisition Partner',
      status: 'registered',
      registration_source: 'social',
      custom_fields: JSON.stringify({
        consent_marketing: false,
      }),
      registered_at: '2026-03-30T16:30:00.000Z',
      send_reminders: true,
      reminder_sent_count: 0,
      metadata: JSON.stringify({
        seeded: true,
      }),
    },
  ]);
}
