# PRD — Website Full-Stack Flexbox

**Dokumen:** Product Requirements Document (PRD)  
**Produk:** Website Company Profile & Project Showcase Flexbox  
**Versi:** 1.0  
**Status:** Draft implementasi MVP  
**Bahasa produk:** Indonesia sebagai default; struktur dapat dikembangkan untuk bahasa lain  
**Platform:** Web desktop-first dan responsif untuk tablet/mobile

---

## 1. Ringkasan Produk

Flexbox adalah website company profile untuk memperkenalkan identitas tim, anggota, portofolio proyek, teknologi yang digunakan, dan kanal kontak. Website juga menjadi platform eksperimen bagi tim untuk menguji ide, menampilkan karya baru, serta mengelola konten tanpa perlu mengubah kode setiap kali data proyek atau profil diperbarui.

Produk terdiri dari dua area utama:

1. **Website publik** — dapat diakses pengunjung tanpa login untuk mengenal Flexbox dan menjelajahi proyek.
2. **Dashboard admin** — area terlindungi untuk mengelola proyek, anggota tim, teknologi, serta pesan yang dikirim melalui formulir kontak.

Arsitektur MVP menggunakan Expo, React Native, Expo Router, TypeScript, NativeWind, dan Supabase. Supabase menyediakan PostgreSQL, autentikasi, object storage, dan Row Level Security (RLS). Jangan menambahkan backend framework atau database kedua sebelum kebutuhan produk membuktikannya.

## 2. Latar Belakang dan Masalah

Informasi tim dan proyek sering tersebar di repositori, media sosial, dan dokumen terpisah. Flexbox membutuhkan satu tempat yang terlihat profesional, mudah diperbarui, dan dapat dikembangkan bersama pertumbuhan tim. Dashboard admin diperlukan agar pembaruan konten tidak selalu bergantung pada perubahan source code.

## 3. Tujuan Produk

- Membangun identitas digital Flexbox yang konsisten dan profesional.
- Menampilkan proyek dengan detail, teknologi, status, tautan demo, dan repositori.
- Memungkinkan admin mengelola konten dari dashboard.
- Menyediakan cara bagi pengunjung untuk mengirim pertanyaan atau kolaborasi.
- Menjaga data admin dan pesan pengunjung dengan autentikasi serta kebijakan akses berbasis database.
- Menjadikan basis kode mudah dirawat dan siap dikembangkan tanpa kompleksitas berlebihan.

### 3.1 Indikator Keberhasilan MVP

- Pengunjung dapat membuka halaman utama, tim, daftar proyek, detail proyek, dan kontak.
- Admin dapat login, menambahkan proyek, menyunting proyek, menerbitkan, menyembunyikan, serta mengarsipkannya.
- Data publik bersumber dari Supabase, bukan hardcode di komponen halaman.
- Konten draft tidak terlihat oleh pengunjung publik.
- Pengguna publik tidak dapat membaca atau mengubah pesan kontak dan data dashboard.
- Navigasi dan layout bekerja pada desktop, tablet, dan mobile.
- Alur utama lulus pengujian manual dan automated checks yang disediakan proyek.

## 4. Pengguna dan Hak Akses

### 4.1 Pengunjung Publik

Tidak perlu login. Dapat:
- melihat informasi Flexbox;
- melihat anggota tim yang dipublikasikan;
- menjelajahi proyek yang berstatus `published`;
- membuka tautan demo atau repositori proyek jika tersedia;
- mengirim formulir kontak.

Tidak dapat mengakses dashboard, melihat draft, atau membaca pesan yang dikirim pengunjung lain.

### 4.2 Admin

Login menggunakan Supabase Auth. Dapat:
- melihat ringkasan dashboard;
- melakukan CRUD terhadap data proyek, anggota, dan teknologi;
- mengatur status publikasi dan urutan konten;
- melihat serta memperbarui status pesan kontak;
- mengunggah gambar proyek dan avatar anggota melalui Supabase Storage.

### 4.3 Member (perluasan, bukan kebutuhan MVP)

Skema `profiles` dapat mengakomodasi role `member`, tetapi MVP hanya menyediakan hak pengelolaan penuh kepada admin. Role member tidak boleh otomatis memperoleh akses tulis sebelum aturan dan kebutuhan UI ditetapkan.

## 5. Ruang Lingkup

### 5.1 Termasuk dalam MVP

- Landing page Flexbox.
- Halaman tentang Flexbox.
- Halaman tim.
- Daftar proyek dan detail proyek berdasarkan slug.
- Halaman kontak dengan validasi serta penyimpanan pesan.
- Login dashboard admin dan proteksi route.
- Dashboard ringkas.
- CRUD proyek.
- CRUD anggota tim dasar.
- Pengelolaan teknologi dan relasi teknologi-proyek.
- Daftar dan pengelolaan status pesan kontak.
- Upload gambar proyek dan avatar.
- Supabase Auth, PostgreSQL, Storage, dan RLS.
- UI responsif, loading state, empty state, error state, dan not-found state.
- Validasi data, aksesibilitas dasar, serta pengujian untuk alur inti.

### 5.2 Tidak Termasuk dalam MVP

- Registrasi akun publik.
- Kolaborasi multi-admin dengan granular permission kompleks.
- CMS artikel/journal lengkap.
- Komentar, like, rating, atau sistem komunitas.
- Analytics khusus, sistem billing, atau pembayaran.
- Chat real-time.
- Aplikasi native iOS/Android sebagai target rilis terpisah.
- Backend service tambahan seperti Express/Fastify.
- Integrasi AI/AI agent sebelum kebutuhan dan risiko didefinisikan.

Fitur-fitur tersebut dapat masuk backlog lanjutan setelah MVP stabil.

## 6. Prinsip Produk dan Desain

### 6.1 Arah Visual

- Estetika modern, minimal, bersih, dan berorientasi pada karya.
- Gunakan identitas logo Flexbox yang sudah tersedia sebagai acuan. Jangan mengganti bentuk/logo utama tanpa persetujuan.
- Palet awal: biru sebagai aksen utama, dipadukan dengan hitam/abu-abu dan latar netral. Nilai warna final dapat diletakkan di design tokens.
- Tipografi sans-serif yang jelas, hierarki heading kuat, whitespace yang cukup, dan kartu proyek yang konsisten.
- Hindari efek dekoratif berat, animasi berlebihan, dan background yang mengurangi keterbacaan.
- Animasi harus singkat, tidak mengganggu, dan menghormati preferensi reduced motion bila memungkinkan.

### 6.2 Responsive Behavior

- **Desktop:** layout menjadi prioritas desain; manfaatkan ruang lebar dengan grid dan navigasi yang jelas.
- **Tablet:** jumlah kolom kartu dan jarak layout menyesuaikan lebar viewport.
- **Mobile:** navigasi dapat berubah menjadi menu ringkas; kartu tersusun satu kolom atau sesuai lebar; form mudah digunakan dengan sentuhan.
- Hindari horizontal overflow, terutama pada tabel dashboard, daftar teknologi, dan detail proyek.

### 6.3 Komponen UI Bersama

Buat komponen reusable untuk minimal:
- `Button`, `IconButton`, `Input`, `Textarea`, `Select`, `Checkbox`;
- `Card`, `Badge`, `Modal`/`Dialog`, `ConfirmDialog`, `Toast`;
- `Container`, `SectionHeading`, `PageHeader`, `EmptyState`, `ErrorState`, `LoadingState`;
- `PublicHeader`, `PublicFooter`, `AdminSidebar`/`AdminNavigation`;
- `ProjectCard`, `TeamMemberCard`, `TechnologyBadge`.

Gunakan Lucide React Native untuk ikon yang diperlukan. Hindari menduplikasi komponen dengan perilaku yang sama di banyak halaman.

## 7. Arsitektur Teknologi

### 7.1 Stack Utama

- **Framework:** Expo.
- **UI:** React Native dengan dukungan web melalui Expo/React Native Web.
- **Routing:** Expo Router.
- **Bahasa:** TypeScript dengan strict checking.
- **Styling:** NativeWind; pilih versi yang kompatibel dengan Expo SDK dan jangan mencampur konfigurasi major version.
- **Backend platform:** Supabase.
- **Database:** PostgreSQL dari Supabase.
- **Authentication:** Supabase Auth.
- **File storage:** Supabase Storage.
- **Access control:** PostgreSQL Row Level Security (RLS).
- **Icons:** Lucide React Native.
- **Validasi:** gunakan satu library validasi schema yang konsisten, misalnya Zod, bila sesuai dengan versi stack.
- **Testing:** unit/component tests untuk logika penting, lalu E2E atau browser tests untuk alur kritis sesuai dukungan setup.

### 7.2 Prinsip Arsitektur

- Jangan membuat server API terpisah untuk operasi CRUD biasa jika RLS dan Supabase client sudah mencukupi.
- Semua query dan mutation data lewat modul/fungsi data-access yang terorganisasi, bukan tersebar di komponen UI.
- Validasi input dilakukan di UI untuk pengalaman pengguna dan tetap dijaga oleh constraint/policy database di sisi server.
- UI tidak boleh menjadi satu-satunya lapisan pengamanan.
- Rahasia server tidak boleh disimpan di aplikasi klien.
- Pisahkan komponen publik, fitur dashboard, logika data, schema validasi, dan tipe data.

### 7.3 Catatan Expo Web

Expo Web cocok untuk UI lintas platform. Namun, kebutuhan SEO untuk company profile harus diperiksa sejak awal. Uji metadata, title/description, canonical URL bila digunakan, sitemap/robots, perilaku URL detail proyek, dan hasil render halaman ketika dibuka langsung. Jangan menganggap static export otomatis menyediakan server-side rendering. Jika kebutuhan SEO kritis tidak dapat dipenuhi dengan implementasi Expo yang dipilih, dokumentasikan hasil uji dan ajukan keputusan arsitektur sebelum mengganti framework atau menambahkan lapisan rendering lain.

## 8. Struktur Navigasi dan Halaman

### 8.1 Website Publik

| Route | Nama halaman | Fungsi utama |
|---|---|---|
| `/` | Home | Ringkasan identitas Flexbox, proyek unggulan, anggota, dan ajakan eksplorasi |
| `/about` | Tentang | Cerita, visi/misi atau prinsip, fokus keahlian Flexbox |
| `/team` | Tim | Anggota tim yang ditandai tampil/publik |
| `/projects` | Proyek | Daftar proyek yang sudah dipublikasikan, beserta filter dasar bila diperlukan |
| `/projects/[slug]` | Detail proyek | Deskripsi, gambar, teknologi, tautan demo/repositori |
| `/contact` | Kontak | Informasi kontak dan formulir pesan |
| `not-found` | Halaman tidak ditemukan | Pesan yang jelas dan tautan kembali ke halaman publik |

Halaman journal/blog tidak wajib MVP. Jangan membuat route yang tampak aktif tetapi tidak memiliki fungsi. Jika disiapkan untuk fase selanjutnya, tandai sebagai backlog.

### 8.2 Dashboard Admin

| Route | Nama halaman | Fungsi utama |
|---|---|---|
| `/dashboard/login` | Login | Login admin yang sudah dibuat melalui Supabase Auth |
| `/dashboard` | Overview | Ringkasan jumlah proyek, anggota, pesan baru, dan shortcut tindakan |
| `/dashboard/projects` | Proyek | Tabel/list proyek, pencarian sederhana, filter status, aksi CRUD |
| `/dashboard/projects/new` | Tambah proyek | Form proyek baru |
| `/dashboard/projects/[id]` | Edit proyek | Form perubahan proyek berdasarkan ID |
| `/dashboard/team` | Anggota tim | Kelola profil anggota, visibilitas, dan urutan |
| `/dashboard/technologies` | Teknologi | Kelola katalog teknologi serta relasi proyek |
| `/dashboard/messages` | Pesan masuk | Lihat pesan, ubah status, dan arsipkan pesan |

Route login dan seluruh route dashboard harus diproteksi. Pengguna tanpa sesi diarahkan ke login. Pengguna yang login tetapi bukan admin harus ditolak oleh policy database dan tidak boleh mendapatkan akses admin hanya karena menyembunyikan atau mengubah UI.

## 9. Persyaratan Fungsional

Prioritas: **P0 = wajib MVP**, **P1 = penting jika waktu tersedia**, **P2 = pengembangan lanjutan**.

### FR-01 — Landing Page (P0)

- Menampilkan identitas Flexbox, ringkasan singkat, dan CTA ke proyek/kontak.
- Menampilkan daftar terbatas proyek unggulan berstatus `published`.
- Menampilkan anggota tim yang `is_visible = true` jika data tersedia.
- Menyediakan navigasi ke About, Team, Projects, dan Contact.
- Menyediakan loading, error, dan empty state yang layak.

**Kriteria penerimaan:** draft atau archived projects tidak muncul di landing page; klik kartu menuju detail slug yang sesuai; layout tidak overflow pada ukuran desktop dan mobile.

### FR-02 — Tentang Flexbox (P0)

- Menjelaskan identitas, fokus, nilai/prinsip, dan cara tim bekerja.
- Konten statis dapat berada dalam kode untuk MVP; model CMS tidak wajib.
- Konten tidak boleh memuat klaim prestasi, mitra, atau angka yang belum dikonfirmasi.

**Kriteria penerimaan:** halaman dapat diakses dari navigasi dan memiliki hierarki teks yang jelas.

### FR-03 — Halaman Tim (P0)

- Menampilkan nama, role/title, bio singkat, avatar opsional, dan tautan profil yang tersedia.
- Hanya anggota dengan `is_visible = true` tampil secara publik.
- Admin dapat menambah, mengedit, menyembunyikan, dan mengatur urutan anggota.

**Kriteria penerimaan:** perubahan yang disimpan admin terlihat di website publik tanpa deployment ulang; anggota tersembunyi tidak dapat dibaca melalui query publik.

### FR-04 — Daftar Proyek (P0)

- Menampilkan thumbnail, judul, ringkasan, kategori, teknologi utama, dan status/metadata publik yang diperlukan.
- Hanya menampilkan proyek berstatus `published`.
- Mendukung filter kategori sederhana jika implementasi tidak menunda kebutuhan utama.
- Menangani ketika belum ada proyek yang dipublikasikan.

**Kriteria penerimaan:** draft dan archived tidak ditampilkan; data diambil dari Supabase; hasil kosong dan kegagalan jaringan memiliki state yang jelas.

### FR-05 — Detail Proyek (P0)

- URL berdasarkan `slug` yang unik.
- Menampilkan judul, summary, deskripsi, thumbnail/cover, teknologi, dan tautan demo/repository jika tersedia.
- Tautan eksternal dibuka dengan perilaku yang sesuai platform dan tidak menerima URL berbahaya tanpa validasi.
- Jika slug tidak ditemukan atau proyek tidak published, tampilkan not-found tanpa membocorkan keberadaan draft.

**Kriteria penerimaan:** membuka URL detail langsung di tab baru tetap berfungsi; proyek non-published tidak dapat dilihat publik.

### FR-06 — Kontak (P0)

- Field wajib: nama, email, subjek, dan pesan.
- Validasi required fields, format email, batas panjang, dan normalisasi whitespace yang wajar.
- Saat terkirim, simpan ke tabel `contact_messages` dan tampilkan konfirmasi sukses.
- Jika gagal, berikan pesan yang dapat ditindaklanjuti tanpa menampilkan detail internal database.
- Cegah spam dasar, misalnya cooldown/rate limit melalui mekanisme yang tersedia, honeypot atau verifikasi tambahan bila spam menjadi masalah. Jangan menyimpan data lebih banyak dari yang dibutuhkan.

**Kriteria penerimaan:** pesan valid tersimpan; form tidak mengirim dua kali karena double-click; publik tidak dapat membaca pesan yang terkumpul.

### FR-07 — Login Admin (P0)

- Login menggunakan Supabase Auth; tidak ada registrasi publik.
- Sediakan loading, error, dan logout.
- Sesi dipulihkan ketika halaman dimuat ulang sesuai dukungan platform.
- Jangan menaruh service-role key di klien.

**Kriteria penerimaan:** admin yang valid dapat masuk; pengguna tanpa sesi tidak dapat melihat dashboard; setelah logout, halaman terlindungi tidak tetap tersedia melalui navigasi biasa.

### FR-08 — Dashboard Overview (P0)

- Menampilkan ringkasan: total published projects, total team members yang terlihat, dan pesan berstatus `new`.
- Menampilkan shortcut ke tambah proyek dan pesan masuk.
- Angka bersumber dari query database dengan akses sesuai role.

**Kriteria penerimaan:** overview menampilkan data yang konsisten dan memiliki state loading/error.

### FR-09 — CRUD Proyek (P0)

Field minimum: title, slug, summary, description, category, status, featured, thumbnail, demo URL, repository URL, technologies, published date.

- Slug dibuat dari judul sebagai bantuan, tetapi tetap dapat disunting dan harus unik.
- Status yang tersedia: `draft`, `published`, `archived`.
- Mendukung simpan sebagai draft dan terbitkan.
- Mengonfirmasi aksi yang merusak atau sulit dibatalkan bila diperlukan.
- Memvalidasi tautan eksternal, panjang field, dan relasi teknologi.
- Update `updated_at` secara konsisten, idealnya melalui trigger database.

**Kriteria penerimaan:** admin dapat create/read/update/archive; slug duplikat ditolak dengan pesan jelas; perubahan publikasi tercermin pada website; user non-admin ditolak di database.

### FR-10 — CRUD Anggota Tim (P0)

- Field minimum: nama, slug, role/title, bio, avatar, GitHub URL opsional, LinkedIn URL opsional, visibilitas, sort order.
- Mendukung menyembunyikan profil tanpa menghapus data.
- Validasi slug dan URL.

**Kriteria penerimaan:** admin dapat mengelola anggota; profil tersembunyi tidak tampil di route publik.

### FR-11 — Teknologi (P0)

- Admin dapat menambah, mengganti nama, atau menghapus entri teknologi yang tidak lagi digunakan.
- Proyek dapat dihubungkan ke banyak teknologi melalui relasi many-to-many.
- Hindari teknologi duplikat akibat variasi kapitalisasi/spasi bila bisa ditangani melalui normalisasi dan constraint.

**Kriteria penerimaan:** teknologi proyek tampil konsisten di daftar/detail proyek dan relasi tidak menghasilkan duplikasi.

### FR-12 — Pesan Masuk (P0)

- Admin dapat melihat pesan, nama, email, subjek, isi, dan waktu pengiriman.
- Status pesan: `new`, `read`, `replied`, `archived`.
- Admin dapat mengubah status dan mengarsipkan pesan.
- Jangan membuat endpoint publik yang dapat membaca semua pesan.

**Kriteria penerimaan:** hanya admin dapat membaca/mengubah pesan; status tersimpan dan tetap setelah reload.

### FR-13 — Upload File (P0)

- Gunakan bucket Supabase Storage terpisah untuk gambar proyek dan avatar, atau satu bucket dengan kebijakan folder yang didefinisikan jelas.
- Validasi tipe MIME dan batas ukuran di UI; kebijakan Storage tetap harus diterapkan di server.
- Nama file harus aman dan tidak bergantung sepenuhnya pada nama asli unggahan.
- Penggantian file harus membersihkan objek lama hanya setelah file baru berhasil diunggah dan referensi database diperbarui.

**Kriteria penerimaan:** admin dapat mengunggah gambar yang valid; tipe/ukuran tidak valid ditolak; publik hanya membaca aset yang memang dimaksudkan publik; upload hanya dapat dilakukan role yang diizinkan.

## 10. Skema Database Supabase

Gunakan migration SQL yang tersimpan di repository agar perubahan schema dapat ditinjau dan direproduksi. Aktifkan RLS untuk semua tabel yang terekspos melalui API Supabase.

### 10.1 Enum

- `profile_role`: `admin`, `member`.
- `project_status`: `draft`, `published`, `archived`.
- `message_status`: `new`, `read`, `replied`, `archived`.

Pastikan enum dan tipe kolom pada migration sesuai dengan kode TypeScript. Jangan menyimpan status sebagai string bebas jika enum database sudah ditetapkan.

### 10.2 `profiles`

| Kolom | Tipe | Aturan |
|---|---|---|
| `id` | `uuid` | Primary key, referensi `auth.users(id)`; `on delete cascade` |
| `display_name` | `text` | Opsional atau wajib sesuai keputusan implementasi |
| `role` | `profile_role` | Default `member`; admin awal ditetapkan secara manual oleh pemilik proyek |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Diperbarui melalui trigger jika kolom dipakai |

Jangan memberi akses kepada pengguna untuk menaikkan role sendiri. Role ditentukan oleh kebijakan server/admin terpercaya.

### 10.3 `team_members`

| Kolom | Tipe | Aturan |
|---|---|---|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `name` | `text` | Wajib, panjang dibatasi |
| `slug` | `text` | Wajib, unique; format URL-safe |
| `role_title` | `text` | Wajib atau nullable sesuai desain |
| `bio` | `text` | Opsional, panjang dibatasi |
| `avatar_path` | `text` | Path object storage, nullable |
| `github_url` | `text` | Nullable, divalidasi sebagai URL |
| `linkedin_url` | `text` | Nullable, divalidasi sebagai URL |
| `is_visible` | `boolean` | Default `true` atau `false` sesuai alur editorial; keputusan harus konsisten |
| `sort_order` | `integer` | Default `0` |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Diperbarui melalui trigger |

### 10.4 `projects`

| Kolom | Tipe | Aturan |
|---|---|---|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `title` | `text` | Wajib, panjang dibatasi |
| `slug` | `text` | Wajib, unique; format URL-safe |
| `summary` | `text` | Wajib, ringkasan pendek |
| `description` | `text` | Wajib; tentukan apakah format plain text atau Markdown yang disanitasi |
| `category` | `text` | Wajib atau nullable berdasarkan kebutuhan filter |
| `status` | `project_status` | Default `draft` |
| `featured` | `boolean` | Default `false` |
| `thumbnail_path` | `text` | Nullable; path object storage |
| `demo_url` | `text` | Nullable; hanya URL aman yang didukung |
| `repository_url` | `text` | Nullable; hanya URL aman yang didukung |
| `published_at` | `timestamptz` | Nullable; diisi saat publikasi bila digunakan |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Diperbarui melalui trigger |

Bila sistem membutuhkan halaman konten yang kaya gambar, pertimbangkan tabel `project_media` pada fase berikutnya. Jangan menambahkannya jika MVP hanya membutuhkan satu thumbnail.

### 10.5 `technologies`

| Kolom | Tipe | Aturan |
|---|---|---|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `name` | `text` | Wajib; unique setelah normalisasi yang ditetapkan |
| `slug` | `text` | Wajib, unique |
| `created_at` | `timestamptz` | Default `now()` |

### 10.6 `project_technologies`

| Kolom | Tipe | Aturan |
|---|---|---|
| `project_id` | `uuid` | FK ke `projects(id)`, `on delete cascade` |
| `technology_id` | `uuid` | FK ke `technologies(id)`, `on delete cascade` |

Primary key gabungan: (`project_id`, `technology_id`).

### 10.7 `contact_messages`

| Kolom | Tipe | Aturan |
|---|---|---|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `name` | `text` | Wajib, panjang dibatasi |
| `email` | `text` | Wajib, format email divalidasi |
| `subject` | `text` | Wajib, panjang dibatasi |
| `message` | `text` | Wajib, panjang dibatasi |
| `status` | `message_status` | Default `new` |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Diperbarui melalui trigger jika kolom dipakai |

Jangan simpan kata sandi, token rahasia, atau data sensitif yang tidak dibutuhkan di tabel pesan.

### 10.8 Constraint dan Index

- Unique index pada semua `slug` serta `technologies.name` sesuai strategi normalisasi.
- Index untuk `projects(status, published_at)`, `projects(featured, status)`, `team_members(is_visible, sort_order)`, dan `contact_messages(status, created_at)` sesuai pola query.
- Check constraints atau validasi server untuk batas panjang kolom penting.
- Foreign key pada seluruh relasi.
- Pertimbangkan pencarian `ILIKE` atau filter sederhana terlebih dahulu; full-text search tidak wajib MVP.

## 11. Row Level Security (RLS) dan Keamanan

RLS adalah bagian wajib arsitektur, bukan fitur tambahan.

### 11.1 Helper Admin

Buat fungsi database seperti `is_admin()` yang memeriksa role pengguna terautentikasi di `profiles`. Fungsi harus dirancang dengan aman: tetapkan `search_path` secara eksplisit, batasi hak `EXECUTE` yang tidak diperlukan, hindari recursion pada policy, dan review perilaku `SECURITY DEFINER` jika digunakan. Jangan mengandalkan nilai role yang dikirim dari klien.

### 11.2 Matriks Kebijakan Data

| Tabel | Anon/publik | Admin |
|---|---|---|
| `profiles` | Tidak dapat membaca daftar profil privat atau mengubah role | Baca/ubah sesuai kebutuhan admin |
| `team_members` | `SELECT` hanya untuk `is_visible = true` | CRUD penuh |
| `projects` | `SELECT` hanya untuk `status = 'published'` | CRUD penuh |
| `technologies` | `SELECT` hanya jika dibutuhkan untuk konten publik | CRUD penuh |
| `project_technologies` | `SELECT` hanya untuk relasi proyek published | CRUD penuh |
| `contact_messages` | Hanya `INSERT` dengan validasi; tidak boleh `SELECT`, `UPDATE`, atau `DELETE` | Baca dan ubah status; hapus hanya bila memang dibutuhkan |

Pastikan kondisi `USING` dan `WITH CHECK` policy tidak membuka jalur untuk membuat draft menjadi published oleh pengguna publik. Pengujian wajib dilakukan memakai klien anon dan sesi pengguna non-admin, bukan hanya akun admin.

### 11.3 Supabase Storage

- Objek gambar publik boleh dibaca secara publik hanya jika bucket dan kebijakan memang ditujukan untuk aset website publik.
- `INSERT`, `UPDATE`, dan `DELETE` objek dibatasi untuk admin.
- Validasi MIME type dan ukuran file diberlakukan sesuai kemampuan Storage policy dan pada UI.
- Gunakan path konsisten, misalnya `projects/<uuid>/<filename>` dan `team/<uuid>/<filename>`.
- Jangan menyimpan file rahasia di bucket publik.

### 11.4 Secrets dan Environment Variables

File `.env.example` berisi placeholder berikut:

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Gunakan publishable key Supabase jika project memakai format key terbaru; anon key lama juga merupakan key publik yang dirancang untuk dipakai bersama RLS. **Jangan pernah menaruh `service_role` key, secret key, database password, atau token admin dalam variabel `EXPO_PUBLIC_*`, repository, aplikasi klien, atau log.** Simpan rahasia server hanya pada environment server tepercaya jika nantinya memang ada fungsi server-side.

### 11.5 Perlindungan Tambahan

- Validasi dan normalisasi semua form.
- Tampilkan error aman tanpa membocorkan query, struktur internal, stack trace, atau token.
- Jangan menggunakan HTML mentah dari pengguna. Jika deskripsi mendukung Markdown, render melalui renderer yang aman dan batasi fitur berisiko.
- Terapkan anti-spam untuk form publik sesuai kebutuhan aktual.
- Gunakan redirect URL Supabase Auth yang dibatasi ke domain yang dikendalikan.
- Jangan menulis access token atau informasi pribadi ke log.
- Gunakan dependency yang masih didukung dan jalankan audit/dependency checks sebelum rilis.

## 12. Struktur Folder yang Disarankan

Struktur dapat menyesuaikan konvensi Expo Router yang dipakai, tetapi pemisahan tanggung jawab harus tetap dijaga.

```text
flexbox/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── about.tsx
│   ├── team.tsx
│   ├── contact.tsx
│   ├── projects/
│   │   ├── index.tsx
│   │   └── [slug].tsx
│   └── dashboard/
│       ├── _layout.tsx
│       ├── login.tsx
│       ├── index.tsx
│       ├── projects/
│       │   ├── index.tsx
│       │   ├── new.tsx
│       │   └── [id].tsx
│       ├── team.tsx
│       ├── technologies.tsx
│       └── messages.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   ├── projects/
│   └── team/
├── features/
│   ├── auth/
│   ├── projects/
│   ├── team/
│   ├── technologies/
│   └── contact/
├── lib/
│   ├── supabase.ts
│   ├── validation.ts
│   └── utils.ts
├── hooks/
├── types/
├── constants/
├── assets/
├── supabase/
│   └── migrations/
├── .env.example
├── app.json
├── package.json
├── tailwind.config.js        # menyesuaikan versi NativeWind
├── tsconfig.json
└── README.md
```

Aturan struktur:
- `app/` fokus pada route dan komposisi halaman.
- `features/` memuat operasi data, schema validasi, tipe, dan logika fitur.
- `components/` memuat komponen reusable.
- `lib/supabase.ts` menjadi satu tempat konfigurasi client.
- `supabase/migrations/` menyimpan migration SQL, constraint, trigger, helper function, dan policy.
- Jangan membuat barrel files atau abstraksi tambahan hanya demi abstraksi; prioritaskan keterbacaan.

## 13. Pola Akses Data

- Buat fungsi data-access yang bernama jelas, misalnya `listPublishedProjects()`, `getPublishedProjectBySlug(slug)`, `createProject(input)`, `updateProject(id, input)`, dan `listContactMessages(status)`.
- Input fungsi mutation harus bertipe dan divalidasi sebelum dikirim.
- Query publik wajib mengikutsertakan kriteria `published`/`is_visible`, sekalipun RLS tetap menjadi kontrol utama.
- Penanganan error dilakukan di layer data/fitur, kemudian UI menampilkan pesan yang ramah.
- Hindari mengambil semua baris tanpa batas ketika jumlah konten meningkat; gunakan pagination jika dibutuhkan.
- Ketika menyimpan proyek dengan teknologi, lakukan operasi relasi secara konsisten dan tampilkan error jika salah satu langkah gagal. Hindari menyatakan simpan berhasil sebelum semua langkah penting selesai.
- Generated database types dari Supabase disarankan agar tipe TypeScript sejalan dengan schema.

## 14. Alur Pengguna Inti

### 14.1 Pengunjung Menjelajahi Proyek

1. Pengunjung membuka Home.
2. Sistem mengambil proyek unggulan yang published.
3. Pengunjung membuka halaman Projects.
4. Pengunjung memilih kartu proyek.
5. Sistem mengambil detail berdasarkan slug dan memverifikasi bahwa proyek dapat dilihat publik.
6. Pengunjung membuka tautan demo/repository bila tersedia.

### 14.2 Pengunjung Mengirim Pesan

1. Pengunjung membuka Contact.
2. Mengisi nama, email, subjek, dan pesan.
3. Client memvalidasi input.
4. Supabase menerima insert yang diizinkan RLS dan constraint.
5. UI menampilkan konfirmasi hanya setelah penyimpanan berhasil.
6. Admin melihat pesan melalui dashboard.

### 14.3 Admin Mengelola Proyek

1. Admin membuka `/dashboard/login` dan login.
2. App memulihkan sesi dan memeriksa identitas/role untuk navigasi UI.
3. Database tetap memverifikasi hak akses melalui RLS.
4. Admin menambah atau mengedit data dan mengunggah thumbnail bila perlu.
5. Admin menyimpan sebagai draft atau published.
6. Website publik hanya menampilkan proyek saat status published.

## 15. Validasi Form dan Aturan Konten

Batas panjang berikut adalah nilai awal dan boleh disesuaikan, tetapi harus diterapkan konsisten di UI dan database:

| Field | Validasi awal |
|---|---|
| Nama proyek | wajib, 2–100 karakter |
| Slug proyek | wajib, lowercase URL-safe, unik |
| Summary | wajib, 10–240 karakter |
| Description | wajib; batas panjang ditetapkan di schema dan UI |
| Category | 2–60 karakter bila digunakan |
| Nama anggota | 2–100 karakter |
| Bio | opsional, batas panjang ditetapkan |
| Nama kontak | 2–100 karakter |
| Email kontak | format email valid, maksimal 254 karakter |
| Subject | 3–120 karakter |
| Pesan | 10–5.000 karakter |
| URL eksternal | hanya protokol `https` dan `http` bila memang diperlukan; tolak `javascript:` dan skema tak dikenal |
| File gambar | format gambar yang ditentukan, batas ukuran eksplisit; nilai final ditetapkan sebelum implementasi upload |

Jangan membuat validasi frontend dan database berbeda tanpa alasan yang terdokumentasi. Error harus menunjuk field yang relevan tanpa membocorkan detail implementasi.

## 16. Status UI Wajib

Semua halaman yang mengambil data harus memiliki state berikut sesuai konteks:

- **Loading:** memberi indikasi proses tanpa menggeser layout secara ekstrem.
- **Success:** konten atau konfirmasi berhasil ditampilkan.
- **Empty:** jelaskan bahwa belum ada data dan berikan tindakan yang sesuai jika pengguna admin.
- **Error:** tampilkan pesan yang jelas dan opsi retry bila memungkinkan.
- **Not found:** untuk proyek slug atau record yang tidak tersedia.
- **Unauthorized/forbidden:** redirect atau tampilkan akses ditolak dengan aman.

Aksi mutation perlu mencegah double-submit dan menampilkan feedback yang konsisten.

## 17. Aksesibilitas dan Kualitas UX

- Semua input memiliki label yang dapat dipahami dan pesan error yang terkait.
- Tombol mempunyai nama/label yang jelas, termasuk tombol ikon.
- Pastikan kontras teks cukup dan jangan menjadikan warna sebagai satu-satunya indikator status.
- Fokus keyboard terlihat pada web; urutan tab masuk akal.
- Gambar memiliki alt text yang relevan; gambar dekoratif tidak perlu alt deskriptif.
- Target sentuh mobile cukup besar dan kontrol tidak terlalu rapat.
- Navigasi utama bisa dipakai melalui keyboard.
- Perhatikan keadaan reduced motion bila menggunakan animasi.

## 18. Testing dan Quality Gates

### 18.1 Unit/Component Test

Uji minimal:
- pembuatan slug dan validasi form;
- pemetaan status project;
- komponen form untuk error dan loading;
- penanganan respons error data-access;
- utility yang mengatur URL dan format tanggal.

### 18.2 Integration/Security Test

Uji memakai anon client, non-admin authenticated client, dan admin client:
- anon hanya membaca proyek published;
- anon tidak membaca draft/archived project;
- anon hanya membaca anggota terlihat;
- anon dapat insert pesan valid tetapi tidak dapat membaca atau memodifikasi pesan;
- non-admin tidak dapat melakukan CRUD dashboard;
- admin dapat mengelola data yang diizinkan;
- non-admin tidak dapat mengubah role miliknya menjadi admin;
- upload dan operasi Storage mengikuti policy.

### 18.3 Manual/E2E Checklist

- Home, About, Team, Projects, Project Detail, Contact.
- Direct load pada URL detail dan refresh halaman.
- Login valid, login gagal, logout, dan route protection.
- Create/edit/archive/publish project.
- Validasi slug duplikat.
- Upload file valid dan invalid.
- Pengiriman kontak sukses/gagal/double submit.
- Responsive checks pada desktop, tablet, dan mobile.
- Empty state ketika tabel belum berisi data.

### 18.4 Pemeriksaan Sebelum Merge/Rilis

- TypeScript check tanpa error.
- Lint tanpa error kritis.
- Test suite lulus.
- Expo doctor/dependency compatibility check lulus atau warning dijelaskan.
- Migration SQL dapat diterapkan dari basis data kosong.
- RLS dan Storage policy sudah diuji dengan role berbeda.
- Tidak ada secret key yang ter-commit.
- Build web berhasil dan semua route kritis diuji dengan direct navigation.

## 19. Deployment dan Konfigurasi Lingkungan

### 19.1 Environment

Sediakan `.env.example` dan dokumentasikan nama variabel yang diperlukan. File `.env` lokal tidak boleh masuk Git. Variabel yang diberi prefix `EXPO_PUBLIC_` diperlakukan sebagai nilai publik yang dapat terlihat oleh client bundle.

### 19.2 Supabase Setup

1. Buat project Supabase.
2. Terapkan migration schema, index, trigger, helper function, dan RLS policies.
3. Buat bucket Storage dan policies.
4. Buat user admin melalui Supabase Auth/dashboard atau alur provisioning terpercaya.
5. Masukkan/atur record `profiles` admin melalui jalur admin terpercaya; jangan menyediakan fitur promosi role pada UI publik.
6. Konfigurasikan auth redirect URL untuk development dan domain produksi.
7. Uji policy sebelum data nyata dimasukkan.

### 19.3 Web Deployment

- Pilih host yang mendukung output web Expo sesuai mode deployment yang diputuskan.
- Tentukan apakah menggunakan export statis atau strategi rendering lain setelah tes SEO dan direct route.
- Atur domain, HTTPS, environment variables, redirect/rewrite routing bila diperlukan, dan metadata.
- Lakukan smoke test setelah deployment, termasuk login dashboard, upload, contact submission, dan halaman detail proyek.

### 19.4 Backup dan Pemeliharaan

- Tentukan kebijakan backup berdasarkan kemampuan dan paket Supabase yang digunakan.
- Simpan seluruh migration di Git.
- Hindari edit schema produksi yang tidak tercatat di migration.
- Rencanakan pembaruan dependency secara berkala dan uji sebelum deploy.

## 20. Urutan Implementasi

### Phase 0 — Validasi Fondasi

1. Inisialisasi project Expo dengan TypeScript.
2. Pastikan target web dapat dijalankan dan routing langsung bekerja.
3. Pasang Expo Router, NativeWind versi yang kompatibel, Supabase client, dan kebutuhan penyimpanan sesi yang sesuai target platform.
4. Tambahkan lint, typecheck, format, dan aturan environment.
5. Buat shell layout responsif dan design tokens.

**Definition of Done:** app dapat berjalan lokal di web, route dasar berfungsi, dependency cocok dengan Expo SDK, dan tidak ada secret di repo.

### Phase 1 — Database dan Security Foundation

1. Buat migration enum, tabel, FK, constraint, index, dan timestamp triggers.
2. Buat helper admin serta RLS policies.
3. Buat Storage buckets dan policies.
4. Buat admin awal melalui jalur terpercaya.
5. Uji kebijakan dengan anon, non-admin, dan admin.

**Definition of Done:** seluruh tabel terekspos dilindungi RLS dan test akses negatif lulus.

### Phase 2 — Website Publik

1. Implementasi layout, header, footer, warna, tipografi, serta responsive container.
2. Home.
3. Daftar proyek dan detail proyek.
4. About dan Team.
5. Contact form.
6. Empty/loading/error/not-found states.
7. Metadata dan direct-route checks.

**Definition of Done:** halaman publik membaca data Supabase, draft terlindungi, form kontak menyimpan data, dan layout utama responsif.

### Phase 3 — Auth dan Dashboard

1. Login dan session handling.
2. Route protection UI.
3. Overview.
4. CRUD project, termasuk teknologi dan upload thumbnail.
5. CRUD anggota tim dan upload avatar.
6. Teknologi management.
7. Inbox kontak dan status pesan.

**Definition of Done:** alur pengelolaan konten berfungsi dan RLS tetap menolak akses tidak sah.

### Phase 4 — Quality, Deployment, and Handover

1. Jalankan test suite dan pemeriksaan static analysis.
2. Uji browser desktop/tablet/mobile.
3. Review keamanan RLS, Storage, URL, file upload, serta secrets.
4. Periksa SEO dan navigasi direct URL.
5. Deploy ke staging lalu production.
6. Jalankan smoke test dan dokumentasikan prosedur operasi.

**Definition of Done:** checklist rilis selesai, masalah blocker ditutup, dan README menjelaskan setup dari awal.

## 21. Definition of Done Global

MVP dianggap selesai jika:

- Seluruh route P0 diimplementasikan dan dapat digunakan.
- UI tidak memiliki placeholder atau tombol utama yang tidak berfungsi.
- Data dinamis terintegrasi dengan Supabase.
- CRUD P0 berfungsi dan menunjukkan hasil/error dengan tepat.
- Admin authentication berjalan dan semua mutation tetap dilindungi RLS.
- Akses anon/non-admin/admin telah diuji.
- Tidak ada secret dalam source control maupun bundle klien.
- Layout responsif, tidak ada horizontal overflow pada halaman utama.
- Direct navigation/refresh route detail telah diverifikasi.
- Typecheck, lint, dan test utama lulus.
- README berisi persiapan, setup env, migration, pembuatan admin, perintah development, testing, serta deployment.

## 22. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| RLS salah konfigurasi | Data privat bocor atau admin terkunci | Uji kebijakan dengan tiga konteks: anon, non-admin, admin; review policy sebelum deploy |
| SEO Expo Web tidak memenuhi kebutuhan | Halaman proyek kurang optimal ditemukan mesin pencari | Uji metadata, source/render, dan direct URL pada Phase 0; buat keputusan berbasis hasil sebelum arsitektur melebar |
| Ketidakcocokan Expo SDK dan NativeWind | Build gagal atau styling bermasalah | Pilih versi kompatibel, ikuti konfigurasi versi yang sama, jalankan Expo Doctor |
| Upload file bermasalah | Gambar gagal tampil atau file lama tertinggal | Validasi upload, tangani kegagalan tiap langkah, dan lakukan cleanup dengan urutan aman |
| Spam form kontak | Inbox penuh | Batasi panjang input, tambahkan kontrol anti-spam sesuai kebutuhan, pantau pola penyalahgunaan |
| Kompleksitas melebar | MVP terlambat selesai | Pertahankan scope P0 dan pindahkan journal/analytics/role kompleks ke backlog |
| URL/detail refresh gagal | Halaman proyek tidak bisa dibuka langsung | Uji direct-route dan konfigurasi rewrite/static export pada deployment target sejak awal |

## 23. Backlog Setelah MVP

Prioritas lanjutan diputuskan berdasarkan penggunaan nyata:

- Journal/blog dengan draft, publication date, dan editor yang aman.
- SEO lanjutan: Open Graph, sitemap, structured data, dan strategi rendering sesuai hasil validasi.
- Pagination, pencarian, filter proyek yang lebih kaya.
- Project media gallery dan changelog.
- Role member dengan izin spesifik bila benar-benar dibutuhkan.
- Analytics privasi-sadar dan pengukuran interaksi.
- Bahasa Inggris atau multilingual.
- Alur notifikasi email untuk pesan baru melalui solusi server-side tepercaya.

## 24. Keputusan Implementasi yang Tidak Boleh Berubah Tanpa Review

1. Stack MVP adalah Expo + React Native + Expo Router + TypeScript + NativeWind + Supabase.
2. Supabase adalah backend/data platform MVP; jangan menambah backend framework atau database kedua tanpa kebutuhan yang terdokumentasi.
3. Semua tabel publik yang terpapar melalui API wajib memakai RLS.
4. Hanya admin yang dapat membuat/mengubah konten dan membaca inbox.
5. Proyek publik harus berstatus `published`; anggota publik harus `is_visible = true`.
6. Service-role/secret key tidak boleh masuk aplikasi klien.
7. Migrasi database dan policies disimpan di Git.
8. SEO serta dukungan direct routing Expo Web harus divalidasi sejak awal, bukan ditunda hingga akhir.

## 25. Checklist Mulai untuk Developer

- [ ] Inisialisasi Expo + TypeScript dan pastikan target web bekerja.
- [ ] Konfirmasi versi Expo SDK, Expo Router, dan NativeWind yang kompatibel.
- [ ] Siapkan `.env.example` dan Supabase client.
- [ ] Buat migration awal untuk enum, tabel, FK, index, dan trigger.
- [ ] Terapkan RLS dan Storage policies.
- [ ] Uji akses anon, non-admin, dan admin.
- [ ] Implementasikan design tokens serta komponen layout.
- [ ] Kerjakan halaman publik dan integrasi data.
- [ ] Implementasikan login dan dashboard CRUD.
- [ ] Jalankan test, review keamanan, build web, dan smoke test.
- [ ] Lengkapi README dan checklist deployment.

---

**Catatan akhir:** PRD ini adalah spesifikasi produk dan implementasi MVP. Detail visual seperti copywriting final, nilai warna, batas ukuran file, dan keputusan SEO perlu dikonfirmasi melalui desain serta uji teknis awal. Semua keputusan yang memengaruhi keamanan harus ditegakkan pada Supabase/database/server policy, bukan hanya pada antarmuka.
