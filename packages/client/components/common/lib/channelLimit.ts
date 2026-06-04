/**
 * Voice channel user limit utilities.
 * Limits are stored in the channel description as "[limit:N]" at the start.
 * e.g. "[limit:4] General voice chat"
 */

const LIMIT_RE = /^\[limit:(\d+)\]\s*/;

/**
 * Parse the user limit from a channel description.
 * Returns 0 if no limit is set.
 */
export function parseChannelLimit(description: string | undefined | null): number {
  if (!description) return 0;
  const m = description.match(LIMIT_RE);
  return m ? parseInt(m[1], 10) : 0;
}

/**
 * Strip the [limit:N] tag from a description for display.
 */
export function stripChannelLimit(description: string | undefined | null): string {
  if (!description) return "";
  return description.replace(LIMIT_RE, "");
}

/**
 * Encode a limit + description into the stored string.
 * If limit is 0 or falsy, returns just the description.
 */
export function encodeChannelLimit(limit: number, description: string): string {
  const cleanDesc = stripChannelLimit(description).trim();
  if (!limit || limit <= 0) return cleanDesc;
  return cleanDesc ? `[limit:${limit}] ${cleanDesc}` : `[limit:${limit}]`;
}
