import { NextResponse } from 'next/server'
import { getTasks, addTask, initDb } from '@/lib/kv'
import type { Task } from '@/lib/types'

export async function GET() {
  await initDb()
  const tasks = await getTasks()
  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  await initDb()
  const body = await request.json()
  const task: Task = {
    id: crypto.randomUUID(),
    text: body.text,
    owner: body.owner ?? 'KP',
    project: body.project,
    source: body.source,
    priority: body.priority ?? 'this-week',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: body.dueDate,
  }
  await addTask(task)
  return NextResponse.json(task, { status: 201 })
}
