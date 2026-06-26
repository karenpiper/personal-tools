/**
 * Push extracted tasks from the daily briefing into karenban via API.
 *
 * Usage:
 *   node scripts/push-tasks.mjs '[{"title":"...","priority":"high","client":"Acme"}]'
 *
 * Required env vars:
 *   KARENBAN_URL     e.g. https://karenban.vercel.app
 *   KARENBAN_API_KEY the BRIEFING_API_KEY set in Vercel
 */

const [,, tasksJson] = process.argv

if (!tasksJson) {
  console.error('Usage: node push-tasks.mjs \'[...tasks]\'')
  process.exit(1)
}

const { KARENBAN_URL, KARENBAN_API_KEY } = process.env
if (!KARENBAN_URL || !KARENBAN_API_KEY) {
  console.error('Missing KARENBAN_URL or KARENBAN_API_KEY env vars')
  process.exit(1)
}

const tasks = JSON.parse(tasksJson)
let added = 0, failed = 0

for (const t of tasks) {
  const res = await fetch(`${KARENBAN_URL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': KARENBAN_API_KEY,
    },
    body: JSON.stringify(t),
  })

  if (res.ok) {
    console.log(`Added: "${t.title}"`)
    added++
  } else {
    const err = await res.text()
    console.error(`Failed "${t.title}": ${res.status} ${err}`)
    failed++
  }
}

console.log(`\nDone: ${added} added, ${failed} failed`)
