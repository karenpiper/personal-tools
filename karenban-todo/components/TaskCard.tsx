'use client'

import type { Task, Priority } from '@/lib/types'

interface Props {
  task: Task
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

const PRIORITY_COLORS: Record<Priority, string> = {
  urgent: 'badge-urgent',
  'this-week': 'badge-week',
  watch: 'badge-watch',
}

const PRIORITY_LABELS: Record<Priority, string> = {
  urgent: 'Urgent',
  'this-week': 'This Week',
  watch: 'Watch',
}

export default function TaskCard({ task, onToggle, onDelete }: Props) {
  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <label className="task-check">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id, !task.completed)}
        />
        <span className="task-text">{task.text}</span>
      </label>

      <div className="task-meta">
        <span className={`badge ${PRIORITY_COLORS[task.priority]}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        <span className="badge badge-owner">{task.owner}</span>
        {task.project && <span className="badge badge-project">{task.project}</span>}
        {task.source && <span className="badge badge-source">{task.source}</span>}
        {task.dueDate && (
          <span className="badge badge-due">
            Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      <button className="task-delete" onClick={() => onDelete(task.id)} aria-label="Delete task">
        ×
      </button>
    </div>
  )
}
