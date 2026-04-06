export async function seed(knex) {
  await knex('audit_trail').del();

  await knex('audit_trail').insert([
    {
      id: 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
      user_id: '11111111-1111-4111-8111-111111111111',
      action: 'create',
      entity_type: 'user',
      entity_id: '22222222-2222-4222-8222-222222222222',
      old_values: null,
      new_values: JSON.stringify({
        email: 'sarah.mensah@smartrecruit.com',
        role: 'recruiter',
      }),
      ip_address: '105.235.10.1',
      user_agent: 'seed-script',
      session_id: 'seed-session-1',
      request_id: 'seed-request-1',
      is_sensitive: false,
      metadata: JSON.stringify({
        seeded: true,
      }),
      created_at: '2026-03-02T10:00:00.000Z',
    },
    {
      id: 'cccccccc-cccc-4ccc-8ccc-ccccccccccc2',
      user_id: '22222222-2222-4222-8222-222222222222',
      action: 'create',
      entity_type: 'job',
      entity_id: '77777777-7777-4777-8777-777777777771',
      old_values: null,
      new_values: JSON.stringify({
        title: 'Développeur Full Stack Vue.js / Node.js',
        status: 'open',
      }),
      ip_address: '105.235.10.2',
      user_agent: 'seed-script',
      session_id: 'seed-session-2',
      request_id: 'seed-request-2',
      is_sensitive: false,
      metadata: JSON.stringify({
        seeded: true,
      }),
      created_at: '2026-03-20T08:05:00.000Z',
    },
    {
      id: 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3',
      user_id: '33333333-3333-4333-8333-333333333333',
      action: 'update',
      entity_type: 'application',
      entity_id: '88888888-8888-4888-8888-888888888882',
      old_values: JSON.stringify({
        status: 'screening',
      }),
      new_values: JSON.stringify({
        status: 'interview',
      }),
      ip_address: '105.235.10.3',
      user_agent: 'seed-script',
      session_id: 'seed-session-3',
      request_id: 'seed-request-3',
      is_sensitive: false,
      metadata: JSON.stringify({
        seeded: true,
      }),
      created_at: '2026-03-29T11:40:00.000Z',
    },
    {
      id: 'cccccccc-cccc-4ccc-8ccc-ccccccccccc4',
      user_id: '11111111-1111-4111-8111-111111111111',
      action: 'export',
      entity_type: 'audit_trail',
      entity_id: 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
      old_values: null,
      new_values: JSON.stringify({
        format: 'csv',
      }),
      ip_address: '105.235.10.1',
      user_agent: 'seed-script',
      session_id: 'seed-session-4',
      request_id: 'seed-request-4',
      is_sensitive: true,
      metadata: JSON.stringify({
        seeded: true,
      }),
      created_at: '2026-03-30T09:00:00.000Z',
    },
  ]);
}
