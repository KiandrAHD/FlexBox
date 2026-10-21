// Editorial demo content only. No client work, results, or team identities are claimed.
export const projects = [
  { id: 'ruang', number: '01', title: 'Ruang', category: 'WEB APPLICATION / CONCEPT', summary: 'Satu ruang untuk ide, catatan, dan pekerjaan tim. Eksplorasi workspace yang membuat kolaborasi lebih terarah.', technologies: 'React · TypeScript · Tailwind CSS', kind: 'workspace' as const },
  { id: 'sela', number: '02', title: 'Sela', category: 'DIGITAL EXPERIENCE / CONCEPT', summary: 'Menemukan tempat untuk berhenti sejenak. Konsep direktori ruang kreatif dengan pengalaman pencarian yang sederhana.', technologies: 'Expo · React Native · TypeScript', kind: 'directory' as const },
];
export const technologies = [
  { name: 'React & React Native', description: 'Antarmuka yang terasa natural.' },
  { name: 'Expo & TypeScript', description: 'Fondasi lintas platform yang terstruktur.' },
  { name: 'NativeWind', description: 'Sistem visual yang konsisten.' },
];
export const navigation = [
  { label: 'About', section: 'about' }, { label: 'Team', section: 'team' },
  { label: 'Projects', section: 'projects' }, { label: 'Contact', section: 'contact' },
] as const;
export type HomeSection = 'home' | typeof navigation[number]['section'];
export const repositoryUrl = 'https://github.com/KiandrAHD/FlexBox';
