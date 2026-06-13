import { db } from './db'
import { experiencesTable } from '../../src/infrastructure/db/schema'

const IMG = 'https://ipkrjpftddtxwzmylxtf.supabase.co/storage/v1/object/public/company-images'

const experiences = [
  {
    orgName: 'Ariverse Studio',
    role: 'Front-End Developer Intern',
    startDate: '2026-06-01',
    endDate: null,
    description:
      'Contributing to gamified EdTech platforms and interactive web solutions for B2B clients at a creative tech studio. Building gamification dashboards and integrating XR interfaces into spatial computing experiences.',
    type: 'work',
    imageUrl: `${IMG}/ariverse.jpg`,
    sortOrder: 1,
  },
  {
    orgName: 'PT Edukarir Global Nusantara',
    role: 'Software Engineer Intern',
    startDate: '2026-04-01',
    endDate: null,
    description:
      'Participating in the Linkupcareer.id Talent Recruitment Program, contributing to an integrated education and career platform. Supporting the development of scholarship information systems, career mentoring tools, and certification management features.',
    type: 'work',
    imageUrl: `${IMG}/linkupcareer.png`,
    sortOrder: 2,
  },
  {
    orgName: 'MGM Laboratory',
    role: 'Mobile Research and Development Staff',
    startDate: '2026-03-01',
    endDate: null,
    description:
      'Conducting research and development of mobile applications and information systems under the Media, Game, and Mobile Laboratory at FILKOM UB. Focused on Android and iOS app development, mobile performance optimization, and system integration for handheld devices.',
    type: 'education',
    imageUrl: `${IMG}/mgm.jpg`,
    sortOrder: 3,
  },
  {
    orgName: 'OctoSight (Capstone Project FILKOM UB)',
    role: 'Full-stack Developer',
    startDate: '2026-02-01',
    endDate: '2026-06-01',
    description:
      'Developed OctoSight, an end-to-end anti-phishing and fraud detection prototype for digital banking as a capstone project. Built the frontend with Next.js and the backend with FastAPI, integrated a hybrid AI detection engine combining rule-based heuristics with ML prediction, and implemented a full admin triage workflow with analytics dashboards and SLA monitoring.',
    type: 'education',
    imageUrl: null,
    sortOrder: 4,
  },
  {
    orgName: 'Raion Community',
    role: 'Lead Front-End Web Developer',
    startDate: '2026-01-01',
    endDate: null,
    description:
      'Led front-end development for website enhancement, collaborating with cross-functional teams under an Agile workflow. Built admin CMS dashboard for event management including CRUD and API integration. Transformed static website into a dynamic, centralized platform for event publication and registration.',
    type: 'organization',
    imageUrl: `${IMG}/raion.png`,
    sortOrder: 5,
  },
  {
    orgName: 'Raion Community',
    role: 'Mobile Engineer',
    startDate: '2025-03-01',
    endDate: null,
    description:
      'Actively involved in mobile application development through regular workshops and hands-on practices. Continued development of ZELOW application using Flutter and Firebase. Developed HearMe, an application integrating Gemini API and FastAPI during Raion Hackjam.',
    type: 'organization',
    imageUrl: `${IMG}/raion.png`,
    sortOrder: 6,
  },
  {
    orgName: 'Optiik Photography & Design',
    role: 'Lead of Photography & Videography Division',
    startDate: '2025-01-01',
    endDate: '2025-12-01',
    description:
      "Designed and delivered photography and videography training programs to enhance members' skills. Organized and scheduled group photo hunting sessions to strengthen members' portfolios. Encouraged member participation in photography competitions, producing award-winning works.",
    type: 'organization',
    imageUrl: `${IMG}/optiik.png`,
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
    imageUrl: `${IMG}/filkom.png`,
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
    imageUrl: `${IMG}/hology.png`,
    sortOrder: 9,
  },
  {
    orgName: 'GDSC University of Brawijaya (UB)',
    role: 'Community Member',
    startDate: '2023-09-01',
    endDate: '2024-09-01',
    description:
      'Participated in webinars, workshops, and developer community activities. Engaging in discussions and learning sessions related to software development.',
    type: 'organization',
    imageUrl: `${IMG}/gdsc.png`,
    sortOrder: 10,
  },
]

export async function seedExperiences() {
  console.log('Seeding experiences...')
  await db.delete(experiencesTable)
  for (const exp of experiences) {
    await db.insert(experiencesTable).values(exp)
    console.log(`  \u2713 ${exp.role} @ ${exp.orgName}`)
  }
  console.log(`  \u2192 ${experiences.length} experiences inserted\n`)
}
