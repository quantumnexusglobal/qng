// Shared Site Settings Store — contact details editable from the admin dashboard

export interface SiteSettings {
  generalEmail: string;
  mentorshipEmail: string;
  phoneDisplay: string; // e.g. "+1 555 123 4567" — shown to visitors
  phoneLink: string;    // e.g. "+15551234567" — used in tel: links
  linkedin: string;
  twitter: string;
  whatsappGroupLink: string; // e.g. "https://chat.whatsapp.com/xxxxxxx" — auto-opened after registration/join
  updatedAt?: string;
}

const STORAGE_KEY = 'qni_site_settings_v1';

const DEFAULT_SETTINGS: SiteSettings = {
  generalEmail: 'rajan.quantumnexusgobal@gmail.com',
  mentorshipEmail: 'rajan.quantumnexusgobal@gmail.com',
  phoneDisplay: '+1 574 386 6580',
  phoneLink: '+15743866580',
  linkedin: 'https://www.linkedin.com/company/quantumnexusglobal/',
  twitter: 'https://twitter.com/qnexusglobal',
  whatsappGroupLink: 'https://chat.whatsapp.com/your-group-invite',
};

function loadLocal(): SiteSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function persistLocal(settings: SiteSettings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

/** Source of truth is the admin-managed database. Falls back to the local cache when unreachable. */
export async function getSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch('/api/settings', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const merged = { ...DEFAULT_SETTINGS, ...json.data };
        persistLocal(merged);
        return merged;
      }
    }
  } catch {
    // ignore — fall back to local cache below
  }
  return loadLocal();
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  persistLocal(settings);
  await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  }).catch(() => {});
}
