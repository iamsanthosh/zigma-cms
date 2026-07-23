/**
 * Shared utility functions for API route handlers
 * Prevents code duplication across resource endpoints
 */

export function serializeRow(row, resource) {
  const out = { ...row };
  if (resource && resource.json) {
    for (const field of resource.json) {
      if (out[field] != null && typeof out[field] === 'string') {
        try {
          out[field] = JSON.parse(out[field]);
        } catch {
          /* leave as-is if not valid JSON */
        }
      }
    }
  }
  return out;
}

export function prepareWrite(body, resource) {
  const values = {};
  for (const field of resource.fields) {
    if (!(field in body)) continue;
    let val = body[field];
    if (resource.json.includes(field) && val != null && typeof val !== 'string') {
      val = JSON.stringify(val);
    }
    values[field] = val;
  }
  return values;
}
