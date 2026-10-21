import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import { colors, spacing } from '../../constants/tokens';
import { Container } from '../primitives/Container';
import { Typography } from '../primitives/Typography';
import { BrandLogo } from './BrandLogo';
export function PublicFooter(){ return <View style={{backgroundColor:colors.ink,paddingVertical:spacing[16]}}><Container><View style={{gap:spacing[8]}}><BrandLogo inverse/><View style={{height:1,backgroundColor:colors.graphite}}/><View style={{flexDirection:'row',flexWrap:'wrap',gap:spacing[6]}}>{(['about','team','projects','contact'] as const).map(x=><Link key={x} href={`/${x}`} asChild><Pressable style={{minHeight:44,justifyContent:'center'}}><Typography variant="small" style={{color:colors.white}}>{x[0].toUpperCase()+x.slice(1)}</Typography></Pressable></Link>)}<Link href="/dashboard/login" asChild><Pressable style={{minHeight:44,justifyContent:'center'}}><Typography variant="small" style={{color:colors.pale}}>Studio login</Typography></Pressable></Link></View><Typography variant="small" style={{color:colors.muted}}>© {new Date().getFullYear()} Flexbox. Built with care.</Typography></View></Container></View> }
