import { db } from './db'
import { experiencesTable } from '../../src/infrastructure/db/schema'

const experiences = [
  {
    orgName: 'Ariverse Studio',
    role: 'Front-End Developer Intern',
    startDate: '2026-06-01',
    endDate: null,
    description: 'Working as a Front-End Developer Intern in a hybrid setup in Malang.',
    type: 'work',
    sortOrder: 1,
  },
  {
    orgName: 'PT Edukarir Global Nusantara',
    role: 'Software Engineer Intern',
    startDate: '2026-04-01',
    endDate: null,
    description: 'Working as a Software Engineer Intern remotely.',
    type: 'work',
    sortOrder: 2,
  },
  {
    orgName: 'MGM Laboratory',
    role: 'Mobile Research and Development Staff',
    startDate: '2026-03-01',
    endDate: null,
    description: 'Contract role focusing on mobile research and development in Malang.',
    type: 'work',
    sortOrder: 3,
  },
  {
    orgName: 'Raion Community',
    role: 'Lead Front-End Web Developer',
    startDate: '2026-01-01',
    endDate: null,
    description:
      'Led front-end development for website enhancement, collaborating with cross-functional teams under an Agile workflow. Built admin CMS dashboard for event management including CRUD and API integration. Transformed static website into a dynamic, centralized platform for event publication and registration.',
    type: 'organization',
    sortOrder: 4,
  },
  {
    orgName: 'Raion Community',
    role: 'Mobile Engineer',
    startDate: '2025-03-01',
    endDate: null,
    description:
      'Actively involved in mobile application development through regular workshops and hands-on practices. Continued development of ZELOW application using Flutter and Firebase. Developed HearMe, an application integrating Gemini API and FastAPI during Raion Hackjam.',
    type: 'organization',
    sortOrder: 5,
  },
  {
    orgName: 'Optiik Photography & Design',
    role: 'Lead of Photography & Videography Division',
    startDate: '2025-01-01',
    endDate: '2025-12-01',
    description:
      "Designed and delivered photography and videography training programs to enhance members' skills. Organized and scheduled group photo hunting sessions to strengthen members' portfolios. Encouraged member participation in photography competitions, producing award-winning works.",
    type: 'organization',
    sortOrder: 6,
  },
  {
    orgName: 'Optiik Photography & Design',
    role: 'Event Chairperson of Optiik Young Impact 2025',
    startDate: '2025-01-01',
    endDate: '2025-04-01',
    description:
      'Led and coordinated 37+ members to execute 3 events including class sharing, photo hunting, and exhibitions. Managed cross-division coordination to ensure smooth execution and on-time event delivery. Served as a speaker delivering introductory photography fundamentals.',
    type: 'organization',
    sortOrder: 7,
  },
  {
    orgName: 'Faculty of Computer Science (FILKOM) University of Brawijaya',
    role: 'Laboratory Assistant of Database Systems',
    startDate: '2025-02-01',
    endDate: '2025-06-01',
    description:
      'Assisted in conducting database laboratory sessions using Microsoft SQL Server (MSSQL). Guided 43 students in understanding relational database concepts and SQL fundamentals. Designed enrichment tasks and practical exams, and evaluated students\' SQL queries and database designs.',
    type: 'education',
    sortOrder: 8,
  },
  {
    orgName: 'HOLOGY UB',
    role: 'Staff of Creative Media',
    startDate: '2024-05-01',
    endDate: '2024-11-01',
    description:
      'Produced 4 video contents including teasers, throwbacks, and aftermovies for a national-scale IT competition. Executed video production as a cinematographer, collaborating with actors and production team members. Documented 7 competition categories with finalists from universities across Indonesia.',
    type: 'organization',
    sortOrder: 9,
  },
  {
    orgName: 'GDSC University of Brawijaya (UB)',
    role: 'Community Member',
    startDate: '2023-09-01',
    endDate: '2024-09-01',
    description:
      'Participated in webinars, workshops, and developer community activities. Engaged in discussions and learning sessions related to software development.',
    type: 'organization',
    sortOrder: 10,
  },
]

export async function seedExperiences() {
  console.log('Seeding experiences...')
  await db.delete(experiencesTable)
  for (const exp of experiences) {
    await db.insert(experiencesTable).values(exp)
    console.log(`  ✓ ${exp.role} @ ${exp.orgName}`)
  }
  console.log(`  → ${experiences.length} experiences inserted\n`)
}
