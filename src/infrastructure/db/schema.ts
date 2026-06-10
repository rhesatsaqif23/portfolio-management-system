import { pgTable, uuid, text, timestamp, boolean, integer, date, jsonb, pgEnum, varchar } from 'drizzle-orm/pg-core'

export const skillCategoryEnum = pgEnum('skill_category', ['mobile', 'web', 'backend', 'devops', 'design', 'other'])

export const projectsTable = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  subtitle: text('subtitle'),
  category: text('category'),
  description: text('description'),
  thumbnailUrl: text('thumbnail_url'),
  demoUrl: text('demo_url'),
  repoUrl: text('repo_url'),
  techStack: text('tech_stack').array(),
  isFeatured: boolean('is_featured').default(false),
  sortOrder: integer('sort_order'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const experiencesTable = pgTable('experiences', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  location: text('location').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  description: text('description').array(),
  image: text('image'),
  sortOrder: integer('sort_order'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const achievementsTable = pgTable('achievements', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  position: text('position'),
  issuer: text('issuer'),
  category: text('category'),
  description: text('description'),
  date: date('date'),
  imageUrl: text('image_url'),
  credentialUrl: text('credential_url'),
  sortOrder: integer('sort_order'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const profilesTable = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  fullName: text('full_name').notNull(),
  currentRole: text('current_role').notNull(),
  bioShort: varchar('bio_short', { length: 280 }),
  bioLong: text('bio_long'),
  avatarUrl: text('avatar_url'),
  cvUrl: text('cv_url'),
  location: text('location'),
  email: text('email'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const skillsTable = pgTable('skills', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  category: skillCategoryEnum('category').notNull(),
  iconUrl: text('icon_url'),
  sortOrder: integer('sort_order'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const caseStudiesTable = pgTable('case_studies', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projectsTable.id).notNull(),
  contentMarkdown: text('content_markdown').notNull(),
  galleryJsonb: jsonb('gallery_jsonb').$type<{ url: string; caption: string }[]>().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})
