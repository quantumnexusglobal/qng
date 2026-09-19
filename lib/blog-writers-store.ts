// Shared Blog Writers Store — people the admin has personally invited to
// write blogs via the Team Writer Portal (/team-portal), each with their
// own auto-generated password (separate from the Join-Us-approved members).

export interface BlogWriter {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  invitedAt: string;
  status: "Active" | "Revoked";
}

const STORAGE_KEY = "qni_blog_writers_v1";

// Unambiguous character set — no 0/O, 1/l/I confusion
const PASSWORD_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

export function generateSimplePassword(length = 8): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += PASSWORD_CHARS[Math.floor(Math.random() * PASSWORD_CHARS.length)];
  }
  return out;
}

function loadWriters(): BlogWriter[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(writers: BlogWriter[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(writers));
}

export function getBlogWriters(): BlogWriter[] {
  return loadWriters();
}

export function saveBlogWriter(writer: BlogWriter): void {
  const all = loadWriters();
  const idx = all.findIndex((w) => w.id === writer.id);
  if (idx >= 0) {
    all[idx] = writer;
  } else {
    all.unshift(writer);
  }
  persist(all);
}

export function deleteBlogWriter(id: string): void {
  const all = loadWriters().filter((w) => w.id !== id);
  persist(all);
}
