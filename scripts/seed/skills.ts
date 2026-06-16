import { db } from './db'
import { skillsTable } from '../../src/infrastructure/db/schema'

const skills: {
  name: string
  category: 'Frontend' | 'Backend' | 'Mobile' | 'Database' | 'DevOps' | 'Cloud & Deployment' | 'Tools' | 'Design'
  iconUrl: string
  sortOrder: number
}[] = [
  // ── Frontend ──
  { name: 'React', category: 'Frontend', iconUrl: 'https://skillicons.dev/icons?i=react', sortOrder: 1 },
  { name: 'Next.js', category: 'Frontend', iconUrl: 'https://skillicons.dev/icons?i=nextjs', sortOrder: 2 },
  { name: 'TypeScript', category: 'Frontend', iconUrl: 'https://skillicons.dev/icons?i=ts', sortOrder: 3 },
  { name: 'JavaScript', category: 'Frontend', iconUrl: 'https://skillicons.dev/icons?i=js', sortOrder: 4 },
  { name: 'Tailwind CSS', category: 'Frontend', iconUrl: 'https://skillicons.dev/icons?i=tailwind', sortOrder: 5 },
  { name: 'HTML', category: 'Frontend', iconUrl: 'https://skillicons.dev/icons?i=html', sortOrder: 6 },
  { name: 'CSS', category: 'Frontend', iconUrl: 'https://skillicons.dev/icons?i=css', sortOrder: 7 },
  { name: 'Three.js', category: 'Frontend', iconUrl: 'https://skillicons.dev/icons?i=threejs', sortOrder: 8 },
  { name: 'Framer Motion', category: 'Frontend', iconUrl: 'https://skillicons.dev/icons?i=framer', sortOrder: 9 },
  { name: 'shadcn/ui', category: 'Frontend', iconUrl: 'https://skillicons.dev/icons?i=shadcn', sortOrder: 10 },

  // ── Mobile ──
  { name: 'Kotlin', category: 'Mobile', iconUrl: 'https://skillicons.dev/icons?i=kotlin', sortOrder: 11 },
  { name: 'Jetpack Compose', category: 'Mobile', iconUrl: 'https://skillicons.dev/icons?i=jetpackcompose', sortOrder: 12 },
  { name: 'Flutter', category: 'Mobile', iconUrl: 'https://skillicons.dev/icons?i=flutter', sortOrder: 13 },
  { name: 'Dart', category: 'Mobile', iconUrl: 'https://skillicons.dev/icons?i=dart', sortOrder: 14 },
  { name: 'Android Studio', category: 'Mobile', iconUrl: 'https://skillicons.dev/icons?i=androidstudio', sortOrder: 15 },

  // ── Backend ──
  { name: 'Node.js', category: 'Backend', iconUrl: 'https://skillicons.dev/icons?i=nodejs', sortOrder: 16 },
  { name: 'Express', category: 'Backend', iconUrl: 'https://skillicons.dev/icons?i=express', sortOrder: 17 },
  { name: 'FastAPI', category: 'Backend', iconUrl: 'https://skillicons.dev/icons?i=fastapi', sortOrder: 18 },
  { name: 'Python', category: 'Backend', iconUrl: 'https://skillicons.dev/icons?i=py', sortOrder: 19 },
  { name: 'Laravel', category: 'Backend', iconUrl: 'https://skillicons.dev/icons?i=laravel', sortOrder: 20 },
  { name: 'PHP', category: 'Backend', iconUrl: 'https://skillicons.dev/icons?i=php', sortOrder: 21 },
  { name: 'Java', category: 'Backend', iconUrl: 'https://skillicons.dev/icons?i=java', sortOrder: 22 },

  // ── Database ──
  { name: 'PostgreSQL', category: 'Database', iconUrl: 'https://skillicons.dev/icons?i=postgres', sortOrder: 23 },
  { name: 'MySQL', category: 'Database', iconUrl: 'https://skillicons.dev/icons?i=mysql', sortOrder: 24 },
  { name: 'Drizzle', category: 'Database', iconUrl: 'https://skillicons.dev/icons?i=drizzle', sortOrder: 25 },
  { name: 'Prisma', category: 'Database', iconUrl: 'https://skillicons.dev/icons?i=prisma', sortOrder: 26 },
  { name: 'Supabase', category: 'Database', iconUrl: 'https://skillicons.dev/icons?i=supabase', sortOrder: 27 },

  // ── DevOps ──
  { name: 'Docker', category: 'DevOps', iconUrl: 'https://skillicons.dev/icons?i=docker', sortOrder: 28 },
  { name: 'Jenkins', category: 'DevOps', iconUrl: 'https://skillicons.dev/icons?i=jenkins', sortOrder: 29 },
  { name: 'Firebase', category: 'Cloud & Deployment', iconUrl: 'https://skillicons.dev/icons?i=firebase', sortOrder: 30 },

  // ── Deployment ──
  { name: 'Vercel', category: 'DevOps', iconUrl: 'https://skillicons.dev/icons?i=vercel', sortOrder: 31 },

  // ── Cloud ──
  // (placeholder for future cloud skills)

  // ── Design ──
  { name: 'Figma', category: 'Design', iconUrl: 'https://skillicons.dev/icons?i=figma', sortOrder: 32 },
  { name: 'Canva', category: 'Design', iconUrl: 'https://skillicons.dev/icons?i=canva', sortOrder: 33 },

  // ── Tools ──
  { name: 'GitHub', category: 'Tools', iconUrl: 'https://skillicons.dev/icons?i=github', sortOrder: 34 },
  { name: 'Zustand', category: 'Tools', iconUrl: 'https://skillicons.dev/icons?i=zustand', sortOrder: 35 },
  { name: 'Postman', category: 'Tools', iconUrl: 'https://skillicons.dev/icons?i=postman', sortOrder: 36 },
  { name: 'VS Code', category: 'Tools', iconUrl: 'https://skillicons.dev/icons?i=vscode', sortOrder: 37 },
]

export async function seedSkills() {
  console.log('Seeding skills...')
  await db.delete(skillsTable)
  for (const skill of skills) {
    await db.insert(skillsTable).values(skill)
    console.log(`  \u2713 ${skill.name} (${skill.category})`)
  }
  console.log(`  \u2192 ${skills.length} skills inserted\n`)
}
