import { neon } from '@neondatabase/serverless'
import type { Task } from './types'

function sql() {
  return neon(process.env.DATABASE_URL!)
}

function rowToTask(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    text: row.text as string,
    owner: row.owner as Task['owner'],
    project: row.project as string | undefined,
    source: row.source as string | undefined,
    priority: row.priority as Task['priority'],
    completed: row.completed as boolean,
    createdAt: row.created_at as string,
    dueDate: row.due_date as string | undefined,
  }
}

export async function initDb(): Promise<void> {
  const db = sql()
  await db`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      owner TEXT NOT NULL DEFAULT 'KP',
      project TEXT,
      source TEXT,
      priority TEXT NOT NULL DEFAULT 'this-week',
      completed BOOLEAN NOT NULL DEFAULT false,
      created_at TEXT NOT NULL,
      due_date TEXT
    )
  `
}

export async function getTasks(): Promise<Task[]> {
  const db = sql()
  const rows = await db`SELECT * FROM tasks ORDER BY created_at DESC`
  return rows.map(rowToTask)
}

export async function addTask(task: Task): Promise<void> {
  const db = sql()
  await db`
    INSERT INTO tasks (id, text, owner, project, source, priority, completed, created_at, due_date)
    VALUES (${task.id}, ${task.text}, ${task.owner}, ${task.project ?? null}, ${task.source ?? null},
            ${task.priority}, ${task.completed}, ${task.createdAt}, ${task.dueDate ?? null})
  `
}

export async function updateTask(id: string, patch: Partial<Task>): Promise<Task | null> {
  const db = sql()
  const rows = await db`SELECT * FROM tasks WHERE id = ${id}`
  if (rows.length === 0) return null

  const current = rowToTask(rows[0] as Record<string, unknown>)
  const updated = { ...current, ...patch }

  await db`
    UPDATE tasks SET
      text = ${updated.text},
      owner = ${updated.owner},
      project = ${updated.project ?? null},
      source = ${updated.source ?? null},
      priority = ${updated.priority},
      completed = ${updated.completed},
      due_date = ${updated.dueDate ?? null}
    WHERE id = ${id}
  `
  return updated
}

export async function deleteTask(id: string): Promise<boolean> {
  const db = sql()
  const result = await db`DELETE FROM tasks WHERE id = ${id} RETURNING id`
  return result.length > 0
}
