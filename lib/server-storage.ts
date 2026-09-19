import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'submissions_store.json');

interface SubmissionsData {
  joins: any[];
  contacts: any[];
  research: any[];
  newsletter: any[];
  registrations: any[];
  'blog-comments': any[];
  'blog-likes': any[];
}

function getInitialData(): SubmissionsData {
  return {
    joins: [],
    contacts: [],
    research: [],
    newsletter: [],
    registrations: [],
    'blog-comments': [],
    'blog-likes': [],
  };
}

export function readServerStore(): SubmissionsData {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('[ServerStorage] Error reading submissions file:', error);
    return getInitialData();
  }
}

export function writeServerStore(data: SubmissionsData): boolean {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('[ServerStorage] Error writing submissions file:', error);
    return false;
  }
}

export function saveServerSubmission(
  type: 'joins' | 'contacts' | 'research' | 'newsletter' | 'registrations' | 'blog-comments' | 'blog-likes',
  item: any
): any {
  const store = readServerStore();
  const existingList = store[type] || [];
  
  // Prevent duplicate submissions by email + timestamp/message
  const isDuplicate = existingList.some((existing: any) => {
    if (existing.id && item.id && existing.id === item.id) return true;
    if (existing.email && item.email && existing.email.toLowerCase() === item.email.toLowerCase()) {
      if (type === 'newsletter') return true;
      if (type === 'joins' && existing.fullName === item.fullName) return true;
      if (type === 'contacts' && existing.message === item.message) return true;
      if (type === 'research' && existing.projectTitle === item.projectTitle) return true;
    }
    return false;
  });

  if (!isDuplicate) {
    const newItem = {
      ...item,
      id: item.id || `${type.slice(0, 2)}-${Date.now()}`,
      createdAt: item.createdAt || new Date().toISOString(),
    };
    store[type] = [newItem, ...existingList];
    writeServerStore(store);
    return newItem;
  }

  return item;
}

export function getServerSubmissions(
  type: 'joins' | 'contacts' | 'research' | 'newsletter' | 'registrations' | 'blog-comments' | 'blog-likes'
): any[] {
  const store = readServerStore();
  return store[type] || [];
}

export function updateServerSubmissionStatus(
  type: 'joins' | 'contacts' | 'research' | 'newsletter' | 'registrations',
  id: string,
  status: string
): boolean {
  const store = readServerStore();
  const list = store[type] || [];
  const updated = list.map((item: any) => {
    if (item.id === id || item._id === id) {
      return { ...item, status };
    }
    return item;
  });
  store[type] = updated;
  return writeServerStore(store);
}

export function deleteServerSubmission(
  type: 'joins' | 'contacts' | 'research' | 'newsletter' | 'registrations',
  id: string
): boolean {
  const store = readServerStore();
  const list = store[type] || [];
  store[type] = list.filter((item: any) => item.id !== id && item._id !== id);
  return writeServerStore(store);
}
