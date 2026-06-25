export type Priority = 'urgent' | 'this-week' | 'watch'
export type Owner = 'KP' | 'Others'

export interface Task {
  id: string
  text: string
  owner: Owner
  project?: string
  source?: string
  priority: Priority
  completed: boolean
  createdAt: string
  dueDate?: string
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  urgent: 'Urgent',
  'this-week': 'This Week',
  watch: 'Watch',
}
