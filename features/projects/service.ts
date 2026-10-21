import { contentRepository } from '../content/repository';
export const listProjects = () => contentRepository.listProjects();
export const getProject = (slug: string) => contentRepository.getProject(slug);
export async function listFeaturedProjects(limit = 2) {
  return (await listProjects()).filter(project => project.featured).slice(0, Math.max(0, Math.min(50, Math.floor(limit))));
}
