# 4-Part Online Quantum Session Series & Student Research Support Program

## Overview
The user requested two major additions:
1. **Online Quantum Sessions**: A 4-session online masterclass series on Quantum Computing scheduled across the next 2 months (September & October 2026), complete with attractive visuals, detailed syllabus, and registration flow.
2. **Student & Researcher Support Program**: A dedicated initiative and interactive platform feature to empower students and researchers with cloud QPU compute grants, 1-on-1 expert research mentorship, benchmark sandboxes, and publication/conference support.

---

## User Review Required
> [!NOTE]
> All 4 online sessions will be free for students and researchers, with direct registration links and calendar integration. The Research Support section will include an interactive application modal for immediate research grant and compute credit requests.

---

## Proposed Changes

### 1. Visual Assets (AI Image Generation)
Generate 5 custom, high-resolution visuals matching QNexus India's sleek dark & futuristic aesthetic:
- **`public/events/quantum-session-1.png`**: Quantum Circuits & Qiskit 1.0 architecture visualization.
- **`public/events/quantum-session-2.png`**: Quantum Algorithms, VQE, & Hamiltonian optimization landscapes.
- **`public/events/quantum-session-3.png`**: Quantum Machine Learning (QML) & hybrid neural networks.
- **`public/events/quantum-session-4.png`**: Cryogenic QPU processor & Error Mitigation architecture.
- **`public/research-support-banner.png`**: Holographic quantum compute lab & student research collaboration.

---

### 2. Events Store & Landing Page
#### [MODIFY] [lib/events-store.ts](file:///c:/Users/AANANDI/OneDrive/Desktop/qnexusindia-main/qni/lib/events-store.ts)
- Add the 4 upcoming online quantum masterclass sessions (Sep 12, Sep 26, Oct 10, Oct 24, 2026) with comprehensive agendas, speaker line-ups, and custom image paths.

#### [MODIFY] [components/landing/events-section.tsx](file:///c:/Users/AANANDI/OneDrive/Desktop/qnexusindia-main/qni/components/landing/events-section.tsx)
- Feature the 4-part online masterclass series with prominent online badges, live status indicators, and one-click registration drawers.

#### [MODIFY] [app/events/[id]/page.tsx](file:///c:/Users/AANANDI/OneDrive/Desktop/qnexusindia-main/qni/app/events/[id]/page.tsx)
- Ensure all new event IDs are dynamically resolved and rendered with full descriptions, schedules, and speakers.

---

### 3. Student & Researcher Support Feature
#### [NEW] [components/landing/research-support-section.tsx](file:///c:/Users/AANANDI/OneDrive/Desktop/qnexusindia-main/qni/components/landing/research-support-section.tsx)
- High-impact interactive section on the home page highlighting:
  - **Free Cloud QPU Compute Credits** (IBM Quantum & cloud QPUs)
  - **1-on-1 Research Mentorship** with PhDs & industry scientists
  - **Research Paper Publication & Conference Travel Grants**
  - **Interactive Grant / Mentorship Application Form Modal**

#### [NEW] [app/research/page.tsx](file:///c:/Users/AANANDI/OneDrive/Desktop/qnexusindia-main/qni/app/research/page.tsx)
- Dedicated `/research` page with complete details on funding, compute access tiers, eligibility guidelines for students/researchers, and submission handling.

#### [MODIFY] [components/landing/navigation.tsx](file:///c:/Users/AANANDI/OneDrive/Desktop/qnexusindia-main/qni/components/landing/navigation.tsx)
- Add "Research Support" link to the navbar so visitors can directly explore student & research resources.

#### [MODIFY] [app/page.tsx](file:///c:/Users/AANANDI/OneDrive/Desktop/qnexusindia-main/qni/app/page.tsx)
- Embed `ResearchSupportSection` seamlessly into the homepage flow.

---

## Verification Plan

### Manual Verification
1. **Homepage Check**: Verify the new Research Support section and updated 4-part Online Quantum Sessions display properly with rich animations and responsive layouts.
2. **Events Page Check**: Verify `/events` lists all 4 sessions with tags, attractive images, and interactive details panel.
3. **Research Page Check**: Navigate to `/research` and test the application modal form.
4. **Registration Flow**: Test registering for one of the online quantum sessions via `/events/[id]/register`.
