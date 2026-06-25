/**
 * Parses raw action item lines from Granola meeting summaries and formats
 * them as karenban Task objects ready to POST.
 *
 * Each line should be in the form:
 *   [KP] Do the thing  →  owner: KP
 *   [Others] They do something  →  owner: Others
 *   (no prefix) defaults to KP
 */

export function extractTasks(actionLines, { source = 'Granola', project, priority = 'this-week' } = {}) {
  return actionLines
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      let owner = 'KP'
      let text = line

      if (/^\[others?\]/i.test(line)) {
        owner = 'Others'
        text = line.replace(/^\[others?\]\s*/i, '')
      } else if (/^\[kp\]/i.test(line)) {
        owner = 'KP'
        text = line.replace(/^\[kp\]\s*/i, '')
      }

      return { text, owner, source, project, priority }
    })
}

/**
 * Deduplicate tasks against what's already on the board by text similarity.
 * Prevents re-adding the same action item on subsequent runs.
 */
export function deduplicateTasks(newTasks, existingTasks) {
  const existingTexts = new Set(
    existingTasks.map(t => normalise(t.text))
  )
  return newTasks.filter(t => !existingTexts.has(normalise(t.text)))
}

function normalise(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '')
}
