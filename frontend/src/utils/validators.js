// Standard recognized Top-Level Domains (TLDs)
const VALID_TLDS = new Set([
  'com', 'org', 'net', 'edu', 'gov', 'mil', 'co', 'io', 'in', 'uk', 'us', 'ca', 'de',
  'fr', 'au', 'jp', 'cn', 'ru', 'br', 'nl', 'se', 'no', 'es', 'it', 'ch', 'at', 'be',
  'dk', 'fi', 'app', 'dev', 'tech', 'club', 'store', 'online', 'site', 'me', 'info',
  'biz', 'xyz', 'live', 'space', 'website', 'agency', 'global', 'world', 'solutions',
  'digital', 'network', 'pro', 'email', 'design', 'media', 'ai', 'tv', 'cc', 'mobi',
  'asia', 'cat', 'jobs', 'tel', 'travel', 'museum', 'aero', 'coop', 'name', 'eu', 'int',
  'bank', 'shop', 'blog', 'inc', 'page', 'fun', 'icu', 'one', 'vip', 'work', 'today',
  'fit', 'link', 'guru', 'life', 'team', 'cloud', 'studio', 'group', 'express', 'admin'
]);

/**
 * Validates whether an email address is strictly valid in terms of format,
 * syntax, and top-level domain (TLD).
 * 
 * @param {string} email 
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length > 254) return false;

  // Check structure: localPart@domain
  const parts = trimmed.split('@');
  if (parts.length !== 2) return false;

  const [localPart, domain] = parts;
  if (!localPart || !domain) return false;

  // Local part validation: no leading/trailing dot, no consecutive dots
  if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) return false;
  if (!/^[a-zA-Z0-9._%+-]+$/.test(localPart)) return false;

  // Domain validation: domain must not start/end with dot or contain consecutive dots
  if (domain.startsWith('.') || domain.endsWith('.') || domain.includes('..') || domain.includes('--')) return false;

  const domainParts = domain.split('.');
  if (domainParts.length < 2) return false;

  // Each domain part must be valid alphanumeric/hyphen
  for (const part of domainParts) {
    if (!part || !/^[a-zA-Z0-9-]+$/.test(part)) return false;
    if (part.startsWith('-') || part.endsWith('-')) return false;
  }

  // TLD (last domain part) must be letters only and present in valid TLD set
  const tld = domainParts[domainParts.length - 1].toLowerCase();
  if (!/^[a-zA-Z]{2,24}$/.test(tld)) return false;

  return VALID_TLDS.has(tld);
}
