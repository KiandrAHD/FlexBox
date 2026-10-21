import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../features/auth/AuthProvider';
import { AdminButton, AdminField, AdminHeading, AdminNotice, styles } from './AdminUI';
import { PageSectionsEditor } from './PageSectionsEditor';

type Row = Record<string, unknown> & { id: string };
const configs: Record<string, { fields: string[]; label: string; columns: string }> = {
  projects: { fields: ['title', 'slug', 'summary', 'description', 'category'], label: 'title', columns: 'id,title,slug,summary,description,category,status' },
  team_members: { fields: ['name', 'slug', 'role_title', 'bio'], label: 'name', columns: 'id,name,slug,role_title,bio,is_visible' },
  technologies: { fields: ['name', 'slug', 'description'], label: 'name', columns: 'id,name,slug,description,is_visible' },
  pages: { fields: ['title', 'slug', 'description'], label: 'title', columns: 'id,title,slug,description,status' },
  contact_messages: { fields: [], label: 'subject', columns: 'id,name,email,subject,message,status,created_at' },
};
const labels: Record<string, string> = { title: 'Judul', slug: 'Slug URL', summary: 'Ringkasan', description: 'Deskripsi', category: 'Kategori', name: 'Nama', role_title: 'Jabatan', bio: 'Bio' };

/** This management UI never uses the public demo repository. All reads/writes require the verified admin session plus RLS. */
export function ResourcePage({ title, eyebrow, description, table }: { title: string; eyebrow: string; description: string; table: string; setup?: string }) {
  const auth = useAdminAuth();
  const { width } = useWindowDimensions();
  const desktop = width >= 1100;
  const config = configs[table];
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [edit, setEdit] = useState<Row | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const load = useCallback(async () => {
    if (!supabase || auth.status !== 'admin' || !config) return;
    setLoading(true); setError('');
    try {
      let request = supabase.from(table).select(config.columns, { count: 'exact' }).order('created_at', { ascending: false }).order('id');
      if (filter !== 'all') request = ['team_members', 'technologies'].includes(table) ? request.eq('is_visible', filter === 'visible') : request.eq('status', filter);
      // Search one known text column; escape LIKE wildcards so user input remains literal.
      if (search.trim()) request = request.ilike(config.label, `%${search.trim().replace(/[\\%_]/g, character => `\\${character}`)}%`);
      const result = await request.range(page * 20, page * 20 + 19);
      if (result.error) throw result.error;
      setRows((result.data ?? []) as unknown as Row[]); setTotal(result.count ?? 0);
    } catch { setRows([]); setError('Data tidak tersedia. Periksa koneksi, migrasi tabel, dan policy RLS admin.'); }
    finally { setLoading(false); }
  }, [table, config, auth.status, page, search, filter]);
  // Synchronize the active resource with external Supabase records.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(query); setPage(0); }, 300);
    return () => clearTimeout(timer);
  }, [query]);
  function openForm(row: Row | null) {
    setEdit(row); setDraft(Object.fromEntries(config.fields.map(field => [field, String(row?.[field] ?? '')]))); setFormOpen(true); setNotice('');
  }
  async function save() {
    if (!supabase || busy || auth.status !== 'admin') return;
    const values = Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, value.trim()]));
    if (config.fields.some(field => !['bio', 'category', ...(['pages', 'technologies'].includes(table) ? ['description'] : [])].includes(field) && !values[field])) { setNotice('Lengkapi kolom wajib. Bio dan kategori bersifat opsional.'); return; }
    if (values.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)) { setNotice('Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.'); return; }
    if (table === 'pages' && (!['home', 'about', 'team', 'projects', 'contact'].includes(values.slug) || values.title.length > 180 || values.description.length > 500)) { setNotice('Halaman: slug harus home/about/team/projects/contact, judul maksimal 180 karakter, deskripsi maksimal 500 karakter.'); return; }
    for (const field of config.fields) {
      if (values[field].length > fieldLimit(table, field)) { setNotice(`${labels[field] ?? field} melebihi ${fieldLimit(table, field)} karakter.`); return; }
    }
    setBusy(true); setNotice('');
    try {
      const result = edit ? await supabase.from(table).update(values).eq('id', edit.id).select('id').single() : await supabase.from(table).insert(values).select('id').single();
      if (result.error) { setNotice(result.error.code === '23505' ? 'Slug atau nama sudah dipakai. Gunakan nilai lain.' : 'Penyimpanan ditolak. Periksa kolom, koneksi, dan hak akses.'); return; }
      setFormOpen(false); setNotice('Perubahan tersimpan.'); await load();
    } catch { setNotice('Penyimpanan gagal. Tidak ada konfirmasi perubahan tersimpan.'); }
    finally { setBusy(false); }
  }
  async function update(row: Row, patch: Record<string, unknown>) {
    if (!supabase || busy || auth.status !== 'admin') return;
    setBusy(true); setNotice('');
    try {
      const result = await supabase.from(table).update(patch).eq('id', row.id).select('id').single();
      if (result.error) throw result.error;
      setNotice('Status diperbarui.'); await load();
    } catch { setNotice('Perubahan gagal. Periksa koneksi dan policy admin.'); }
    finally { setBusy(false); }
  }
  if (!config) return <AdminNotice title="Tabel belum didukung" message="Integrasi repository diperlukan untuk sumber data ini." />;
  const filtered = rows;
  const options = ['team_members', 'technologies'].includes(table) ? ['visible', 'hidden'] : table === 'contact_messages' ? ['new', 'read', 'replied', 'archived'] : table === 'pages' ? ['draft', 'published'] : ['draft', 'published', 'archived'];
  const stateLabel = (value: string) => ({ all: 'Semua', visible: 'Terlihat', hidden: 'Tersembunyi', new: 'Baru', read: 'Dibaca', replied: 'Dibalas', draft: 'Draft', published: 'Terbit', archived: 'Arsip' }[value] ?? value);
  return <View style={{ gap: 20 }}><AdminHeading eyebrow={eyebrow} title={title} description={description} />
    <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}><AdminButton secondary disabled={busy || loading} onPress={() => void load()}>Muat ulang</AdminButton>{config.fields.length > 0 && <AdminButton disabled={busy} onPress={() => openForm(null)}>Tambah baru</AdminButton>}</View>
    {!!notice && <Text accessibilityRole="alert" style={styles.body}>{notice}</Text>}
    {formOpen && <View style={styles.panel}><Text accessibilityRole="header" style={styles.heading}>{edit ? 'Edit konten' : 'Konten baru'}</Text>{config.fields.map(field => <AdminField key={field} label={labels[field] ?? field} value={draft[field] ?? ''} onChangeText={value => setDraft(previous => ({ ...previous, [field]: value }))} multiline={['bio', 'summary', 'description'].includes(field)} maxLength={fieldLimit(table, field)} editable={!busy} autoCapitalize={field === 'slug' ? 'none' : 'sentences'} />)}<Text style={styles.body}>Konten baru mengikuti default aman database. Publikasikan atau tampilkan setelah ditinjau.</Text><AdminButton disabled={busy} onPress={() => void save()}>{busy ? 'Menyimpan…' : 'Simpan'}</AdminButton><AdminButton secondary disabled={busy} onPress={() => setFormOpen(false)}>Batal</AdminButton></View>}
    <AdminField label={`Cari ${table === 'contact_messages' ? 'subjek pesan' : config.label === 'name' ? 'nama' : 'judul'}`} value={query} onChangeText={setQuery} maxLength={180} />
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{['all', ...options].map(value => <AdminButton key={value} secondary={filter !== value} disabled={busy} onPress={() => { setFilter(value); setPage(0); }}>{stateLabel(value)}</AdminButton>)}</View>
    <Text accessibilityLiveRegion="polite" style={styles.body}>{loading ? 'Memuat hasil?' : `${total} hasil ? halaman ${page + 1} dari ${Math.max(1, Math.ceil(total / 20))}`}</Text>
    {desktop && table !== 'pages' && <View style={{ flexDirection: 'row', gap: 24, paddingHorizontal: 24, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#D8D8D5' }}><Text style={[styles.label, { flex: 2 }]}>KONTEN</Text><Text style={[styles.label, { flex: 1 }]}>STATUS</Text><Text style={[styles.label, { flex: 2 }]}>TINDAKAN</Text></View>}
    {loading ? <AdminNotice busy title="Memuat data…" /> : error ? <AdminNotice title="Data belum tersedia" message={error} /> : !filtered.length ? <AdminNotice title={rows.length ? 'Tidak ada hasil' : 'Belum ada data'} message={rows.length ? 'Coba kata kunci lain.' : table === 'contact_messages' ? 'Pesan kontak yang masuk akan tampil di sini.' : 'Tambahkan konten pertama. Tidak ada data contoh di dashboard.'} /> : filtered.map(row => <View key={row.id} style={[styles.panel, { borderWidth: 0, borderBottomWidth: 1, flexDirection: desktop && table !== 'pages' ? 'row' : 'column', alignItems: 'stretch', gap: 24 }]} >
      <View style={{ flex: desktop && table !== 'pages' ? 2 : undefined, minWidth: 0, gap: 8 }}><Text accessibilityRole="header" style={styles.heading}>{String(row[config.label] ?? 'Tanpa judul')}</Text>
      <Text style={styles.body}>{String(row.slug ?? row.email ?? '')}</Text>
            {table === 'contact_messages' && <><Text style={styles.body}>{String(row.name)} · {String(row.created_at)}</Text><Text selectable style={styles.body}>{String(row.message)}</Text></>}
      </View><Text style={[styles.eyebrow, { flex: desktop && table !== 'pages' ? 1 : undefined }]}>{stateLabel(String(row.status ?? (row.is_visible ? 'visible' : 'hidden')))}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, flex: desktop && table !== 'pages' ? 2 : undefined, alignContent: 'flex-start' }}>
        {!!config.fields.length && <AdminButton secondary disabled={busy} onPress={() => openForm(row)}>Edit</AdminButton>}
        {['projects', 'pages'].includes(table) && (table === 'pages' ? ['draft', 'published'] : ['draft', 'published', 'archived']).filter(status => status !== row.status).map(status => <AdminButton key={status} secondary disabled={busy} onPress={() => void update(row, { status })}>{status === 'published' ? 'Publikasikan' : status === 'draft' ? 'Jadikan draft' : 'Arsipkan'}</AdminButton>)}
        {['team_members', 'technologies'].includes(table) && <AdminButton secondary disabled={busy} onPress={() => void update(row, { is_visible: !row.is_visible })}>{row.is_visible ? 'Sembunyikan' : 'Tampilkan'}</AdminButton>}
        {table === 'contact_messages' && ['new', 'read', 'replied', 'archived'].filter(status => status !== row.status).map(status => <AdminButton key={status} secondary disabled={busy} onPress={() => void update(row, { status })}>{({ new: 'Baru', read: 'Sudah dibaca', replied: 'Sudah dibalas', archived: 'Arsipkan' } as Record<string, string>)[status]}</AdminButton>)}
      </View>
      {table === 'pages' && <PageSectionsEditor pageId={row.id} />}
    </View>)}
    {!loading && !error && <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}><AdminButton secondary disabled={busy || page === 0} onPress={() => setPage(value => value - 1)}>Sebelumnya</AdminButton><AdminButton secondary disabled={busy || (page + 1) * 20 >= total} onPress={() => setPage(value => value + 1)}>Berikutnya</AdminButton></View>}
  </View>;
}

function fieldLimit(table: string, field: string) {
  if (field === 'slug') return 180;
  if (field === 'description') return table === 'projects' ? 30000 : 500;
  if (field === 'bio') return 2000;
  if (field === 'summary') return 500;
  if (field === 'category' || field === 'role_title') return 120;
  if (field === 'name') return table === 'technologies' ? 100 : 120;
  return 180;
}
