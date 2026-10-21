import { useCallback } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { Image, Linking, View } from 'react-native';
import { getProjects } from '../../../features/content/repository';
import { ContentPage, ContentState, usePublicContent } from '../../../components/public/ContentPage';
import { Typography } from '../../../components/primitives/Typography';
import { Button } from '../../../components/primitives/Button';
function safeUrl(value?:string|null){if(!value)return null;try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)?u.href:null}catch{return null}}
export default function Detail(){const {slug}=useLocalSearchParams<{slug:string}>();const load=useCallback(async()=>{const projects=await getProjects();return projects.find(p=>p.slug===slug)??null},[slug]);const state=usePublicContent(load);const p=state.data;return <ContentPage label="PROJECT DETAIL" title={p?.title??'Project'}><Link href="/projects">← All projects</Link><ContentState {...state}/>{!state.loading&&!state.error&&!p&&<Typography>Project not found. This project may not be published.</Typography>}{p&&<View style={{gap:24}}><Typography>{p.summary}</Typography>{p.thumbnail_url&&<Image source={{uri:p.thumbnail_url}} accessibilityLabel={p.title} style={{width:'100%',height:360}} resizeMode="contain"/>}<Typography>{p.description}</Typography><View style={{flexDirection:'row',flexWrap:'wrap',gap:16}}>{safeUrl(p.demo_url)&&<Button label="Open demo" onPress={()=>Linking.openURL(safeUrl(p.demo_url)!)}/>} {safeUrl(p.repository_url)&&<Button label="View repository" onPress={()=>Linking.openURL(safeUrl(p.repository_url)!)}/>}</View></View>}</ContentPage>}
