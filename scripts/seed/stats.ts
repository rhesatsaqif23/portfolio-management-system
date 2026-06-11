import { db } from './db'
import { statsTable } from '../../src/infrastructure/db/schema'

const stats = [
  {
    key: 'years_experience',
    value: '3+',
    category: 'general',
    subValue: null,
    icon: 'briefcase',
    sortOrder: 1,
  },
  {
    key: 'projects_shipped',
    value: '18',
    category: 'general',
    subValue: null,
    icon: 'code',
    sortOrder: 2,
  },
  {
    key: 'technologies_explored',
    value: '27',
    category: 'general',
    subValue: null,
    icon: 'layers',
    sortOrder: 3,
  },
  {
    key: 'main_focus',
    value: 'Front-end / Mobile / Full-stack',
    category: 'general',
    subValue: null,
    icon: 'target',
    sortOrder: 4,
  },
  {
    key: 'github_total_contributions',
    value: '630',
    category: 'general',
    subValue: '2023\u20132026',
    icon: 'github',
    sortOrder: 5,
  },
  {
    key: 'work_experience',
    value: '2',
    category: 'general',
    subValue: 'positions',
    icon: 'building',
    sortOrder: 6,
  },
  {
    key: 'education',
    value: 'Informatics Engineering - 2023',
    category: 'about',
    subValue: 'Universitas Brawijaya',
    icon: 'graduation-cap',
    sortOrder: 7,
  },
  {
    key: 'gpa',
    value: '3.92',
    category: 'about',
    subValue: 'out of 4.00',
    icon: 'award',
    sortOrder: 8,
  },
  {
    key: 'personality_traits',
    value: 'Growth Mindset / Continuous Learner / Detail Oriented / Result Driven',
    category: 'about',
    subValue: null,
    icon: 'heart',
    sortOrder: 9,
  },
]

export async function seedStats() {
  console.log('Seeding stats...')
  await db.delete(statsTable)
  for (const stat of stats) {
    await db.insert(statsTable).values(stat)
    console.log(`  \u2713 ${stat.key}: ${stat.value}`)
  }
  console.log(`  \u2192 ${stats.length} stats inserted\n`)
}
