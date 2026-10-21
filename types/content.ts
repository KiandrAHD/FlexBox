export type Project = { id?: string; slug: string; title: string; summary: string; description?: string; category?: string; status?: string; featured?: boolean; thumbnail?: string | null; thumbnail_url?: string | null; demo_url?: string | null; repository_url?: string | null; technologies?: string[] | string; published_at?: string | null };
export type TeamMember = { id?: string; name: string; slug?: string; role?: string; title?: string; bio?: string | null; avatar?: string | null; avatar_url?: string | null; github_url?: string | null; linkedin_url?: string | null };
export type Technology = { id?: string; name: string; description?: string | null };
export type SiteContent = Record<string, unknown>;
/** Structured database/editorial contracts are separate from these public display models. */
export type { PageSlug, SectionContent, Page, PageSection, PageContent, ProjectStatus, ProfileRole, MessageStatus, ContactInput, ContactMessage, Profile, ContentRepository, ContactRepository } from './cms';
