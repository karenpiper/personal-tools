import { NextResponse } from 'next/server'
import { updateTask, deleteTask } from '@/lib/kv'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const patch = await request.json()
  const task = await updateTask(params.id, patch)
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(task)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const ok = await deleteTask(params.id)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
