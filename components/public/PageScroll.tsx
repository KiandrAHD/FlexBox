import { PropsWithChildren } from 'react';
import { Platform, ScrollView, View } from 'react-native';
/** Web uses the document scrollbar; native owns a platform ScrollView. */
export function PageScroll({ children }: PropsWithChildren) {
  return Platform.OS === 'web' ? <View style={{ width: '100%' }}>{children}</View> : <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>;
}
