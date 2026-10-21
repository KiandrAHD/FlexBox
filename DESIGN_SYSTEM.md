# FLEXBOX Design System

> **Status dokumen:** spesifikasi rekonstruksi teknis, versi 1.0  
> **Target:** Expo, React Native, Expo Router, TypeScript, NativeWind, Supabase  
> **Referensi utama:** [Figma Make — High-Fidelity Website UI/UX Design](https://www.figma.com/make/PnTHByZe9kNhNbUnHTa1mm/High-Fidelity-Website-UI-UX-Design)

## 0. Provenance dan tingkat kepastian

Referensi Figma Make **tidak dapat diinspeksi pada sesi penyusunan ini**. Permintaan konteks desain untuk root `0:1` mengembalikan pesan `You currently have nothing selected`. Karena itu, dokumen ini tidak mengklaim telah melihat frame, layer, component property, atau ukuran terukur dari Figma.

Spesifikasi di bawah disusun dari:

1. brief eksplisit pada permintaan;
2. palette identitas yang diwajibkan;
3. implementasi React/CSS yang tersedia di repository saat dokumen dibuat;
4. kebutuhan halaman lanjutan pada PRD.

Gunakan label berikut:

| Label | Arti |
|---|---|
| **[D] Ditentukan** | Secara eksplisit diwajibkan oleh brief. |
| **[R] Repository** | Terlihat pada implementasi repository, tetapi belum diverifikasi terhadap Figma. |
| **[E] Estimasi** | Rekomendasi implementasi untuk menjaga konsistensi; bukan hasil pengukuran Figma. |
| **[P] PRD extension** | Rancangan lanjutan yang diperlukan produk, tetapi tidak terbukti terlihat di referensi. |
| **[V] Verify** | Harus dibandingkan kembali dengan frame/screenshot Figma saat akses tersedia. |

Urutan otoritas saat terjadi konflik adalah: **screenshot/frame Figma > nilai terukur dari Figma Dev Mode > aset asli > dokumen ini > implementasi repository saat ini**. Jangan menganggap angka `[R]` atau `[E]` sebagai nilai Figma final.

---

## 1. Design philosophy

### 1.1 Karakter visual

FLEXBOX adalah studio teknologi independen dengan bahasa visual:

- **modern editorial:** hierarchy besar, ritme seperti publikasi, metadata kecil, dan section yang dibatasi garis;
- **minimalis dan presisi:** sedikit warna, alignment ketat, dekorasi hanya jika memperjelas sistem;
- **geometris:** identitas dibangun dari bidang isometrik, grid, axis, dan blok solid;
- **premium tanpa ornamental excess:** kualitas datang dari komposisi, tipografi, whitespace, dan detail interaksi;
- **asimetris namun terstruktur:** offset, pergantian arah layout, dan ruang kosong tetap mengikuti grid;
- **human, bukan template AI generik:** copy singkat, visual spesifik, tidak memakai efek dekoratif yang tidak memiliki fungsi.

### 1.2 Prinsip

1. **Clarity over cleverness.** Informasi dan aksi utama harus segera terbaca.
2. **Whitespace is structure.** Ruang kosong adalah bagian layout, bukan area yang harus diisi.
3. **One strong gesture per section.** Setiap section memiliki satu headline, visual, atau data gesture dominan.
4. **Lines before cards.** Gunakan divider dan bidang terbuka; card hanya untuk grouping yang memang membutuhkan boundary.
5. **Color has a job.** Biru untuk identitas/aksi/accent, pale blue-gray untuk bidang sekunder, charcoal untuk kontras, hitam untuk struktur.
6. **Motion confirms state.** Animasi pendek untuk hover, focus, reveal, dan perubahan state; bukan pertunjukan.

### 1.3 Identitas logo

- Mark terdiri dari bidang geometris isometrik menggunakan `#3F83C5`, `#D5DFF0`, `#454A54`, dan `#050505`. **[D]**
- Wordmark menggunakan uppercase `FLEXBOX`, bobot medium/semibold, tracking rapat. **[R][V]**
- Jangan menggambar ulang logo dan menyebutnya aset asli. Jika SVG/logo resmi tersedia, gunakan file tersebut.
- Rekonstruksi CSS/SVG sementara wajib diberi nama `LogoReconstruction` dan komentar bahwa aset perlu diganti. **[E]**
- Clear space minimum: tinggi satu unit bidang mark di seluruh sisi. **[E]**

---

## 2. Design tokens

### 2.1 Color

| Token | HEX | Fungsi | Status |
|---|---:|---|---|
| `color.ink` | `#050505` | Teks utama, background gelap, primary button, border kuat | [D] |
| `color.blue` | `#3F83C5` | Brand accent, link/active state, focus, bidang logo | [D] |
| `color.pale` | `#D5DFF0` | Background accent, bidang logo, selected surface | [D] |
| `color.graphite` | `#454A54` | Teks sekunder, visual gelap, bidang logo | [D] |
| `color.white` | `#FFFFFF` | Surface utama dan teks inverse | [D] |
| `color.paper` | `#F7F7F3` | Canvas publik off-white | [R][V] |
| `color.adminCanvas` | `#F2F2EF` | Canvas dashboard | [R][V] |
| `color.line` | `#D8D8D5` | Divider default | [R][V] |
| `color.muted` | `#777777` | Metadata dan helper text | [E] |
| `color.successBg` | `#E9F2EA` | Background badge success | [R][V] |
| `color.successText` | `#37673E` | Teks badge success | [R][V] |
| `color.error` | `#B42318` | Error text/border; bukan brand color | [E] |
| `color.warning` | `#9A6700` | Warning state | [E] |

```ts
export const colors = {
  ink: "#050505",
  blue: "#3F83C5",
  pale: "#D5DFF0",
  graphite: "#454A54",
  white: "#FFFFFF",
  paper: "#F7F7F3",
  adminCanvas: "#F2F2EF",
  line: "#D8D8D5",
  muted: "#777777",
  successBg: "#E9F2EA",
  successText: "#37673E",
  error: "#B42318",
  warning: "#9A6700",
} as const;
```

Jangan menambahkan gradient. Grid dekoratif hanya boleh memakai garis alpha tunggal di atas warna solid.

### 2.2 Typography

Implementasi repository menggunakan **Space Grotesk** untuk display dan **Inter** untuk body. **[R][V]** Verifikasi family, face, dan variable-axis terhadap Figma sebelum produksi.

| Style | Family | Size desktop / mobile | Weight | Line-height | Letter spacing | Status |
|---|---|---:|---:|---:|---:|---|
| `display.hero` | Space Grotesk | `clamp(66, 8.6vw, 132)` / `58` | 500 | `0.84` / `0.90` | `-0.07em` | [R][V] |
| `display.page` | Space Grotesk | `clamp(65, 7.5vw, 115)` / `58` | 500 | `0.88` | `-0.065em` | [R][V] |
| `display.cta` | Space Grotesk | `clamp(70, 9vw, 135)` / `70` | 500 | `0.85` | `-0.07em` | [R][V] |
| `heading.1` | Space Grotesk | `54` / `42` | 500 | `0.96` | `-0.045em` | [R][V] |
| `heading.2` | Space Grotesk | `44–50` / `36` | 500 | `1.10` | `-0.04em` | [R][V] |
| `heading.3` | Space Grotesk | `31–35` / `28–32` | 500 | `1.10` | `-0.03em` | [R][V] |
| `body.lg` | Inter | `18–21` / `17–18` | 400 | `1.50–1.60` | `0` | [R][V] |
| `body.md` | Inter | `15–17` / `15–16` | 400 | `1.60–1.75` | `0` | [R][V] |
| `body.sm` | Inter | `12–13` | 400–500 | `1.55–1.65` | `0` | [R][V] |
| `label` | Inter | `10–11` | 500–600 | `1.2` | `0.08–0.14em` | [R][V] |
| `code` | platform monospace | `9–10` | 400 | `1.3` | `0.02em` | [R][V] |

Aturan:

- Heading memakai sentence case kecuali wordmark.
- Eyebrow/label uppercase, tracking luas, singkat.
- Jangan mengecilkan headline hanya untuk menghindari wrap; cocokkan lebar kolom dan line break referensi.
- Gunakan `fontScale` yang tetap dapat diakses; layout harus tahan hingga pembesaran teks 200%.

### 2.3 Spacing

Base unit **4 px [E]**. Nilai besar mengikuti ritme repository dan wajib diverifikasi.

| Token | px | Pemakaian |
|---|---:|---|
| `space.1` | 4 | micro offset |
| `space.2` | 8 | inline compact |
| `space.3` | 12 | icon/text |
| `space.4` | 16 | control padding |
| `space.5` | 20 | mobile gutter |
| `space.6` | 24 | card/panel padding |
| `space.8` | 32 | content groups |
| `space.10` | 40 | section subgroups |
| `space.12` | 48 | header/heading separation |
| `space.16` | 64 | major block |
| `space.20` | 80 | page intro |
| `space.24` | 96 | section |
| `space.30` | 120 | desktop section padding |

### 2.4 Grid, container, dan breakpoints

| Item | Desktop | Tablet | Mobile | Status |
|---|---|---|---|---|
| Viewport reference | `1440` | `768–1023` | `375–767` | [E][V] |
| Page gutter | `4.5vw` | `32px` | `20px` | [R][V] |
| Content max width | `1600px` | fluid | fluid | [E][V] |
| Editorial grid | 12 columns | 8 columns | 4 columns | [E] |
| Grid gap | `28–32px` | `24px` | `16–20px` | [E] |
| Public header | `92px` | `80px` | `72px` | [R][V] |
| Admin sidebar | `248px` | `216px` | drawer/hidden | [R][V] |

Breakpoints implementasi:

```ts
export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;
```

Nilai `760px` ada di CSS repository **[R]**, tetapi untuk NativeWind gunakan breakpoint konsisten `768px` kecuali screenshot comparison membuktikan lain.

### 2.5 Border, radius, shadow, motion, focus, z-index

| Token | Nilai | Catatan |
|---|---|---|
| `border.hairline` | `StyleSheet.hairlineWidth` native; `1px` web | Divider |
| `border.strong` | `1px #050505` | Boundary penting |
| `radius.none` | `0` | Default visual language |
| `radius.xs` | `2px` | Badge/control jika dibutuhkan [E] |
| `radius.sm` | `4px` | Modal/control maksimum default [E] |
| `shadow.none` | none | Default |
| `shadow.overlay` | `0 16px 48px rgba(5,5,5,.16)` | Modal/menu saja [E] |
| `motion.fast` | `140ms` | focus/press |
| `motion.base` | `200ms` | hover/state |
| `motion.slow` | `320ms` | menu/modal |
| `easing.standard` | `cubic-bezier(.2,.8,.2,1)` | [E] |
| `focusRing` | `2px #3F83C5`, offset `3px` | Web |

Z-index **[E]**: base `0`, sticky `10`, header `20`, drawer `40`, backdrop `50`, modal `60`, toast `70`.

---

## 3. Global responsive rules

1. **Desktop:** pertahankan editorial asymmetry, alternating project rows, 2-column narrative, dan whitespace besar.
2. **Tablet:** turunkan headline secara fluid, gunakan 8-column grid, pertahankan dua kolom hanya jika tiap kolom tetap terbaca.
3. **Mobile:** semua narrative grid menjadi satu kolom; urutan DOM mengikuti urutan baca; gutter `20px`; dekorasi geometris diperkecil/dipindah tanpa menutupi copy.
4. Navbar berubah menjadi menu button dan panel; focus dipindahkan ke item pertama, `Escape` menutup panel.
5. Project grid menjadi satu kolom; offset team dihapus; table admin berubah menjadi list atau horizontal scroll dengan label kolom tetap jelas.
6. Jangan sekadar melakukan `scale()` terhadap seluruh halaman.
7. Respect `prefers-reduced-motion`; nonaktifkan translate/reveal dan pertahankan perubahan warna instan.

---

## 4. Page-by-page specification

### 4.1 Home — terlihat pada repository, Figma belum terverifikasi [R][V]

Urutan:

1. **Public navbar:** logo kiri; About, Team, Projects, Contact kanan.
2. **Hero:** eyebrow; headline sangat besar “We build digital things that matter.”; intro dan dua CTA; komposisi isometrik di sisi kanan/bawah.
3. **Selected work:** index/label, heading, link archive; dua project rows alternating visual/copy.
4. **Technology statement:** bidang hitam dua kolom; heading kiri, statement dan technology list kanan.
5. **Studio/team teaser:** foto grayscale besar dan copy.
6. **Contact CTA:** pale background, headline oversized, primary blue action, blok geometris.
7. **Footer:** identity, link, location/copyright.

Desktop: hero minimal `~790px [R]`; selected work menggunakan visual sekitar setengah lebar; headline adalah fokus. Mobile: headline `~58px [R]`, hero copy satu kolom, action dapat wrap, komposisi menjadi background sekunder.

### 4.2 About — terlihat pada repository, Figma belum terverifikasi [R][V]

- Page intro tiga zona: index, title, supporting copy.
- Manifesto dibatasi garis atas: statement besar kiri, dua paragraf kanan.
- Principles: empat kolom bernomor, divider vertikal, tanpa card radius.
- Mobile: intro dan manifesto stack; principles satu kolom dengan divider horizontal.

### 4.3 Team — terlihat pada repository, Figma belum terverifikasi [R][V]

- Page intro.
- Grid tiga profile; item kedua offset ke bawah pada desktop.
- Foto portrait grayscale dengan aspect ratio sekitar `0.8 [R]`.
- Metadata: index, nama, role biru, bio, external link.
- Mobile: satu kolom, semua offset dihapus, foto tetap crop konsisten.

### 4.4 Projects — terlihat pada repository, Figma belum terverifikasi [R][V]

- Intro archive.
- Filter tabs tepat di atas divider.
- Grid dua kolom; item dapat memakai asymmetric placement.
- Setiap project: visual, category/status, title, summary.
- Filter aktif hitam/putih; perubahan hasil tidak menggeser focus.
- Mobile: single-column, filter horizontal scroll jika tidak muat.

### 4.5 Project detail — terlihat pada repository, Figma belum terverifikasi [R][V]

- Back link.
- Metadata/title/summary dalam editorial grid.
- Hero visual full content width.
- Case study dua kolom: problem statement dan narrative.
- Technology strip dengan external/live CTA.
- Jika data mendukung [P]: tambahkan outcome, gallery, credits, dan next project hanya jika PRD atau Figma membuktikannya.
- Mobile: visual lebih pendek tetapi tidak terdistorsi; tech strip wrap.

### 4.6 Contact — terlihat pada repository, Figma belum terverifikasi [R][V]

- Intro.
- Form dua kolom: name, email, subject; context full width; submit.
- State: idle, validating, submitting, success, server error.
- Success mengganti form dengan acknowledgement, bukan toast saja.
- Mobile: satu kolom; submit full-width atau mengikuti lebar referensi.

### 4.7 Admin login — PRD extension [P][V]

- Canvas terang; panel login terpusat secara optik, bukan rounded floating card.
- Logo, label “Studio admin”, heading, email, password, submit, forgot password.
- Boundary memakai divider/outline tipis; radius maksimum `4px [E]`.
- Error berada di bawah field dan summary di atas form; jangan membocorkan apakah email terdaftar.
- Mobile: panel full-width dalam gutter `20px`.

### 4.8 Admin dashboard — sebagian terlihat pada repository [R][V]

- Sidebar gelap: brand, section label, nav, unread badge, user block.
- Topbar putih: breadcrumb dan “View website”.
- Content: date/eyebrow, page title, primary action.
- Overview: tiga metric cells; recent projects table; inbox preview.
- Mobile: sidebar menjadi drawer; metrics stack; dashboard tidak memaksa desktop canvas.

### 4.9 Project management dan project form — list sebagian [R], form [P][V]

**List:** search, status filter, project rows, thumbnail, category, status, updated date, row menu.  
**Form:** title, slug, excerpt, content sections, category, status, year, technologies, media, SEO, publish controls.

- Desktop form: main column dan sticky publishing rail.
- Save draft, preview, publish; destructive delete terpisah dan membutuhkan confirmation modal.
- Unsaved changes guard saat keluar.
- Mobile: publishing rail menjadi section biasa; action bar sticky bawah hanya jika tidak menutup field.

### 4.10 Team management — PRD extension [P][V]

- List/reorder team; thumbnail, name, role, visibility.
- Form: name, role, bio, portrait, links, order, published toggle.
- Reorder harus memiliki alternatif keyboard, bukan drag-only.

### 4.11 Technology management — PRD extension [P][V]

- Compact table/list: name, group, usage count, visibility, order.
- Inline edit hanya untuk nilai sederhana; create/edit kompleks memakai form.
- Cegah deletion jika technology masih direferensikan, atau minta reassignment.

### 4.12 Messages inbox — PRD extension, preview terlihat [R][P][V]

- Master list dengan unread dot, sender, subject, timestamp.
- Detail memperlihatkan metadata, body, reply state, archive/spam.
- Desktop dapat dua panel; mobile menggunakan route list → detail.
- Mark read harus optimistis namun rollback saat gagal.

---

## 5. Component specification

### 5.1 Inventory

| Component | Struktur dan ukuran | Variants/states | Responsive |
|---|---|---|---|
| `PublicNavbar` | `72/92px`, logo, nav, menu | default, menu-open, scrolled bila ada di Figma | menu panel mobile |
| `Logo` | mark + wordmark | full, mark-only, inverse | jangan stretch |
| `Footer` | 3 columns, black surface | default | 1 column mobile |
| `PageHero` | eyebrow, title, description, optional visual/actions | home, inner-page, CTA | 3-zone → stack |
| `Button` | min height `48px [R]`, px `18`, square | dark, light, blue, text; hover/focus/disabled/loading | width content; optional full mobile |
| `ProjectGrid` | 2 columns, `28px` gap | archive, selected | 1 column |
| `ProjectItem` | visual + metadata + text | row, tile, compact | alternating order removed |
| `FilterTabs` | outlined tabs over divider | default, hover, active, disabled | horizontal scroll |
| `TeamProfile` | portrait + indexed copy | default, offset | no offset |
| `TechnologyList` | numbered rows, top divider, arrow | light/dark | full width |
| `Field` | label, control, helper/error | idle, focus, filled, disabled, error | full width |
| `AdminSidebar` | brand, nav, badge, user | expanded, drawer | hidden/drawer |
| `AdminTopbar` | breadcrumb, external action | default | compact |
| `DataTable` | header/rows/actions | loading, empty, error | responsive list/scroll |
| `Modal` | backdrop, title, content, actions | confirmation, form | near-full mobile |
| `Toast` | status icon, message, dismiss | success/error/info | bottom mobile |
| `Skeleton` | block preserving final geometry | text/media/table | same layout |
| `EmptyState` | restrained geometric mark, title, copy, CTA | first-use, no-results | fluid |
| `ErrorState` | title, actionable copy, retry | inline/page | fluid |
| `StatusBadge` | compact uppercase label | draft/live/beta/archived/error | never color-only |

### 5.2 Interaction contract

- **Hover:** color/border change; optional `translateY(-2px)` only pada button/project yang terbukti interaktif. **[R][V]**
- **Focus:** selalu visible; blue 2px ring, 3px offset; tidak boleh dihapus.
- **Active/pressed:** opacity `0.85` atau translate kembali ke `0`; tidak mengubah ukuran.
- **Disabled:** opacity `0.5–0.55`, cursor/semantics disabled, tidak menerima event.
- **Loading:** pertahankan lebar control; label berubah dan progress indicator non-emoji.
- **Error:** border/error message + `aria-describedby`; jangan hanya warna.

### 5.3 Detail komponen penting

#### Button

- Struktur: `Pressable` → label → Lucide `ArrowUpRight`/icon relevan.
- Typography `12px/600 [R]`; gap fleksibel; border `1px`.
- Tidak rounded pill. Tidak gradient. Icon `16px [E]`, stroke konsisten.
- External action harus memiliki accessible label yang menjelaskan tujuan.

#### Form field

- Label `10–11px`, uppercase, tracking `0.08em`.
- Input minimum height `48px`; gaya publik dapat memakai bottom border; admin dapat outline tipis jika referensi mendukung.
- Error muncul langsung di bawah field; helper tidak hilang mendadak sehingga layout meloncat.
- Web: `autocomplete`, `inputMode`, dan native semantics. Native: `accessibilityLabel`, `accessibilityHint`.

#### Table

- Row minimum `68px [R]`, padding horizontal `18px [R]`.
- Action menu memiliki target minimum `44×44`.
- Header wajib untuk tabel sebenarnya; jangan menyusun grid visual tanpa semantics pada web.
- Skeleton meniru jumlah dan tinggi row; empty/error berada dalam boundary panel.

#### Modal dan toast

- Modal hanya untuk keputusan blocking; focus trap di web; restore focus setelah close.
- Confirmation destructive menyebut objek yang akan dihapus.
- Toast tidak menggantikan error inline; auto-dismiss minimum 5 detik, pause saat hover/focus.

#### Icons

- Gunakan `lucide-react-native`; default `16`, `20`, atau `24px`; stroke `1.5–2`.
- Jangan menggunakan glyph `↗`, `•••`, `+`, atau emoji sebagai pengganti icon pada implementasi final; gunakan `ArrowUpRight`, `Ellipsis`, `Plus`, `Menu`, `X`.

---

## 6. Visual fidelity rules

1. Jangan mengganti desain tanpa alasan yang terdokumentasi.
2. Dilarang menambahkan gradient, glassmorphism, glow, blob, rounded card berlebihan, ilustrasi abstrak generik, atau animasi yang tidak ada pada referensi.
3. Jangan mengubah line break, proporsi, alignment, hierarchy, atau whitespace untuk “merapikan” desain sebelum dibandingkan dengan screenshot.
4. Jangan memakai emoji sebagai icon.
5. Gunakan Lucide secara konsisten.
6. Gunakan aset asli jika tersedia. Rekonstruksi tidak boleh diklaim sebagai aset asli.
7. Jangan memakai foto substitute sebagai final jika Figma menyediakan aset spesifik.
8. Screenshot referensi pada viewport yang sama adalah acceptance criteria utama.
9. Nilai dokumen bertanda `[E]`, `[R]`, atau `[V]` harus diganti dengan measurement terverifikasi setelah akses Figma tersedia.
10. Geometri dekoratif tidak boleh mengganggu hit target, accessibility tree, atau urutan baca.

---

## 7. Implementation contract

### 7.1 Struktur

```text
app/
  (public)/
    _layout.tsx
    index.tsx
    about.tsx
    team.tsx
    projects/index.tsx
    projects/[slug].tsx
    contact.tsx
  (auth)/admin/login.tsx
  admin/
    _layout.tsx
    index.tsx
    projects/index.tsx
    projects/new.tsx
    projects/[id].tsx
    team/
    technologies/
    messages/
components/
  primitives/      # Button, Text, Field, Divider, Icon
  public/          # Navbar, Footer, ProjectItem, TeamProfile
  admin/           # Sidebar, Topbar, DataTable, StatusBadge
  feedback/        # Toast, Skeleton, EmptyState, ErrorState
constants/
  tokens.ts
features/
  projects/ team/ technologies/ messages/
lib/
  supabase.ts
  validation.ts
```

### 7.2 Tokens dan NativeWind

- Simpan primitive tokens di TypeScript agar dapat digunakan oleh `StyleSheet`, chart, dan komponen.
- Mirror token stabil ke NativeWind theme/CSS variables untuk Expo Web.
- Hindari arbitrary values berulang. Satu-off value diperbolehkan hanya bila hasil measurement Figma dan diberi komentar node/frame.
- Gunakan `Platform.select` hanya untuk perbedaan capability, bukan untuk menghasilkan desain berbeda.
- Untuk ukuran fluid web, gunakan `style`/CSS variable yang mendukung `clamp()`; berikan fallback native berdasarkan breakpoint.

### 7.3 Responsive Expo Web

- Gunakan `useWindowDimensions` melalui hook `useBreakpoint()` terpusat.
- CSS media query/NativeWind breakpoint menangani presentasi; jangan menggandakan seluruh screen component per viewport.
- `ScrollView` vertikal untuk halaman; hindari nested vertical scroll.
- Gunakan `maxWidth` container hanya jika cocok dengan screenshot; area warna/background dapat full bleed.

### 7.4 UI dan business logic

- Screen merangkai layout dan feature hooks; primitive tidak mengakses Supabase.
- Query/mutation berada di `features/*/api.ts`; map data database ke view model sebelum render.
- Form memakai schema validation; server tetap memvalidasi ulang.
- Authorization admin ditegakkan oleh Supabase RLS, bukan hanya route guard.
- Optimistic updates harus memiliki rollback dan feedback.
- Semua state async memiliki loading, empty, error, dan success path.

### 7.5 Accessibility

- Kontras minimum WCAG AA; verifikasi khusus blue-on-pale dan muted-on-dark.
- Target sentuh minimum `44×44`.
- Heading order logis; satu `h1` per page di Expo Web.
- Image memiliki alt yang bermakna atau dianggap decorative.
- Menu, modal, tabs, table, dan form memiliki semantics web yang benar.
- Jangan mengandalkan warna, posisi, atau motion sebagai satu-satunya sinyal.

---

## 8. Acceptance criteria

### 8.1 Prosedur visual QA

1. Dapatkan screenshot Figma tiap halaman pada viewport sumber.
2. Render implementasi pada viewport **persis sama**.
3. Bandingkan side-by-side dan overlay 50%.
4. Periksa berurutan: canvas → container → grid → typography → spacing → assets → states.
5. Catat mismatch sebagai measured delta, bukan opini.
6. Lulus jika tidak ada perbedaan yang terlihat pada hierarchy, alignment, asset, crop, warna, atau interaction state; toleransi pixel hanya ditetapkan setelah viewport/source scale diketahui.

### 8.2 Checklist global

- [ ] Semua warna identitas cocok dengan HEX yang ditentukan.
- [ ] Font family/face/weight/axis telah diverifikasi dari Figma.
- [ ] Headline wrap dan baseline cocok screenshot.
- [ ] Gutter, column width, divider, dan vertical rhythm cocok.
- [ ] Logo dan seluruh aset adalah aset resmi atau diberi label reconstruction.
- [ ] Tidak ada gradient, glassmorphism, emoji icon, atau rounded card tambahan.
- [ ] Lucide icon konsisten ukuran dan stroke.
- [ ] Keyboard/focus/reader flow berfungsi.
- [ ] Desktop, tablet, mobile tidak overflow atau memotong konten.
- [ ] Reduced motion dan text scaling diuji.

### 8.3 Checklist per halaman

| Halaman | Visual | Fungsional dan states |
|---|---|---|
| Home | hero scale/wrap, isometric composition, alternating rows, dark stack, image crop, CTA | nav, CTA, project links, mobile menu |
| About | intro grid, manifesto ratio, four principles, divider rhythm | nav/link, mobile stacking |
| Team | portrait crop, grayscale, offset profile, role accent | profile/external link, image loading/error |
| Projects | intro, filters, asymmetric grid, visual proportions | filtering, active/focus, empty results |
| Project Detail | title grid, hero ratio, narrative, tech strip | back, external link, missing project/error |
| Contact | field alignment, labels, divider, success composition | validation, loading, server error, success, resubmit |
| Admin Login | optical centering, restrained boundary, form rhythm | invalid credentials, loading, recovery, redirect |
| Dashboard | sidebar/topbar dimensions, metric cells, panel grid | loading/error metrics, nav, permissions |
| Project Management | toolbar/table alignment, badge colors, row density | search/filter, pagination, menu, empty/error |
| Project Form | section hierarchy, sticky publishing rail | validation, draft, preview, publish, delete, unsaved guard |
| Team Management | portrait/list consistency, reorder affordance | create/edit/reorder/visibility, upload errors |
| Technology Management | compact density, group hierarchy | CRUD, duplicate validation, referenced deletion |
| Messages Inbox | unread hierarchy, master/detail proportions | mark read, archive, spam, empty/error |

### 8.4 State matrix wajib

Untuk setiap data-driven page:

- [ ] loading pertama;
- [ ] background refresh;
- [ ] empty first-use;
- [ ] empty karena filter/search;
- [ ] recoverable network error + retry;
- [ ] permission/auth error;
- [ ] successful create/update/delete;
- [ ] optimistic mutation rollback;
- [ ] slow image/upload;
- [ ] offline atau timeout yang relevan.

---

## 9. Verification backlog

Saat akses Figma tersedia, lakukan audit berikut sebelum menyatakan fidelity selesai:

1. inventaris semua frame dan viewport;
2. ukur gutter, column, gap, section padding, header/footer;
3. ambil exact typography termasuk font face dan variable settings;
4. ekspor logo, project visuals, photography, dan icon khusus;
5. validasi semua page yang benar-benar ada di Figma;
6. tandai page admin/PRD yang tidak ada sebagai extension, bukan reference-derived;
7. ganti seluruh `[R][V]` dan `[E][V]` dengan nilai verified atau keputusan yang disetujui;
8. simpan screenshot baseline per route untuk regression testing.

Sampai backlog tersebut selesai, dokumen ini adalah kontrak implementasi yang konsisten dan konservatif, **bukan bukti bahwa seluruh detail telah cocok dengan Figma asli**.
