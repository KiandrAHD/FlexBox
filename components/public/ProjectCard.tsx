import { Link } from 'expo-router';
import { Image, Pressable } from 'react-native';
import { Typography } from '../primitives/Typography';
import { colors } from '../../constants/tokens';
export function ProjectCard({project}: {project: {slug:string;title:string;summary:string;category?:string;thumbnail_url?:string|null}}){return <Link href={{pathname:'/projects/[slug]',params:{slug:project.slug}}} asChild><Pressable style={{borderTopWidth:1,borderColor:colors.line,paddingVertical:32,gap:16}}>{project.thumbnail_url&&<Image source={{uri:project.thumbnail_url}} accessibilityLabel={project.title} style={{width:'100%',height:280}} resizeMode="cover"/>}<Typography variant="label" style={{color:colors.blue}}>{project.category || 'PROJECT'}</Typography><Typography variant="h3">{project.title}</Typography><Typography style={{color:colors.graphite}}>{project.summary}</Typography><Typography variant="small">View project ↗</Typography></Pressable></Link>}
