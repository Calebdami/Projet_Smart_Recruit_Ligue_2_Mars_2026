export async function seed(knex) {
  await knex('applications').del();

  await knex('applications').insert([
    {
      id: '88888888-8888-4888-8888-888888888881',
      candidate_id: '66666666-6666-4666-8666-666666666661',
      job_id: '77777777-7777-4777-8777-777777777771',
      recruiter_id: '22222222-2222-4222-8222-222222222222',
      status: 'screening',
      source: 'direct',
      ai_score: 87.5,
      recruiter_score: 82.0,
      cover_letter: 'Je souhaite contribuer à une solution RH innovante en apportant mon expertise full-stack.',
      resume_version: 'v1',
      screening_answers: JSON.stringify({
        vue_experience_years: 3,
        node_experience_years: 4,
      }),
      interview_feedback: JSON.stringify({}),
      notes: JSON.stringify([
        {
          author: 'Sarah Mensah',
          content: 'Profil intéressant pour le produit principal.',
          created_at: '2026-03-25T10:00:00.000Z',
        },
      ]),
      next_step: 'Planifier un entretien technique',
      is_priority: true,
      is_archived: false,
      applied_at: '2026-03-24T08:30:00.000Z',
      first_contact_at: '2026-03-25T09:15:00.000Z',
      last_contact_at: '2026-03-26T16:00:00.000Z',
      metadata: JSON.stringify({
        seeded: true,
      }),
    },
    {
      id: '88888888-8888-4888-8888-888888888882',
      candidate_id: '66666666-6666-4666-8666-666666666662',
      job_id: '77777777-7777-4777-8777-777777777772',
      recruiter_id: '33333333-3333-4333-8333-333333333333',
      status: 'interview',
      source: 'linkedin',
      ai_score: 91.25,
      recruiter_score: 89.0,
      cover_letter: 'Mon parcours en analytics et en data RH me permet de piloter des décisions orientées performance.',
      resume_version: 'v2',
      screening_answers: JSON.stringify({
        sql_level: 'advanced',
        dashboard_examples: 4,
      }),
      interview_feedback: JSON.stringify({
        hr_round: 'Très bonne communication et vision métier.',
      }),
      notes: JSON.stringify([
        {
          author: 'Marc Traore',
          content: 'Très bon fit pour l équipe data.',
          created_at: '2026-03-27T15:00:00.000Z',
        },
      ]),
      next_step: 'Entretien final avec le manager',
      is_priority: true,
      is_archived: false,
      applied_at: '2026-03-26T10:45:00.000Z',
      first_contact_at: '2026-03-27T09:00:00.000Z',
      last_contact_at: '2026-03-29T11:30:00.000Z',
      interview_date: '2026-04-03T14:00:00.000Z',
      metadata: JSON.stringify({
        seeded: true,
      }),
    },
  ]);
}
