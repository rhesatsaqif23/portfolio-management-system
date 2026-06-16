import { db } from './db'
import { skillsTable } from '../../src/infrastructure/db/schema'

const BASE = 'https://ipkrjpftddtxwzmylxtf.supabase.co/storage/v1/object/public/tech-stack'

const skills: {
  name: string
  category: 'Frontend' | 'Backend' | 'Mobile' | 'Database' | 'DevOps' | 'Cloud & Deployment' | 'Tools' | 'Design'
  iconUrl: string
  sortOrder: number
}[] = [
  // ── Frontend ──
  { name: 'React', category: 'Frontend', iconUrl: `${BASE}/React.png`, sortOrder: 1 },
  { name: 'Next.js', category: 'Frontend', iconUrl: `${BASE}/Next.js.png`, sortOrder: 2 },
  { name: 'TypeScript', category: 'Frontend', iconUrl: `${BASE}/TypeScript.png`, sortOrder: 3 },
  { name: 'JavaScript', category: 'Frontend', iconUrl: `${BASE}/JavaScript.png`, sortOrder: 4 },
  { name: 'Tailwind CSS', category: 'Frontend', iconUrl: `${BASE}/Tailwind%20CSS.png`, sortOrder: 5 },
  { name: 'HTML', category: 'Frontend', iconUrl: `${BASE}/HTML5.png`, sortOrder: 6 },
  { name: 'CSS', category: 'Frontend', iconUrl: `${BASE}/CSS3.png`, sortOrder: 7 },
  { name: 'Three.js', category: 'Frontend', iconUrl: `${BASE}/Three.js.png`, sortOrder: 8 },
  { name: 'Framer Motion', category: 'Frontend', iconUrl: `${BASE}/Framer%20Motion.png`, sortOrder: 9 },
  { name: 'shadcn/ui', category: 'Frontend', iconUrl: `${BASE}/Shadcn.png`, sortOrder: 10 },

  // ── Mobile ──
  { name: 'Kotlin', category: 'Mobile', iconUrl: `${BASE}/Kotlin.png`, sortOrder: 11 },
  { name: 'Jetpack Compose', category: 'Mobile', iconUrl: `${BASE}/Jetpack%20Compose.png`, sortOrder: 12 },
  { name: 'Flutter', category: 'Mobile', iconUrl: `${BASE}/Flutter.png`, sortOrder: 13 },
  { name: 'Dart', category: 'Mobile', iconUrl: `${BASE}/Dart.png`, sortOrder: 14 },
  { name: 'Android Studio', category: 'Mobile', iconUrl: `${BASE}/Android%20Studio.png`, sortOrder: 15 },

  // ── Backend ──
  { name: 'Node.js', category: 'Backend', iconUrl: `${BASE}/Node.js.png`, sortOrder: 16 },
  { name: 'Express', category: 'Backend', iconUrl: `${BASE}/Express.png`, sortOrder: 17 },
  { name: 'FastAPI', category: 'Backend', iconUrl: `${BASE}/FastAPI.png`, sortOrder: 18 },
  { name: 'Python', category: 'Backend', iconUrl: `${BASE}/Python.png`, sortOrder: 19 },
  { name: 'Laravel', category: 'Backend', iconUrl: `${BASE}/Laravel.png`, sortOrder: 20 },
  { name: 'PHP', category: 'Backend', iconUrl: `${BASE}/PHP.png`, sortOrder: 21 },
  { name: 'Java', category: 'Backend', iconUrl: `${BASE}/Java.png`, sortOrder: 22 },

  // ── Database ──
  { name: 'PostgreSQL', category: 'Database', iconUrl: `${BASE}/PostgresSQL.png`, sortOrder: 23 },
  { name: 'MySQL', category: 'Database', iconUrl: `${BASE}/MySQL.png`, sortOrder: 24 },
  { name: 'Drizzle', category: 'Database', iconUrl: `${BASE}/Drizzle.png`, sortOrder: 25 },
  { name: 'Prisma', category: 'Database', iconUrl: `${BASE}/Prisma.jpg`, sortOrder: 26 },
  { name: 'Supabase', category: 'Database', iconUrl: `${BASE}/Supabase.png`, sortOrder: 27 },

  // ── DevOps ──
  { name: 'Docker', category: 'DevOps', iconUrl: `${BASE}/Docker.png`, sortOrder: 28 },
  { name: 'Jenkins', category: 'DevOps', iconUrl: `${BASE}/Jenkins.png`, sortOrder: 29 },
  { name: 'Firebase', category: 'Cloud & Deployment', iconUrl: `${BASE}/Firebase.png`, sortOrder: 30 },

  // ── Deployment ──
  { name: 'Vercel', category: 'DevOps', iconUrl: `${BASE}/Vercel.png`, sortOrder: 31 },

  // ── Cloud ──
  // (placeholder for future cloud skills)

  // ── Design ──
  { name: 'Figma', category: 'Design', iconUrl: `${BASE}/Figma.png`, sortOrder: 32 },
  { name: 'Canva', category: 'Design', iconUrl: `${BASE}/Canva.png`, sortOrder: 33 },

  // ── Tools ──
  { name: 'GitHub', category: 'Tools', iconUrl: `${BASE}/GitHub.png`, sortOrder: 34 },
  { name: 'Zustand', category: 'Tools', iconUrl: `${BASE}/Zustand.png`, sortOrder: 35 },
  { name: 'Postman', category: 'Tools', iconUrl: `${BASE}/Postman.png`, sortOrder: 36 },
  { name: 'VS Code', category: 'Tools', iconUrl: `${BASE}/VS%20Code.png`, sortOrder: 37 },
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
