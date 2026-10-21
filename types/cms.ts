/** Supabase row contracts; public display models remain in content.ts. All content is plain text. */
export type ProjectStatus = 'draft' | 'published' | 'archived';
export type ProfileRole = 'admin' | 'member';
export type MessageStatus = 'new' | 'read' | 'replied' | 'archived';
export type PublicationStatus = 'draft' | 'published';
export type PageSlug = 'home' | 'about' | 'team' | 'projects' | 'contact';
export interface Timestamps { created_at: string; updated_at: string }
export interface ContentLink { label: string; href: string }
export type SectionContent =
 | { kind: 'hero'; eyebrow: string; title: string; body: string; actions: ContentLink[] }
 | { kind: 'narrative'; title: string; paragraphs: string[] }
 | { kind: 'principles'; title: string; items: { title: string; body: string }[] }
 | { kind: 'collection'; title: string; source: 'projects' | 'team' | 'technologies'; limit: number }
 | { kind: 'contact'; title: string; body: string; email: string | null };
export interface Page extends Timestamps { id: string; slug: PageSlug; title: string; description: string; status: PublicationStatus }
export interface PageSection extends Timestamps { id: string; page_id: string; section_key: string; sort_order: number; status: PublicationStatus; content: SectionContent }
export interface PageContent extends Page { sections: PageSection[] }
export interface Technology extends Timestamps { id: string; name: string; slug: string; description: string; sort_order: number; is_visible: boolean }
export interface Project extends Timestamps { id: string; slug: string; title: string; summary: string; description: string; category: string; status: ProjectStatus; featured: boolean; thumbnail_path: string | null; demo_url: string | null; repository_url: string | null; published_at: string | null; sort_order: number }
export interface ProjectTechnology { project_id: string; technology_id: string }
export interface ProjectContent extends Project { technologies: Technology[] }
export interface TeamMember extends Timestamps { id: string; slug: string; name: string; role_title: string; bio: string; avatar_path: string | null; github_url: string | null; linkedin_url: string | null; is_visible: boolean; sort_order: number }
export interface ContactInput { name: string; email: string; subject: string; message: string; website?: string }
export interface ContactMessage extends Timestamps { id: string; name: string; email: string; subject: string; message: string; status: MessageStatus }
export interface Profile extends Timestamps { id: string; display_name: string | null; role: ProfileRole }
export interface ContentRepository {
 readonly source: 'mock' | 'supabase';
 getPage(slug: PageSlug): Promise<PageContent | null>;
 listProjects(): Promise<ProjectContent[]>;
 getProject(slug: string): Promise<ProjectContent | null>;
 listTeam(): Promise<TeamMember[]>;
 listTechnologies(): Promise<Technology[]>;
}
export interface ContactRepository { submit(input: ContactInput): Promise<void> }
