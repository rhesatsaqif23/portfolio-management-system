import { db } from './db'
import { skillsTable } from '../../src/infrastructure/db/schema'

const skills = [
  { name: 'React', category: 'web' as const, iconUrl: 'https://skillicons.dev/icons?i=react', sortOrder: 1 },
  { name: 'Next.js', category: 'web' as const, iconUrl: 'https://skillicons.dev/icons?i=nextjs', sortOrder: 2 },
  { name: 'TypeScript', category: 'web' as const, iconUrl: 'https://skillicons.dev/icons?i=ts', sortOrder: 3 },
  { name: 'JavaScript', category: 'web' as const, iconUrl: 'https://skillicons.dev/icons?i=js', sortOrder: 4 },
  { name: 'Tailwind CSS', category: 'web' as const, iconUrl: 'https://skillicons.dev/icons?i=tailwind', sortOrder: 5 },
  { name: 'HTML', category: 'web' as const, iconUrl: 'https://skillicons.dev/icons?i=html', sortOrder: 6 },
  { name: 'CSS', category: 'web' as const, iconUrl: 'https://skillicons.dev/icons?i=css', sortOrder: 7 },
  { name: 'Node.js', category: 'backend' as const, iconUrl: 'https://skillicons.dev/icons?i=nodejs', sortOrder: 8 },
  { name: 'Express', category: 'backend' as const, iconUrl: 'https://skillicons.dev/icons?i=express', sortOrder: 9 },
  { name: 'FastAPI', category: 'backend' as const, iconUrl: 'https://skillicons.dev/icons?i=fastapi', sortOrder: 10 },
  { name: 'Python', category: 'backend' as const, iconUrl: 'https://skillicons.dev/icons?i=py', sortOrder: 11 },
  { name: 'Laravel', category: 'backend' as const, iconUrl: 'https://skillicons.dev/icons?i=laravel', sortOrder: 12 },
  { name: 'PHP', category: 'backend' as const, iconUrl: 'https://skillicons.dev/icons?i=php', sortOrder: 13 },
  { name: 'Java', category: 'backend' as const, iconUrl: 'https://skillicons.dev/icons?i=java', sortOrder: 14 },
  { name: 'Kotlin', category: 'mobile' as const, iconUrl: 'https://skillicons.dev/icons?i=kotlin', sortOrder: 15 },
  { name: 'Flutter', category: 'mobile' as const, iconUrl: 'https://skillicons.dev/icons?i=flutter', sortOrder: 16 },
  { name: 'Dart', category: 'mobile' as const, iconUrl: 'https://skillicons.dev/icons?i=dart', sortOrder: 17 },
  { name: 'Android Studio', category: 'mobile' as const, iconUrl: 'https://skillicons.dev/icons?i=androidstudio', sortOrder: 18 },
  { name: 'Docker', category: 'devops' as const, iconUrl: 'https://skillicons.dev/icons?i=docker', sortOrder: 19 },
  { name: 'Supabase', category: 'devops' as const, iconUrl: 'https://skillicons.dev/icons?i=supabase', sortOrder: 20 },
  { name: 'Firebase', category: 'devops' as const, iconUrl: 'https://skillicons.dev/icons?i=firebase', sortOrder: 21 },
  { name: 'Vercel', category: 'devops' as const, iconUrl: 'https://skillicons.dev/icons?i=vercel', sortOrder: 22 },
  { name: 'Postman', category: 'devops' as const, iconUrl: 'https://skillicons.dev/icons?i=postman', sortOrder: 23 },
  { name: 'MySQL', category: 'backend' as const, iconUrl: 'https://skillicons.dev/icons?i=mysql', sortOrder: 24 },
  { name: 'PostgreSQL', category: 'backend' as const, iconUrl: 'https://skillicons.dev/icons?i=postgres', sortOrder: 25 },
  { name: 'Figma', category: 'design' as const, iconUrl: 'https://skillicons.dev/icons?i=figma', sortOrder: 26 },
  { name: 'VS Code', category: 'other' as const, iconUrl: 'https://skillicons.dev/icons?i=vscode', sortOrder: 27 },
]

export async function seedSkills() {
  console.log('Seeding skills...')
  await db.delete(skillsTable)
  for (const skill of skills) {
    await db.insert(skillsTable).values(skill)
    console.log(`  ✓ ${skill.name} (${skill.category})`)
  }
  console.log(`  → ${skills.length} skills inserted\n`)
}
