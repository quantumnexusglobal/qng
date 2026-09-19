"use client";

export interface BlogAuthor {
  name: string;
  role: string;
  avatar?: string;
  email?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  author: BlogAuthor;
  readTime: string;
  publishedAt: string;
  status: "Published" | "Draft" | "Archived";
  featured?: boolean;
  tags: string[];
}

const STORAGE_KEY = "qni_blog_posts";

// Blogs are created and published through the admin dashboard.
export const INITIAL_BLOG_POSTS: BlogPost[] = [];
/*
  {
    id: "blog-1",
    slug: "optimizing-vqe-algorithms-superconducting-qubits",
    title: "Optimizing Variational Quantum Eigensolvers for Superconducting Qubits",
    excerpt: "Exploring pulse-level Qiskit control and parameter mapping strategies to minimize noise and execution depth in hardware-native VQE runs.",
    category: "Quantum Algorithms",
    coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Rajan Jha",
      role: "CTO & Co-Founder",
      avatar: "/team/rajan-jha.jpg",
      email: "rajan.jha@qnexusindia.com",
    },
    readTime: "6 min read",
    publishedAt: "2026-08-04T10:00:00Z",
    status: "Published",
    featured: true,
    tags: ["VQE", "Superconducting Qubits", "Qiskit", "Optimization"],
    content: `Variational Quantum Eigensolvers (VQE) represent one of the most promising hybrid quantum-classical algorithms for Near-Term Intermediate-Scale Quantum (NISQ) devices. In this deep dive, we examine hardware-native ansatz design and pulse-level microwave pulse calibration to improve fidelity on superconducting QPU backends.

### Key Breakthroughs in NISQ VQE

1. **Hardware-Efficient Ansatz Customization**: By mapping entangling gates directly to natural cross-resonance interactions, we reduce total CNOT counts by 42%.
2. **Pulse-Level Optimization**: Direct schedule calibration using Qiskit Pulse bypasses rigid gate compilations and avoids coherence decay.
3. **Zero-Noise Extrapolation (ZNE)**: Combining error mitigation with active readout error correction yields chemical accuracy for Lithium Hydride (LiH) ground state estimation.

### Implementation Blueprint

When constructing trial state vectors, parametrized single-qubit rotation gates \\(R_y(\\theta)\\) and \\(R_z(\\phi)\\) are interleaved with native multi-qubit entanglers.

\`\`\`python
# Example ansatz building block in Qiskit
from qiskit.circuit import QuantumCircuit, ParameterVector

def build_hardware_efficient_ansatz(num_qubits, reps):
    qc = QuantumCircuit(num_qubits)
    params = ParameterVector('θ', num_qubits * (reps + 1))
    
    param_idx = 0
    for layer in range(reps):
        for q in range(num_qubits):
            qc.ry(params[param_idx], q)
            param_idx += 1
        for q in range(num_qubits - 1):
            qc.cx(q, q + 1)
            
    return qc
\`\`\`

### Future Outlook
As coherence times extend and pulse scheduling APIs mature, hybrid VQE pipelines will bridge the gap between classical HPC chemistry simulations and quantum fault tolerance.`,
  },
  {
    id: "blog-2",
    slug: "building-scalable-quantum-infrastructure-india",
    title: "Building National Quantum Computing Infrastructure: QNG Roadmap",
    excerpt: "How Quantum Nexus Global is deploying high-throughput quantum simulation clusters and cloud-accessible QPU interfaces across academic hubs.",
    category: "Quantum Infrastructure",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Sharvan Kumar Sharma",
      role: "CEO & Co-Founder",
      avatar: "/team/sharvan-kumar-sharma.jpg",
      email: "sharvan.sharma@qnexusindia.com",
    },
    readTime: "8 min read",
    publishedAt: "2026-08-01T14:30:00Z",
    status: "Published",
    featured: true,
    tags: ["National Mission", "QPU Cloud", "Infrastructure", "Ecosystem"],
    content: `The transformation of quantum computing from theoretical physics labs to industrial enterprise deployment requires robust computational infrastructure. Quantum Nexus Global (QNG) is actively laying the foundation for scalable quantum cloud access across India and international research consortiums.

### Strategic Infrastructure Pillars

* **Enterprise QPU Simulator Cluster**: High-RAM distributed GPU clusters capable of simulating up to 45 qubits in state-vector mode and 100+ qubits in matrix product state (MPS) mode.
* **Unified Developer Gateway**: A REST & gRPC API server enabling seamless submission of OpenQASM 3.0 programs directly to hardware backends.
* **Student & Researcher Enablement**: Providing sponsored access keys to top universities including IITs, IISc, and global partner institutions.

> "Our vision is to empower every engineer and researcher with low-latency access to world-class quantum development tools." — QNG Executive Team

### Microservice Architecture Overview

The QNG Cloud Portal leverages decoupled worker queues backed by Redis and MongoDB to queue, execute, and stream quantum state measurement statistics back to developers in real-time.`,
  },
  {
    id: "blog-3",
    slug: "quantum-machine-learning-drug-discovery",
    title: "Quantum Neural Networks in Molecular Drug Discovery",
    excerpt: "A practical evaluation of parametrized quantum circuits (PQCs) for classification of bioactive compounds and binding affinity prediction.",
    category: "Quantum AI",
    coverImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Subham",
      role: "Lead Quantum Algorithm Engineer",
      avatar: "/team/subham.jpg",
      email: "subham@qnexusindia.com",
    },
    readTime: "5 min read",
    publishedAt: "2026-07-28T09:15:00Z",
    status: "Published",
    featured: false,
    tags: ["QML", "Drug Discovery", "Quantum AI", "Neural Networks"],
    content: `Pharmaceutical drug discovery is plagued by vast chemical search spaces. Quantum Machine Learning (QML) introduces quantum kernel methods and Parametrization Quantum Circuits (PQCs) to detect non-linear feature maps inaccessible to classical models.

### Quantum Feature Maps & Kernels

By embedding classical SMILES molecular descriptors into Hilbert space Hilbert vectors via angle encoding, we calculate quantum kernel matrix \\(K(x, y) = |\\langle \\Phi(x) | \\Phi(y) \\rangle|^2\\).

#### Experimental Benchmarks
* **Target Dataset**: 5,000 active vs inactive kinase inhibitors.
* **Model Accuracy**: Quantum Kernel SVM achieved 91.4% accuracy compared to 84.2% on standard Classical SVM.
* **Circuit Depth**: Optimized to 18 gate layers on 12-qubit simulator backends.`,
  },
  {
    id: "blog-4",
    slug: "nisq-error-mitigation-techniques-compared",
    title: "Comparative Study of NISQ Error Mitigation Techniques",
    excerpt: "Analyzing Zero-Noise Extrapolation (ZNE), Probabilistic Error Cancellation (PEC), and Readout Error Mitigation in noisy QPU execution.",
    category: "NISQ Error Mitigation",
    coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Aisha Patel",
      role: "Senior Quantum Researcher",
      avatar: "/team/aisha-patel.jpg",
      email: "aisha.patel@qnexusindia.com",
    },
    readTime: "7 min read",
    publishedAt: "2026-07-20T11:45:00Z",
    status: "Published",
    featured: false,
    tags: ["Error Mitigation", "ZNE", "PEC", "NISQ"],
    content: `Quantum noise remains the single greatest bottleneck in NISQ computing. Without full Fault-Tolerant Quantum Error Correction (FTQC), developers rely on mathematical error mitigation to recover uncorrupted expectation values.

### Comparison Table

| Technique | Overhead Cost | Noise Model Assumption | Practical Qubit Scale |
| :--- | :--- | :--- | :--- |
| Zero-Noise Extrapolation (ZNE) | Low (3x-5x shots) | Global noise scaling | Up to 127 qubits |
| Probabilistic Error Cancellation (PEC) | High (Exponential) | Fully characterized noise | 10-20 qubits |
| Readout Error Mitigation (M3) | Minimal | Matrix inversion | 100+ qubits |

### Practical Recommendations for Quantum Programmers
For medium-scale circuits, a hybrid combination of M3 matrix inversion readout mitigation with polynomial ZNE extrapolation yields optimal trade-offs between execution time and precision.`,
  },
];
*/

const LEGACY_SEEDED_BLOG_IDS = new Set(['blog-1', 'blog-2', 'blog-3', 'blog-4']);

export function getBlogs(): BlogPost[] {
  if (typeof window === "undefined") return INITIAL_BLOG_POSTS;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return INITIAL_BLOG_POSTS;
  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return INITIAL_BLOG_POSTS;
    const cleaned = parsed.filter((blog) => !LEGACY_SEEDED_BLOG_IDS.has(blog.id));
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return INITIAL_BLOG_POSTS;
  }
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  const blogs = getBlogs();
  return blogs.find((b) => b.slug === slug || b.id === slug);
}

export function saveBlog(blogData: Omit<BlogPost, "id" | "publishedAt" | "slug"> & { id?: string; publishedAt?: string; slug?: string }): BlogPost {
  const blogs = getBlogs();
  const now = new Date().toISOString();
  
  // Auto-generate slug if missing
  let slug = blogData.slug
    ? blogData.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    : blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  if (!slug) slug = `post-${Date.now()}`;

  const newPost: BlogPost = {
    id: blogData.id || `blog-${Date.now()}`,
    slug,
    title: blogData.title,
    excerpt: blogData.excerpt,
    content: blogData.content,
    category: blogData.category || "Quantum Tech",
    coverImage: blogData.coverImage || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
    author: blogData.author || {
      name: "QNG Team Member",
      role: "Quantum Researcher",
    },
    readTime: blogData.readTime || "4 min read",
    publishedAt: blogData.publishedAt || now,
    status: blogData.status || "Published",
    featured: blogData.featured ?? false,
    tags: blogData.tags && blogData.tags.length > 0 ? blogData.tags : ["Quantum", "Tech"],
  };

  const existingIndex = blogs.findIndex((b) => b.id === newPost.id || b.slug === newPost.slug);
  let updatedBlogs: BlogPost[];
  if (existingIndex >= 0) {
    updatedBlogs = [...blogs];
    updatedBlogs[existingIndex] = newPost;
  } else {
    updatedBlogs = [newPost, ...blogs];
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBlogs));
  }

  return newPost;
}

export function deleteBlog(id: string): boolean {
  const blogs = getBlogs();
  const updated = blogs.filter((b) => b.id !== id && b.slug !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return true;
}
