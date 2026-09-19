// Shared Team Members Store — used by both admin dashboard and public team page

export interface TeamMember {
  id: string;
  name: string;
  role: string; // Position/title. Blank for regular members — only the founder carries a title.
  bio: string;
  imageUrl: string;
  linkedin: string;
  twitter?: string;
  order: number;
  createdAt: string;
}

const STORAGE_KEY = 'qni_team_v1';

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: 'sharvan-sharma',
    name: 'Sharvan Kumar Sharma',
    role: 'Founder & President',
    bio: 'Quantum computing researcher and visionary leading QNG\'s mission to build a global quantum computing ecosystem.',
    imageUrl: '/team/sharvan sharma.jpg',
    linkedin: 'https://www.linkedin.com/in/shravan-kumar-sharma-947a3512b',
    twitter: 'https://twitter.com/sharvansharma',
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'saurabh',
    name: 'Saurabh',
    role: '',
    bio: 'Quantum algorithm researcher specializing in variational eigensolvers, circuit compilation, and pulse control.',
    imageUrl: '/team/Saurabh.jpg',
    linkedin: 'https://in.linkedin.com/in/saurabh-sharma-59910b18b',
    twitter: 'https://twitter.com/saurabh_quantum',
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rajan-jha',
    name: 'Rajan Jha',
    role: '',
    bio: 'Systems architect specializing in hybrid quantum-classical algorithms and pulse-level Qiskit optimization.',
    imageUrl: '/team/Rajan Jha.jpg',
    linkedin: 'https://in.linkedin.com/in/rajan-jha-4a921828a',
    twitter: 'https://twitter.com/rajanjha',
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mayank',
    name: 'Mayank',
    role: '',
    bio: 'Building intuitive interfaces, SDK tooling, and cloud execution portals for quantum developers worldwide.',
    imageUrl: '/team/myank.jpg',
    linkedin: 'https://www.linkedin.com/in/mayank-sharma-aa3648287/',
    twitter: 'https://twitter.com/mayank_product',
    order: 4,
    createdAt: new Date().toISOString(),
  },
];

function loadTeam(): TeamMember[] {
  if (typeof window === 'undefined') return DEFAULT_TEAM;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TEAM));
      return DEFAULT_TEAM;
    }
    const parsed = JSON.parse(raw) as TeamMember[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TEAM));
      return DEFAULT_TEAM;
    }
    return parsed;
  } catch {
    return DEFAULT_TEAM;
  }
}

function persist(members: TeamMember[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

export function getTeamMembers(): TeamMember[] {
  return [...loadTeam()].sort((a, b) => a.order - b.order);
}

export function saveTeamMember(member: TeamMember): void {
  const all = loadTeam();
  const idx = all.findIndex((m) => m.id === member.id);
  if (idx >= 0) {
    all[idx] = member;
  } else {
    all.push(member);
  }
  persist(all);
}

export function deleteTeamMember(id: string): void {
  const all = loadTeam().filter((m) => m.id !== id);
  persist(all);
}

export function createBlankTeamMember(): TeamMember {
  const all = loadTeam();
  const maxOrder = all.reduce((max, m) => Math.max(max, m.order), 0);
  return {
    id: Date.now().toString(),
    name: '',
    role: '',
    bio: '',
    imageUrl: '',
    linkedin: '',
    twitter: '',
    order: maxOrder + 1,
    createdAt: new Date().toISOString(),
  };
}
