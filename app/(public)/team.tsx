import { Image, Linking, View } from 'react-native';
import { getTeam } from '../../features/content/repository';
import { ContentPage, ContentState, usePublicContent } from '../../components/public/ContentPage';
import { Typography } from '../../components/primitives/Typography';
import { Button } from '../../components/primitives/Button';
import { colors } from '../../constants/tokens';
export default function Team(){const state=usePublicContent(getTeam);return <ContentPage label="THE STUDIO / PEOPLE" title="People behind the work."><ContentState {...state} empty={state.data?.length===0}/>{!state.loading&&!state.error&&state.data?.map(member=><View key={member.id??member.name} style={{borderTopWidth:1,borderColor:colors.line,paddingVertical:32,gap:16}}>{member.avatar_url&&<Image source={{uri:member.avatar_url}} accessibilityLabel={member.name} style={{width:160,height:160}}/>}<Typography variant="h3">{member.name}</Typography><Typography variant="label">{member.role}</Typography>{member.bio&&<Typography>{member.bio}</Typography>}{member.github_url&&/^https:\/\//.test(member.github_url)&&<Button label="GitHub profile" variant="text" onPress={()=>Linking.openURL(member.github_url!)}/>}</View>)}</ContentPage>}
