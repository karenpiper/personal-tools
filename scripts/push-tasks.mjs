/**
 * Push extracted tasks from the daily briefing into karenban.
 *
 * Usage (called by the briefing routine):
 *   node scripts/push-tasks.mjs '[{"text":"...","priority":"urgent","owner":"KP","source":"Granola"}]'
 *
 * Required env vars:
 *   KARENBAN_URL      e.g. https://karenban.vercel.app
 *   KARENBAN_API_KEY  a secret string you set in both Vercel and here
 */

const [,, tasksJson] = process.argv

if (!tasksJson) {
  console.error('Usage: node push-tasks.mjs \'[...tasks]\' ')
  process.exit(1)
}

const { KARENBAN_URL, KARENBAN_API_KEY } = process.env

if (!KARENBAN_URL || !KARENBAN_API_KEY) {
  console.error('Missing KARENBAN_URL or KARENBAN_API_KEY env vars')
  process.exit(1)
}

const tasks = JSON.parse(tasksJson)

let added = 0, failed = 0

for (const task of tasks) {
  try {
    const res = await fetch(`${KARENBAN_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': KARENBAN_API_KEY,
      },
      body: JSON.stringify(task),
    })
    if (res.ok) {
      added++
    } else {
      const err = await res.text()
      console.error(`Failed to add task "${task.text}": ${res.status} ${err}`)
      failed++
    }
  } catch (e) {
    console.error(`Error adding task "${task.text}":`, e.message)
    failed++
  }
}

console.log(`Done: ${added} added, ${failed} failed`)
