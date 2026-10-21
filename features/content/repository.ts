import { supabase } from '../../lib/supabase';
import type { ContentRepository, Page, PageContent, PageSection, Project, ProjectContent, TeamMember, Technology } from '../../types/cms';
import { mockPages, mockProjects, mockTeam, mockTechnologies } from './mock-data';

export class ContentError extends Error {
  constructor() { super('Konten tidak dapat dimuat. Silakan coba lagi.'); this.name = 'ContentError'; }
}
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
export const mockContentRepository: ContentRepository = {
  source: 'mock',
  async getPage(slug) { return clone(mockPages.find(page => page.slug === slug) ?? null); },
  async listProjects() { return clone(mockProjects.filter(project => project.status === 'published')); },
  async getProject(slug) { return clone(mockProjects.find(project => project.slug === slug && project.status === 'published') ?? null); },
  async listTeam() { return clone(mockTeam.filter(member => member.is_visible)); },
  async listTechnologies() { return clone(mockTechnologies.filter(technology => technology.is_visible)); },
};

/** Supabase rows mirror types/content.ts. Regenerate database types after applying migrations.
 * No automatic fallback on network/RLS/schema errors: an empty live CMS must stay empty.
 * The explicit publication filters also prevent an admin session leaking draft content into public UI.
 */
export const supabaseContentRepository: ContentRepository = {
  source: 'supabase',
  async getPage(slug) {
    if (!supabase) throw new ContentError();
    const { data, error } = await supabase.from('pages').select('*').eq('slug', slug).eq('status', 'published').maybeSingle();
    if (error) throw new ContentError();
    if (!data) return null;
    const sections = await supabase.from('page_sections').select('*').eq('page_id', data.id).eq('status', 'published').order('sort_order').order('id');
    if (sections.error) throw new ContentError();
    return { ...(data as Page), sections: sections.data as PageSection[] } satisfies PageContent;
  },
  async listProjects() {
    if (!supabase) throw new ContentError();
    const { data, error } = await supabase.from('projects').select('*, project_technologies(technologies(*))').eq('status', 'published').order('sort_order').order('id');
    if (error) throw new ContentError();
    return (data as ProjectRow[]).map(mapProject);
  },
  async getProject(slug) {
    if (!supabase) throw new ContentError();
    const { data, error } = await supabase.from('projects').select('*, project_technologies(technologies(*))').eq('slug', slug).eq('status', 'published').maybeSingle();
    if (error) throw new ContentError();
    return data ? mapProject(data as ProjectRow) : null;
  },
  async listTeam() {
    if (!supabase) throw new ContentError();
    const { data, error } = await supabase.from('team_members').select('*').eq('is_visible', true).order('sort_order').order('id');
    if (error) throw new ContentError();
    return data as TeamMember[];
  },
  async listTechnologies() {
    if (!supabase) throw new ContentError();
    const { data, error } = await supabase.from('technologies').select('*').eq('is_visible', true).order('sort_order').order('id');
    if (error) throw new ContentError();
    return data as Technology[];
  },
};
type ProjectRow = Project & { project_technologies: { technologies: Technology | null }[] };
function mapProject({ project_technologies, ...project }: ProjectRow): ProjectContent {
  return { ...project, technologies: project_technologies.map(link => link.technologies).filter((technology): technology is Technology => Boolean(technology?.is_visible)) };
}
export const contentRepository = supabase ? supabaseContentRepository : mockContentRepository;

/** Public view-model adapters preserve the route contract while rows remain strongly typed. */
export async function getProjects(): Promise<import('../../types/content').Project[]> {
  return (await contentRepository.listProjects()).map(({ technologies, ...project }) => ({ ...project, technologies: technologies.map(technology => technology.name) }));
}
export async function getTeam(): Promise<import('../../types/content').TeamMember[]> {
  return (await contentRepository.listTeam()).map(member => ({ ...member, role: member.role_title, title: member.role_title }));
}
export async function getTechnologies(): Promise<import('../../types/content').Technology[]> {
  return contentRepository.listTechnologies();
}
export async function getSiteContent(): Promise<import('../../types/content').SiteContent> {
  const page = await contentRepository.getPage('about');
  return page ? { title: page.title, description: page.description, sections: page.sections } : {};
}

