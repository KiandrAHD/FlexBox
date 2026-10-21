import { contentRepository } from '../content/repository';
import type { PageSlug } from '../../types/cms';
export const getPage = (slug: PageSlug) => contentRepository.getPage(slug);

