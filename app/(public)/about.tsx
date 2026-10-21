import { View } from 'react-native';
import { getSiteContent, getTechnologies } from '../../features/content/repository';
import { ContentPage, ContentState, usePublicContent } from '../../components/public/ContentPage';
import { Typography } from '../../components/primitives/Typography';
import { colors } from '../../constants/tokens';
const load=async()=>({site:await getSiteContent(),technologies:await getTechnologies()});
export default function About(){const state=usePublicContent(load);return <ContentPage label="ABOUT / FLEXBOX" title="Good tools. Clear thinking."><Typography style={{maxWidth:800}}>Flexbox brings software engineering, design, and digital product exploration together. This is a space for ideas, experiments, and the work we choose to share.</Typography><View style={{gap:24,paddingVertical:32}}><Typography variant="h3">Our approach</Typography><Typography>Start with a useful question. Keep the solution clear. Build, test, and learn from what works.</Typography></View><ContentState {...state}/>{state.data&&<View style={{gap:16}}><Typography variant="h3">Technology, used with intention.</Typography>{state.data.technologies.map(t=><View key={t.name} style={{paddingVertical:16,borderTopWidth:1,borderColor:colors.line}}><Typography>{t.name}</Typography>{t.description&&<Typography variant="small">{t.description}</Typography>}</View>)}</View>}</ContentPage>}
