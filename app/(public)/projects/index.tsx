import { getProjects } from '../../../features/content/repository';
import { ContentPage, ContentState, usePublicContent } from '../../../components/public/ContentPage';
import { ProjectCard } from '../../../components/public/ProjectCard';
export default function Projects(){const state=usePublicContent(getProjects);return <ContentPage label="PROJECTS / EXPLORATIONS" title="A few things we have made."><ContentState {...state} empty={state.data?.length===0}/>{!state.loading&&!state.error&&state.data?.map(project=><ProjectCard key={project.slug} project={project}/>)}</ContentPage>}
