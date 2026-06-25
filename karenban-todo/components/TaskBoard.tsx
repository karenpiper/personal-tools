'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Task, Priority, Owner } from '@/lib/types'
import TaskCard from './TaskCard'
import AddTaskModal from './AddTaskModal'

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filterOwner, setFilterOwner] = useState<Owner | 'All'>('All')
  const [filterPriority, setFilterPriority] = useState<Priority | 'All'>('All')
  const [showCompleted, setShowCompleted] = useState(false)

  const loadTasks = useCallback(async () => {
    const res = await fetch('/api/tasks')
    if (res.ok) setTasks(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { loadTasks() }, [loadTasks])

  async function handleAdd(data: Parameters<React.ComponentProps<typeof AddTaskModal>['onAdd']>[0]) {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const task: Task = await res.json()
      setTasks((prev) => [task, ...prev])
    }
  }

  async function handleToggle(id: string, completed: boolean) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)))
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    })
  }

  async function handleDelete(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
  }

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    window.location.href = '/login'
  }

  const filtered = tasks.filter((t) => {
    if (!showCompleted && t.completed) return false
    if (filterOwner !== 'All' && t.owner !== filterOwner) return false
    if (filterPriority !== 'All' && t.priority !== filterPriority) return false
    return true
  })

  const urgentCount = tasks.filter((t) => !t.completed && t.priority === 'urgent').length
  const doneCount = tasks.filter((t) => t.completed).length

  return (
    <div className="board">
      <header className="board-header">
        <div className="board-title">
          <h1>Karenban</h1>
          {urgentCount > 0 && <span className="urgent-pill">{urgentCount} urgent</span>}
        </div>
        <div className="board-stats">
          {doneCount}/{tasks.length} done
        </div>
        <button className="btn-logout" onClick={handleLogout}>Sign out</button>
      </header>

      <div className="board-controls">
        <div className="filters">
          <select value={filterOwner} onChange={(e) => setFilterOwner(e.target.value as Owner | 'All')}>
            <option value="All">All owners</option>
            <option value="KP">KP</option>
            <option value="Others">Others</option>
          </select>

          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as Priority | 'All')}>
            <option value="All">All priorities</option>
            <option value="urgent">Urgent</option>
            <option value="this-week">This Week</option>
            <option value="watch">Watch</option>
          </select>

          <label className="toggle-completed">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
            />
            Show completed
          </label>
        </div>

        <button className="btn-add" onClick={() => setShowModal(true)}>+ Add Task</button>
      </div>

      <div className="task-list">
        {loading && <p className="loading">Loading...</p>}
        {!loading && filtered.length === 0 && (
          <p className="empty">No tasks. {tasks.length > 0 ? 'Try adjusting filters.' : 'Add one above!'}</p>
        )}
        {filtered.map((task) => (
          <TaskCard key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
        ))}
      </div>

      {showModal && <AddTaskModal onAdd={handleAdd} onClose={() => setShowModal(false)} />}
    </div>
  )
}
