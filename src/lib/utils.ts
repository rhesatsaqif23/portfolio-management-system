import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeUrl(url: string): string {
  if (!url) return url
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://${url}`
}

/** Returns true if the URL has a valid protocol and a domain with at least one dot */
export function isValidUrl(url: string): boolean {
  if (!url) return true // empty is allowed (optional fields)
  const normalized = normalizeUrl(url)
  try {
    const parsed = new URL(normalized)
    // Must have a hostname that contains at least one dot (e.g. example.com)
    return parsed.hostname.includes('.')
  } catch {
    return false
  }
}
