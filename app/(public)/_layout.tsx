import { Slot } from 'expo-router';
import { View } from 'react-native';
import { colors } from '../../constants/tokens';
import { PublicNavbar } from '../../components/public/PublicNavbar';
import { PublicFooter } from '../../components/public/PublicFooter';
import { PageScroll } from '../../components/public/PageScroll';
export default function PublicLayout() { return <PageScroll><View style={{backgroundColor:colors.paper,minHeight:'100%'}}><PublicNavbar/><Slot/><PublicFooter/></View></PageScroll>; }
