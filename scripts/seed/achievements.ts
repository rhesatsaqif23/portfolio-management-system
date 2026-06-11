import { db } from './db'
import { achievementsTable } from '../../src/infrastructure/db/schema'

const achievements = [
  {
    title: '1st Place – Android Hackathon Slash National Competition 2025',
    eventName: 'Slash National Competition 2025',
    organizer: 'BEM Faculty of Computer Science, UPN "Veteran" Jakarta',
    date: '2025-07-01',
    description:
      'Achieved 1st place by developing Swara Ibu, a mobile application for postpartum depression support using voice-based emotional analysis and emergency alert features within a 5-day hackathon.',
    url: null,
    sortOrder: 1,
  },
  {
    title: 'Top 5 Finalist – Web Development Competition IT Fest 2025',
    eventName: 'IT Fest x FTJ',
    organizer: 'Universitas Muria Kudus',
    date: '2025-11-01',
    description:
      'Achieved Top 5 Finalist position in a competitive Web Development event, showcasing proficiency in building responsive, user-friendly interfaces and robust backend systems by developing OptiFind, a web-based lost and found platform.',
    url: null,
    sortOrder: 2,
  },
  {
    title: 'Top 7 Finalist – HackAttack 2025',
    eventName: 'HackAttack 2025',
    organizer: 'CCI x HimaIF Telkom University',
    date: '2025-11-01',
    description:
      'Competed in HackAttack 2025, reaching the Top 7 finalists among numerous teams. Demonstrated strong collaboration and technical expertise in a high-pressure hackathon environment.',
    url: null,
    sortOrder: 3,
  },
  {
    title: 'Top 13 Finalist – Web Development FICPACT CUP 2026',
    eventName: 'FICPACT CUP 2026',
    organizer: 'Universitas Katolik Soegijapranata',
    date: '2026-03-01',
    description:
      'Selected as a Top 13 finalist in the Web Development competition at FICPACT CUP 2026 by developing NeuroClash GG, an AI-powered edutainment platform with auto-battler quiz mechanics.',
    url: null,
    sortOrder: 4,
  },
  {
    title: 'Finalist – Student Digital Innovation Competition (LIDM) 2025',
    eventName: 'LIDM 2025',
    organizer: 'Ministry of Higher Education, Science, and Technology (Kemdiktisaintek)',
    date: '2025-12-01',
    description:
      'Selected as a Top 20 finalist nationally by producing "Tanya Bijak Salin Sadar", an educational short film addressing student life amid AI technology.',
    url: null,
    sortOrder: 5,
  },
  {
    title: '1st Place – Photography Competition Artropolis 2024',
    eventName: 'Artropolis 2024',
    organizer: 'BEM Faculty of Computer Science, Universitas Brawijaya',
    date: '2024-10-01',
    description:
      'Secured 1st place with the photography work "Tech Collaboration", capturing the integration of technology within the Faculty of Computer Science environment.',
    url: null,
    sortOrder: 6,
  },
  {
    title: '1st Place – PKM-PI Dekan Cup FILKOM 2023',
    eventName: 'Dekan Cup FILKOM 2023',
    organizer: 'Faculty of Computer Science, Universitas Brawijaya',
    date: '2023-11-01',
    description:
      'Won 1st place by proposing a technology-based parking sensor system to detect available parking slots in malls as an applied IPTEK solution during the Dekan Cup FILKOM.',
    url: null,
    sortOrder: 7,
  },
]

export async function seedAchievements() {
  console.log('Seeding achievements...')
  await db.delete(achievementsTable)
  for (const achievement of achievements) {
    await db.insert(achievementsTable).values(achievement)
    console.log(`  ✓ ${achievement.title}`)
  }
  console.log(`  → ${achievements.length} achievements inserted\n`)
}
