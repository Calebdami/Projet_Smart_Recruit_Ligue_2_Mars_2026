import bcrypt from 'bcryptjs';

export async function seed(knex) {
  const passwordHash = await bcrypt.hash('Candidate@2026', 12);
  
  const firstNames = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Thomas', 'Camille', 'Alexandre', 'Emma', 
                      'Lucas', 'Manon', 'Hugo', 'Léa', 'Antoine', 'Julie', 'Maxime', 'Sarah',
                      'Nicolas', 'Laura', 'Kevin', 'Anaïs'];
  const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Petit', 'Durand', 'Leroy',
                     'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'Roux', 'Bonnet',
                     'André', 'François', 'Mercier', 'Dupont'];
  
  const skills = [
    ['Vue.js', 'Node.js', 'PostgreSQL', 'JavaScript'],
    ['React', 'Python', 'SQL', 'MongoDB'],
    ['Angular', 'TypeScript', 'Docker', 'AWS'],
    ['Java', 'Spring Boot', 'MySQL', 'Kubernetes'],
    ['PHP', 'Laravel', 'Vue.js', 'Redis'],
    ['SQL', 'Power BI', 'Python', 'Analytics'],
    ['Machine Learning', 'TensorFlow', 'Python', 'Pandas'],
    ['Data Science', 'R', 'SQL', 'Tableau'],
    ['Business Intelligence', 'ETL', 'Python', 'BigQuery'],
    ['Statistics', 'SAS', 'SQL', 'Excel'],
    ['DevOps', 'AWS', 'Terraform', 'CI/CD'],
    ['Cybersecurity', 'Linux', 'Python', 'Network'],
    ['Mobile', 'React Native', 'Swift', 'Firebase'],
    ['Blockchain', 'Solidity', 'Web3', 'JavaScript'],
    ['UI/UX', 'Figma', 'Adobe XD', 'Prototyping'],
    ['Project Management', 'Agile', 'Scrum', 'Jira'],
    ['QA', 'Selenium', 'Cypress', 'Automation'],
    ['Backend', 'Go', 'Rust', 'Microservices'],
    ['Frontend', 'Svelte', 'Tailwind', 'Vite'],
    ['Full Stack', 'Next.js', 'Prisma', 'GraphQL']
  ];

  const locations = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nantes', 'Lille', 'Toulouse', 'Strasbourg', 'Nice', 'Rennes'];
  
  const users = [];
  const candidates = [];
  const applications = [];
  
  // IDs des jobs
  const job1Id = '77777777-7777-4777-8777-777777777771'; // Développeur Full Stack
  const job2Id = '77777777-7777-4777-8777-777777777772'; // Data Analyst
  
  // Recruteurs
  const recruiterIds = ['22222222-2222-4222-8222-222222222222', '33333333-3333-4333-8333-333333333333'];
  
  const statuses = ['new', 'reviewing', 'screening', 'interview', 'technical_test'];
  
  for (let i = 0; i < 20; i++) {
    const userId = `aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa${String(i + 10).padStart(2, '0')}`;
    const candidateId = `bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb${String(i + 10).padStart(2, '0')}`;
    const firstName = firstNames[i];
    const lastName = lastNames[i];
    
    // 11 premiers -> job 1, 5 suivants -> job 2, 4 derniers -> les deux jobs
    const jobIds = i < 11 ? [job1Id] : i < 16 ? [job2Id] : [job1Id, job2Id];
    const recruiterId = recruiterIds[i % 2];
    
    // User
    users.push({
      id: userId,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@example.com`,
      password_hash: passwordHash,
      role: 'candidate',
      first_name: firstName,
      last_name: lastName,
      phone: `+33 6 ${String(Math.floor(Math.random() * 89) + 10).padStart(2, '0')} ${String(Math.floor(Math.random() * 89) + 10).padStart(2, '0')} ${String(Math.floor(Math.random() * 89) + 10).padStart(2, '0')} ${String(Math.floor(Math.random() * 89) + 10).padStart(2, '0')}`,
      avatar_url: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
      is_active: true,
      email_verified: true,
      email_verified_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      two_factor_enabled: false,
      last_login_at: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
      preferences: JSON.stringify({
        locale: 'fr',
        job_alerts: true,
        notifications: { email: true, push: false }
      }),
    });
    
    // Candidate
    const userSkills = skills[i];
    const experienceLevel = i < 15 ? ['junior', 'mid', 'mid', 'senior'][Math.floor(Math.random() * 4)] : ['mid', 'senior', 'senior', 'senior'][Math.floor(Math.random() * 4)];
    const yearsExp = experienceLevel === 'junior' ? Math.floor(Math.random() * 2) + 1 : experienceLevel === 'mid' ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 5) + 6;
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    candidates.push({
      id: candidateId,
      user_id: userId,
      bio: `Passionné(e) par ${userSkills.slice(0, 2).join(' et ')}, je recherche de nouvelles opportunités pour contribuer à des projets innovants.`,
      skills: JSON.stringify(userSkills.map(s => ({ name: s, level: ['intermediate', 'advanced'][Math.floor(Math.random() * 2)] }))),
      linkedin_url: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${i + 1}`,
      github_url: Math.random() > 0.3 ? `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}` : null,
      location: location,
      country: 'France',
      experience_level: experienceLevel,
      years_experience: yearsExp,
      expected_salary_min: experienceLevel === 'junior' ? 35000 : experienceLevel === 'mid' ? 45000 : 55000,
      expected_salary_max: experienceLevel === 'junior' ? 45000 : experienceLevel === 'mid' ? 60000 : 75000,
      currency: 'EUR',
      is_available: true,
      is_active: true,
      education: JSON.stringify([
        {
          school: ['Université Paris-Saclay', 'INSA Lyon', 'Epitech', 'CentraleSupélec', 'Université de Bordeaux'][Math.floor(Math.random() * 5)],
          degree: ['Licence', 'Master', 'Bachelor', 'Ingénieur'][Math.floor(Math.random() * 4)],
          field: ['Informatique', 'Data Science', 'Génie Logiciel', 'Mathématiques'][Math.floor(Math.random() * 4)],
          start_year: 2020 - yearsExp - Math.floor(Math.random() * 2) - 4,
          end_year: 2020 - yearsExp,
        }
      ]),
      experience: JSON.stringify([
        {
          company: ['TechCorp', 'DataSolutions', 'WebAgency', 'CloudSystems', 'StartupXYZ'][Math.floor(Math.random() * 5)],
          title: userSkills.slice(0, 2).join(' / ') + ' Developer',
          start_date: `${2020 - yearsExp}-0${Math.floor(Math.random() * 9) + 1}-01`,
          end_date: null,
        }
      ]),
      languages: JSON.stringify([
        { name: 'Français', level: 'native' },
        { name: 'Anglais', level: ['professional', 'fluent'][Math.floor(Math.random() * 2)] }
      ]),
      headline: `${experienceLevel === 'senior' ? 'Senior ' : ''}${userSkills[0]} Developer`,
      profile_completion_percentage: Math.floor(Math.random() * 20) + 75,
      metadata: JSON.stringify({ source: 'seed_batch_20' }),
    });
    
    // Applications (une ou deux selon jobIds)
    jobIds.forEach((jobId, jobIndex) => {
      const aiScore = Math.floor(Math.random() * 30) + 65; // 65-95
      applications.push({
        id: `aaaaaaaa-bbbb-4ccc-8ddd-${String(i + 10).padStart(11, '0')}${jobIndex}`,
        candidate_id: candidateId,
        job_id: jobId,
        recruiter_id: recruiterId,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        source: ['direct', 'linkedin', 'indeed', 'referral'][Math.floor(Math.random() * 4)],
        ai_score: aiScore,
        recruiter_score: Math.min(100, aiScore + Math.floor(Math.random() * 20) - 10),
        cover_letter: `Je suis très intéressé(e) par cette opportunité chez votre entreprise. Mes compétences en ${userSkills.slice(0, 3).join(', ')} correspondent parfaitement aux exigences du poste.`,
        is_priority: aiScore > 85,
        applied_at: new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString(),
        metadata: JSON.stringify({ seeded: true, batch: 20 }),
      });
    });
  }
  
  // Insertion
  await knex('users').insert(users);
  await knex('candidates').insert(candidates);
  await knex('applications').insert(applications);

  // Mise à jour des applications_count pour les jobs
  await knex.raw(`
    UPDATE jobs
    SET applications_count = (
      SELECT COUNT(*)
      FROM applications
      WHERE applications.job_id = jobs.id
    )
  `);
}
