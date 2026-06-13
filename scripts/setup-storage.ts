import { config } from 'dotenv'
config({ path: ['.env.local', '.env'] })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
)

const buckets = [
  { id: 'cvs', public: true, description: 'CV/resume uploads from FileUpload component (legacy)' },
  { id: 'cv', public: true, description: 'CV/resume uploads — single fixed filename' },
  { id: 'public', public: true, description: 'Profile CV storage used by profile repository (legacy)' },
  { id: 'project-images', public: true, description: 'Project thumbnail images' },
  { id: 'company-images', public: true, description: 'Company/organization logo images' },
  { id: 'tech-stack', public: true, description: 'Skill icon / technology logo images' },
  { id: 'avatars', public: true, description: 'Profile avatar images' },
  { id: 'case-study-images', public: true, description: 'Case study project screenshot images' },
]

async function main() {
  const { data: existing } = await supabase.storage.listBuckets()
  const existingIds = new Set(existing?.map((b) => b.id) ?? [])

  for (const bucket of buckets) {
    if (existingIds.has(bucket.id)) {
      console.log(`  ✓ bucket "${bucket.id}" already exists`)
      continue
    }
    const { error } = await supabase.storage.createBucket(bucket.id, {
      public: bucket.public,
    })
    if (error) {
      console.error(`  ✗ failed to create bucket "${bucket.id}": ${error.message}`)
    } else {
      console.log(`  ✓ created bucket "${bucket.id}"`)
    }
  }

  console.log('\nStorage setup complete.')
}

main().catch((err) => {
  console.error('Storage setup failed:', err)
  process.exit(1)
})
