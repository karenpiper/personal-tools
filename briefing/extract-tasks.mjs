/**
 * Parses action item lines from Granola meeting summaries and formats them
 * as karenban Task objects ready to insert.
 *
 * Priority mapping (briefing → karenban):
 *   urgent    → urgent
 *   this-week → high
 *   watch     → medium
 *   others    → low
 *
 * Line format:
 *   [KP] Do the thing       → mine
 *   [Others] They do thing  → theirs (still tracked, tagged)
 *   (no prefix)             → defaults to mine
 */

export function extractTasks(actionLines, { client, notes, priority = 'high' } = {}) {
  return actionLines
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      let isOthers = false
      let title = line

      if (/^\[others?\]/i.test(line)) {
        isOthers = true
        title = line.replace(/^\[others?\]\s*/i, '')
      } else if (/^\[kp\]/i.test(line)) {
        title = line.replace(/^\[kp\]\s*/i, '')
      }

      return {
        title,
        priority: isOthers ? 'low' : priority,
        client: client ?? null,
        notes: isOthers ? `Follow up: ${notes ?? 'assigned to others'}` : (notes ?? null),
        tags: isOthers ? ['others', 'follow-up'] : ['briefing'],
      }
    })
}

/**
 * Map briefing priority labels to karenban priority values.
 */
export function mapPriority(briefingPriority) {
  return {
    urgent: 'urgent',
    'this-week': 'high',
    watch: 'medium',
  }[briefingPriority] ?? 'medium'
}
