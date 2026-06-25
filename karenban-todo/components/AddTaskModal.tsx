'use client'

import { useState } from 'react'
import type { Priority, Owner } from '@/lib/types'

interface Props {
  onAdd: (task: {
    text: string
    owner: Owner
    project?: string
    source?: string
    priority: Priority
    dueDate?: string
  }) => void
  onClose: () => void
}

export default function AddTaskModal({ onAdd, onClose }: Props) {
  const [text, setText] = useState('')
  const [owner, setOwner] = useState<Owner>('KP')
  const [project, setProject] = useState('')
  const [source, setSource] = useState('')
  const [priority, setPriority] = useState<Priority>('this-week')
  const [dueDate, setDueDate] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    onAdd({
      text: text.trim(),
      owner,
      project: project.trim() || undefined,
      source: source.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>New Task</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Task description"
            rows={3}
            autoFocus
            required
          />

          <div className="form-row">
            <label>
              Owner
              <select value={owner} onChange={(e) => setOwner(e.target.value as Owner)}>
                <option value="KP">KP (me)</option>
                <option value="Others">Others</option>
              </select>
            </label>

            <label>
              Priority
              <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                <option value="urgent">Urgent</option>
                <option value="this-week">This Week</option>
                <option value="watch">Watch</option>
              </select>
            </label>
          </div>

          <div className="form-row">
            <label>
              Project
              <input
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="e.g. Client X"
              />
            </label>

            <label>
              Source
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Granola, Email"
              />
            </label>
          </div>

          <label>
            Due Date
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
