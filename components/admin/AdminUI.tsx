import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

export const colors = { ink: '#050505', blue: '#3F83C5', pale: '#D5DFF0', graphite: '#454A54', canvas: '#F2F2EF', line: '#D8D8D5', error: '#B42318' };
export function AdminButton({ children, onPress, disabled, secondary = false }: { children: string; onPress: () => void; disabled?: boolean; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled: !!disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, secondary && styles.secondary, { opacity: disabled ? 0.45 : pressed ? 0.75 : 1 }]}><Text style={[styles.buttonText, secondary && { color: colors.ink }]}>{children}</Text></Pressable>;
}
export function AdminField({ label, ...props }: TextInputProps & { label: string }) {
  return <View style={{ gap: 8 }}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor="#777777" {...props} style={[styles.input, props.multiline && { minHeight: 110, textAlignVertical: 'top' }, props.style]} /></View>;
}
export function AdminNotice({ title, message, busy = false }: { title: string; message?: string; busy?: boolean }) {
  return <View style={styles.notice}>{busy && <ActivityIndicator color={colors.blue} />}<Text accessibilityRole="header" style={styles.heading}>{title}</Text>{message && <Text style={styles.body}>{message}</Text>}</View>;
}
export function AdminHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return <View style={{ gap: 12, marginBottom: 32 }}>{eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}<Text accessibilityRole="header" style={styles.title}>{title}</Text>{description && <Text style={styles.body}>{description}</Text>}</View>;
}
export const styles = StyleSheet.create({
  title: { fontFamily: 'SpaceGrotesk_500Medium', fontSize: 40, lineHeight: 46, letterSpacing: -1.4, color: colors.ink },
  heading: { fontFamily: 'SpaceGrotesk_500Medium', fontSize: 23, color: colors.ink },
  body: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 23, color: colors.graphite },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1.5, color: colors.blue, textTransform: 'uppercase' },
  label: { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.graphite },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.line, padding: 14, fontSize: 15, color: colors.ink, minHeight: 48 },
  button: { minHeight: 44, paddingHorizontal: 18, paddingVertical: 12, backgroundColor: colors.ink, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.ink },
  secondary: { backgroundColor: 'transparent', borderColor: colors.line },
  buttonText: { fontFamily: 'Inter_500Medium', color: '#FFFFFF', fontSize: 13 },
  notice: { borderWidth: 1, borderColor: colors.line, backgroundColor: '#FFFFFF', padding: 28, gap: 14 },
  error: { fontSize: 14, color: colors.error, lineHeight: 22 },
  panel: { padding: 24, borderWidth: 1, borderColor: colors.line, backgroundColor: '#FFFFFF', gap: 20 },
});
