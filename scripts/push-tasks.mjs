/**
 * Push extracted tasks from the daily briefing into karenban via direct DB write.
 *
 * Usage (called by the briefing routine):
 *   node scripts/push-tasks.mjs '[{"title":"...","priority":"high","client":"Acme"}]'
 *
 * Required env var:
 *   DATABASE_URL  — Neon connection string (set in personal-tools env vars)
 *
 * Schema matches karenban's tasks table:
 *   id, title, priority, status, columnId, notes, dueDate, client, tags, createdAt, updatedAt
 */

import { neon } from '@neondatabase/serverless'

const [,, tasksJson] = process.argv

if (!tasksJson) {
  console.error('Usage: node push-tasks.mjs \'[...tasks]\'')
  process.exit(1)
}

const { DATABASE_URL } = process.env
if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL env var')
  process.exit(1)
}

const tasks = JSON.parse(tasksJson)
const db = neon(DATABASE_URL)
const now = new Date().toISOString()

let added = 0, skipped = 0

for (const t of tasks) {
  const id = `briefing-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const priority = t.priority ?? 'medium'
  const title = t.title

  // Skip if a task with the same title already exists (dedup)
  const existing = await db`SELECT id FROM tasks WHERE title = ${title} AND status != 'done' LIMIT 1`
  if (existing.length > 0) {
    console.log(`Skipping duplicate: "${title}"`)
    skipped++
    continue
  }

  await db`
    INSERT INTO tasks (id, title, priority, status, "columnId", notes, "dueDate", client, tags, "createdAt", "updatedAt")
    VALUES (
      ${id}, ${title}, ${priority}, 'todo', 'col-uncategorized',
      ${t.notes ?? null}, ${t.dueDate ?? null}, ${t.client ?? null},
      ${t.tags ?? []}, ${now}, ${now}
    )
  `
  console.log(`Added: "${title}"`)
  added++
}

console.log(`Done: ${added} added, ${skipped} skipped (duplicates)`)
