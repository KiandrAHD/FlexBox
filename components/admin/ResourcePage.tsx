import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../features/auth/AuthProvider';
import { AdminButton, AdminField, AdminHeading, AdminNotice, styles } from './AdminUI';
import { PageSectionsEditor } from './PageSectionsEditor';

type Row = Record<string, unknown> & { id: string };
const configs: Record<string, { fields: string[]; label: string; columns: string }> = {
  projects: { fields: ['title', 'slug', 'summary', 'description', 'category'], label: 'title', columns: 'id,title,slug,summary,description,category,status' },
  team_members: { fields: ['name', 'slug', 'role_title', 'bio'], label: 'name', columns: 'id,name,slug,role_title,bio,is_visible' },
  technologies: { fields: ['name', 'slug'], label: 'name', columns: 'id,name,slug,description,is_visible' },
  pages: { fields: ['title', 'slug', 'description'], label: 'title', columns: 'id,title,slug,description,status' },
  contact_messages: { fields: [], label: 'subject', columns: 'id,name,email,subject,message,status,created_at' },
};
const labels: Record<string, string> = { title: 'Judul', slug: 'Slug URL', summary: 'Ringkasan', description: 'Deskripsi', category: 'Kategori', name: 'Nama', role_title: 'Jabatan', bio: 'Bio' };

/** This management UI never uses the public demo repository. All reads/writes require the verified admin session plus RLS. */
export function ResourcePage({ title, eyebrow, description, table }: { title: string; eyebrow: string; description: string; table: string; setup?: string }) {
  const auth = useAdminAuth();
  const config = configs[table];
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [edit, setEdit] = useState<Row | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const load = useCallback(async () => {
    if (!supabase || auth.status !== 'admin' || !config) return;
    setLoading(true); setError('');
    try {
      const result = await supabase.from(table).select(config.columns).order('created_at', { ascending: false }).limit(100);
      if (result.error) throw result.error;
      setRows((result.data ?? []) as unknown as Row[]);
    } catch { setRows([]); setError('Data tidak tersedia. Periksa koneksi, migrasi tabel, dan policy RLS admin.'); }
    finally { setLoading(false); }
  }, [table, config, auth.status]);
  // Synchronize the active resource with external Supabase records.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);
  function openForm(row: Row | null) {
    setEdit(row); setDraft(Object.fromEntries(config.fields.map(field => [field, String(row?.[field] ?? '')]))); setFormOpen(true); setNotice('');
  }
  async function save() {
    if (!supabase || busy || auth.status !== 'admin') return;
    const values = Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, value.trim()]));
    if (config.fields.some(field => !['bio', 'category', ...(table === 'pages' ? ['description'] : [])].includes(field) && !values[field])) { setNotice('Lengkapi kolom wajib. Bio dan kategori bersifat opsional.'); return; }
    if (values.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)) { setNotice('Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.'); return; }
    if (table === 'pages' && (!['home', 'about', 'team', 'projects', 'contact'].includes(values.slug) || values.title.length > 180 || values.description.length > 500)) { setNotice('Halaman: slug harus home/about/team/projects/contact, judul maksimal 180 karakter, deskripsi maksimal 500 karakter.'); return; }
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
  const filtered = rows.filter(row => Object.values(row).some(value => typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase())));
  return <View style={{ gap: 20 }}><AdminHeading eyebrow={eyebrow} title={title} description={description} />
    <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}><AdminButton secondary disabled={busy || loading} onPress={() => void load()}>Muat ulang</AdminButton>{config.fields.length > 0 && <AdminButton disabled={busy} onPress={() => openForm(null)}>Tambah baru</AdminButton>}</View>
    {!!notice && <Text accessibilityRole="alert" style={styles.body}>{notice}</Text>}
    {formOpen && <View style={styles.panel}><Text accessibilityRole="header" style={styles.heading}>{edit ? 'Edit konten' : 'Konten baru'}</Text>{config.fields.map(field => <AdminField key={field} label={labels[field] ?? field} value={draft[field] ?? ''} onChangeText={value => setDraft(previous => ({ ...previous, [field]: value }))} multiline={['bio', 'summary', 'description'].includes(field)} maxLength={field === 'description' ? 20000 : field === 'bio' ? 3000 : 500} editable={!busy} autoCapitalize={field === 'slug' ? 'none' : 'sentences'} />)}<Text style={styles.body}>Konten baru mengikuti default aman database. Publikasikan atau tampilkan setelah ditinjau.</Text><AdminButton disabled={busy} onPress={() => void save()}>{busy ? 'Menyimpan…' : 'Simpan'}</AdminButton><AdminButton secondary disabled={busy} onPress={() => setFormOpen(false)}>Batal</AdminButton></View>}
    <AdminField label="Cari dalam 100 data terbaru" value={query} onChangeText={setQuery} />
    {loading ? <AdminNotice busy title="Memuat data…" /> : error ? <AdminNotice title="Data belum tersedia" message={error} /> : !filtered.length ? <AdminNotice title={rows.length ? 'Tidak ada hasil' : 'Belum ada data'} message={rows.length ? 'Coba kata kunci lain.' : table === 'contact_messages' ? 'Pesan kontak yang masuk akan tampil di sini.' : 'Tambahkan konten pertama. Tidak ada data contoh di dashboard.'} /> : filtered.map(row => <View key={row.id} style={styles.panel}>
      <Text accessibilityRole="header" style={styles.heading}>{String(row[config.label] ?? 'Tanpa judul')}</Text>
      <Text style={styles.body}>{String(row.slug ?? row.email ?? '')}</Text>
      {row.status != null && <Text style={styles.eyebrow}>{String(row.status)}</Text>}
      {table === 'contact_messages' && <><Text style={styles.body}>{String(row.name)} · {String(row.created_at)}</Text><Text selectable style={styles.body}>{String(row.message)}</Text></>}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {!!config.fields.length && <AdminButton secondary disabled={busy} onPress={() => openForm(row)}>Edit</AdminButton>}
        {['projects', 'pages'].includes(table) && (table === 'pages' ? ['draft', 'published'] : ['draft', 'published', 'archived']).filter(status => status !== row.status).map(status => <AdminButton key={status} secondary disabled={busy} onPress={() => void update(row, { status })}>{status === 'published' ? 'Publikasikan' : status === 'draft' ? 'Jadikan draft' : 'Arsipkan'}</AdminButton>)}
        {['team_members', 'technologies'].includes(table) && <AdminButton secondary disabled={busy} onPress={() => void update(row, { is_visible: !row.is_visible })}>{row.is_visible ? 'Sembunyikan' : 'Tampilkan'}</AdminButton>}
        {table === 'contact_messages' && ['new', 'read', 'replied', 'archived'].filter(status => status !== row.status).map(status => <AdminButton key={status} secondary disabled={busy} onPress={() => void update(row, { status })}>{({ new: 'Baru', read: 'Sudah dibaca', replied: 'Sudah dibalas', archived: 'Arsipkan' } as Record<string, string>)[status]}</AdminButton>)}
      </View>
      {table === 'pages' && <PageSectionsEditor pageId={row.id} />}
    </View>)}
  </View>;
}
