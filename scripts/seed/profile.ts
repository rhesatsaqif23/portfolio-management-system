import { db } from './db'
import { profilesTable } from '../../src/infrastructure/db/schema'

const profile = {
  fullName: 'Rhesa Tsaqif Adyatma',
  currentRole: 'Software Engineer',
  currentRoles: ['Full-stack Developer', 'Front-end Developer', 'Mobile Developer'],
  bioShort: 'Web Developer (Next.js) and Mobile Developer (Kotlin & Flutter)',
  bioLong:
    'I\u2019m an Informatics Engineering student at Brawijaya University with a strong interest in Web and Mobile Development. I enjoy transforming ideas and designs into functional, responsive, and user-centered applications, while continuously learning to build scalable and maintainable software solutions.',
  avatarUrl:
    'https://media.licdn.com/dms/image/v2/D5635AQEGjTsjWzhwBA/profile-framedphoto-shrink_800_800/B56ZxXikAhKIAg-/0/1770995204373?e=1781798400&v=beta&t=D5qXBhNWJBNuM2f5UzQdpeOjThLdoCOFpOOcM9XfAdw',
  cvUrl: '',
  location: 'Malang, East Java, Indonesia',
  email: 'atstsaqif23@gmail.com',
  github: 'https://github.com/rhesatsaqif23',
  linkedin: 'https://linkedin.com/in/rhesa-tsaqif',
  instagram: 'https://www.instagram.com/ats_tsaqif_23',
}

export async function seedProfile() {
  console.log('Seeding profile...')
  await db.delete(profilesTable)
  await db.insert(profilesTable).values(profile)
  console.log(`  \u2713 ${profile.fullName}`)
  console.log('  \u2192 1 profile inserted\n')
}
