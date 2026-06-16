import { pgTable, uuid, text, timestamp, boolean, integer, date, jsonb, pgEnum, varchar } from 'drizzle-orm/pg-core'

export const skillCategoryEnum = pgEnum('skill_category', ['Frontend', 'Backend', 'Mobile', 'Database', 'DevOps', 'Cloud & Deployment', 'Tools', 'Design'])
export const expTypeEnum = pgEnum('exp_type', ['Work', 'Internship', 'Education', 'Organization', 'Volunteer'])
export const projectCategoryEnum = pgEnum('project_category', ['Web App', 'Mobile App'])
export const achievementCategoryEnum = pgEnum('achievement_category', ['Software Development', 'Hackathon', 'Photo & Video', 'Applied Technology', 'Others'])

export const projectsTable = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  descriptionShort: varchar('description_short', { length: 300 }),
  thumbnailUrl: text('thumbnail_url'),
  techStacks: text('tech_stacks').array(),
  isFeatured: boolean('is_featured').default(false),
  category: projectCategoryEnum('category'),
  githubUrl: text('github_url'),
  liveUrl: text('live_url'),
  additionalLinks: text('additional_links'),
  longDescription: text('long_description'),
  sortOrder: integer('sort_order'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const experiencesTable = pgTable('experiences', {
  id: uuid('id').defaultRandom().primaryKey(),
  orgName: text('org_name').notNull(),
  role: text('role').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  description: text('description').array(),
  type: expTypeEnum('type').notNull(),
  imageUrl: text('image_url'),
  sortOrder: integer('sort_order'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const achievementsTable = pgTable('achievements', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  eventName: text('event_name'),
  organizer: text('organizer'),
  date: date('date').notNull(),
  description: text('description'),
  url: text('url'),
  category: achievementCategoryEnum('category'),
  sortOrder: integer('sort_order'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const profilesTable = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  fullName: text('full_name').notNull(),
  currentRole: text('current_role').notNull(),
  currentRoles: text('current_roles').array().notNull().default([]),
  bioShort: varchar('bio_short', { length: 280 }),
  bioLong: text('bio_long'),
  avatarUrl: text('avatar_url'),
  cvUrl: text('cv_url'),
  location: text('location'),
  email: text('email'),
  github: text('github'),
  linkedin: text('linkedin'),
  instagram: text('instagram'),
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

export const statsTable = pgTable('stats', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: text('key').notNull(),
  value: text('value').notNull(),
  category: text('category'),
  subValue: text('sub_value'),
  icon: text('icon'),
  sortOrder: integer('sort_order'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const caseStudiesTable = pgTable('case_studies', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projectsTable.id, { onDelete: 'cascade' }).notNull(),
  role: text('role').notNull(),
  startDate: date('start_date'),
  endDate: date('end_date'),
  overview: text('overview'),
  problems: jsonb('problems').$type<{ title?: string; description?: string }[]>().default([]),
  solutions: jsonb('solutions').$type<{ title?: string; description?: string }[]>().default([]),
  features: jsonb('features').$type<{ icon?: string; title?: string; description?: string }[]>().default([]),
  contributions: jsonb('contributions').$type<string[]>().default([]),
  results: jsonb('results').$type<{ icon?: string; title?: string; description?: string }[]>().default([]),
  gallery: jsonb('gallery').$type<{ url: string; caption: string }[]>().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})
