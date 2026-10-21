import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Container } from '../primitives/Container';
import { Typography } from '../primitives/Typography';
import { Button } from '../primitives/Button';
import { colors, spacing } from '../../constants/tokens';
export function ContentPage({label,title,children}:PropsWithChildren<{label:string;title:string}>){return <Container><View style={{paddingVertical:spacing[16],gap:spacing[8],minHeight:480}}><Typography variant="label" style={{color:colors.blue}}>{label}</Typography><Typography variant="h2" accessibilityLevel={1}>{title}</Typography>{children}</View></Container>}
export function usePublicContent<T>(load:()=>Promise<T>){const [data,setData]=useState<T|null>(null);const [error,setError]=useState(false);const [loading,setLoading]=useState(true);const [attempt,setAttempt]=useState(0);useEffect(()=>{let active=true;Promise.resolve().then(()=>{if(active){setLoading(true);setError(false);}return load();}).then(x=>{if(active)setData(x)}).catch(()=>{if(active)setError(true)}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[load,attempt]);return {data,error,loading,retry:useCallback(()=>setAttempt(x=>x+1),[])};}
export function ContentState({loading,error,retry,empty}: {loading:boolean;error:boolean;retry:()=>void;empty?:boolean}){if(loading)return <Typography accessibilityLiveRegion="polite">Memuat konten…</Typography>;if(error)return <View style={{gap:16}}><Typography accessibilityRole="alert">Konten belum dapat dimuat. Silakan coba kembali.</Typography><Button label="Coba lagi" onPress={retry}/></View>;if(empty)return <Typography>Belum ada konten yang dipublikasikan.</Typography>;return null;}
