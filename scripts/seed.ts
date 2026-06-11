import { pool } from './seed/db'
import { seedSkills } from './seed/skills'
import { seedExperiences } from './seed/experiences'
import { seedProjects } from './seed/projects'
import { seedAchievements } from './seed/achievements'

async function main() {
  console.log('=== Portfolio CMS Seed ===\n')

  await seedSkills()
  await seedExperiences()
  await seedProjects()
  await seedAchievements()

  console.log('All tables seeded successfully.')
  await pool.end()
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
