// Lightweight per-browser identity — no login required.
// Set once someone submits the Join Us form or registers for an event;
// stays only on that visitor's own device (localStorage), never shared.

export interface UserIdentity {
  name: string;
  email: string;
  token: string;
  source: 'join' | 'event-register';
  eventTitle?: string;
  createdAt: string;
}

const STORAGE_KEY = 'qni_user_identity';
export const IDENTITY_EVENT = 'qni-identity-changed';

export function generateToken(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`.toUpperCase();
}

export function saveUserIdentity(identity: UserIdentity): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
  window.dispatchEvent(new Event(IDENTITY_EVENT));
}

export function getUserIdentity(): UserIdentity | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserIdentity) : null;
  } catch {
    return null;
  }
}

export function clearUserIdentity(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(IDENTITY_EVENT));
}
