import type { PageContent, ProjectContent, TeamMember, Technology } from '../../types/cms';
import { projects as legacyProjects, technologies as legacyTechnologies } from '../home/mock-data';

const now = '2026-01-01T00:00:00.000Z';
const stamp = { created_at: now, updated_at: now };
export const mockTechnologies: Technology[] = legacyTechnologies.map((item, index) => ({ ...stamp, id: `tech-${index + 1}`, name: item.name, slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), description: item.description, sort_order: index, is_visible: true }));
export const mockProjects: ProjectContent[] = legacyProjects.map((item, index) => ({ ...stamp, id: item.id, slug: item.id, title: item.title, summary: item.summary, description: item.summary, category: item.category, status: 'published', featured: true, thumbnail_path: null, demo_url: null, repository_url: null, published_at: now, sort_order: index, technologies: mockTechnologies.slice(index, index + 2) }));
export const mockTeam: TeamMember[] = [];
const pageCopy = [
  ['home', 'We build digital things that matter.', 'Studio teknologi independen. Ruang untuk bereksperimen dan membangun bersama.'],
  ['about', 'Small team. Shared curiosity.', 'Kami mengeksplorasi ide melalui desain, teknologi, dan kerja yang terarah.'],
  ['team', 'People behind the work.', 'Profil anggota terverifikasi akan ditampilkan setelah dipublikasikan.'],
  ['projects', 'Selected experiments.', 'Proyek konsep untuk mengeksplorasi kemungkinan baru. Bukan klaim pekerjaan klien.'],
  ['contact', 'Let’s build something.', 'Kirim pertanyaan atau ajakan kolaborasi melalui formulir kontak.'],
] as const;
export const mockPages: PageContent[] = pageCopy.map(([slug, title, description]) => ({
  ...stamp, id: `page-${slug}`, slug, title, description, status: 'published',
  sections: [{ ...stamp, id: `section-${slug}`, page_id: `page-${slug}`, section_key: 'intro', sort_order: 0, status: 'published', content: { kind: 'hero', eyebrow: 'FLEXBOX', title, body: description, actions: [] } }],
}));

