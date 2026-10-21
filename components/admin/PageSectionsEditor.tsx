import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import type { PageSection } from '../../types/cms';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../features/auth/AuthProvider';
import { AdminButton, AdminField, AdminNotice, styles } from './AdminUI';

const template = JSON.stringify({ kind: 'narrative', title: '', paragraphs: [''] }, null, 2);
function object(value: unknown): value is Record<string, unknown> { return !!value && typeof value === 'object' && !Array.isArray(value); }
function text(value: unknown): value is string { return typeof value === 'string' && value.length <= 30000; }
function safeLink(value: unknown) {
  if (typeof value !== 'string') return false;
  return /^\/(?!\/)[^\\]*$/.test(value) || /^#[a-zA-Z0-9_-]+$/.test(value) || /^https?:\/\/[^\s\\]+$/i.test(value) || /^mailto:[^\s@]+@[^\s@]+$/.test(value);
}
/** Validate the public renderer's discriminated content contract, not just JSON syntax. */
export function validSectionContent(value: unknown): boolean {
  if (!object(value) || !text(value.title)) return false;
  switch (value.kind) {
    case 'hero': return text(value.eyebrow) && text(value.body) && Array.isArray(value.actions) && value.actions.every(action => object(action) && text(action.label) && safeLink(action.href));
    case 'narrative': return Array.isArray(value.paragraphs) && value.paragraphs.every(text);
    case 'principles': return Array.isArray(value.items) && value.items.every(item => object(item) && text(item.title) && text(item.body));
    case 'collection': return ['projects', 'team', 'technologies'].includes(String(value.source)) && typeof value.limit === 'number' && Number.isInteger(value.limit) && value.limit >= 1 && value.limit <= 100;
    case 'contact': return text(value.body) && (value.email === null || (typeof value.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)));
    default: return false;
  }
}
export function PageSectionsEditor({ pageId }: { pageId: string }) {
  const auth = useAdminAuth();
  const [rows, setRows] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [key, setKey] = useState('');
  const [order, setOrder] = useState('0');
  const [json, setJson] = useState(template);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const load = useCallback(async () => {
    if (!supabase || auth.status !== 'admin') return;
    setLoading(true); setError('');
    try {
      const result = await supabase.from('page_sections').select('*').eq('page_id', pageId).order('sort_order').order('id');
      if (result.error) throw result.error;
      setRows(result.data as PageSection[]);
    } catch { setRows([]); setError('Bagian halaman tidak dapat dimuat. Periksa koneksi dan policy RLS.'); }
    finally { setLoading(false); }
  }, [pageId, auth.status]);
  // Synchronize the editor with this page's external Supabase records.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);
  function open(row?: PageSection) {
    setEditing(row?.id ?? 'new'); setKey(row?.section_key ?? ''); setOrder(String(row?.sort_order ?? rows.length));
    setJson(row ? JSON.stringify(row.content, null, 2) : template); setStatus(row?.status ?? 'draft'); setNotice('');
  }
  async function save() {
    if (!supabase || busy || auth.status !== 'admin') return;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(key.trim())) { setNotice('Key harus berupa huruf kecil, angka, dan tanda hubung.'); return; }
    const sortOrder = Number(order);
    if (!order.trim() || !Number.isInteger(sortOrder) || sortOrder < -2147483648 || sortOrder > 2147483647) { setNotice('Urutan harus berupa integer 32-bit.'); return; }
    let content: unknown;
    try { content = JSON.parse(json); } catch { setNotice('Content harus berupa JSON valid.'); return; }
    if (!validSectionContent(content)) { setNotice('Struktur content tidak valid. Cocokkan kind dan kolomnya dengan kontrak di bawah.'); return; }
    setBusy(true); setNotice('');
    try {
      const values = { page_id: pageId, section_key: key.trim(), sort_order: sortOrder, status, content };
      const result = editing === 'new' ? await supabase.from('page_sections').insert(values).select('id').single() : await supabase.from('page_sections').update(values).eq('id', editing).eq('page_id', pageId).select('id').single();
      if (result.error) { setNotice(result.error.code === '23505' ? 'Key sudah dipakai pada halaman ini.' : 'Bagian gagal disimpan. Periksa hak akses dan data.'); return; }
      setEditing(null); setNotice('Bagian tersimpan.'); await load();
    } catch { setNotice('Penyimpanan gagal. Coba lagi.'); }
    finally { setBusy(false); }
  }
  async function remove(id: string) {
    if (!supabase || busy || auth.status !== 'admin') return;
    setBusy(true); setNotice('');
    try {
      const result = await supabase.from('page_sections').delete().eq('id', id).eq('page_id', pageId).select('id').single();
      if (result.error) throw result.error;
      setConfirmDelete(null); if (editing === id) setEditing(null); setNotice('Bagian dihapus.'); await load();
    } catch { setNotice('Penghapusan gagal. Data belum dikonfirmasi terhapus.'); }
    finally { setBusy(false); }
  }
  return <View style={{ gap: 16, borderTopWidth: 1, borderColor: '#D8D8D5', paddingTop: 24 }}>
    <Text accessibilityRole="header" style={styles.heading}>Bagian halaman</Text>
    <Text style={styles.body}>Urutan kecil tampil lebih dahulu. Bagian published hanya tampil publik jika halaman juga published.</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}><AdminButton disabled={busy || loading} onPress={() => open()}>Tambah bagian</AdminButton><AdminButton secondary disabled={busy || loading} onPress={() => void load()}>Muat ulang bagian</AdminButton></View>
    {!!notice && <Text accessibilityRole="alert" style={styles.body}>{notice}</Text>}
    {editing && <View style={styles.panel}>
      <AdminField label="Section key" value={key} onChangeText={setKey} autoCapitalize="none" editable={!busy} />
      <AdminField label="Urutan (integer)" value={order} onChangeText={setOrder} keyboardType="numbers-and-punctuation" editable={!busy} />
      <AdminField label="Content JSON" value={json} onChangeText={setJson} multiline autoCapitalize="none" autoCorrect={false} maxLength={200000} editable={!busy} style={{ minHeight: 240 }} />
      <Text style={styles.body}>{'Semua kind memerlukan title string. hero: eyebrow, body, actions[{label,href}]. narrative: paragraphs[string]. principles: items[{title,body}]. collection: source (projects/team/technologies), limit (1–100). contact: body, email (string atau null). Teks bukan HTML.'}</Text>
      <Text style={styles.label}>Publikasi: {status}</Text><AdminButton secondary disabled={busy} onPress={() => setStatus(value => value === 'draft' ? 'published' : 'draft')}>{status === 'draft' ? 'Ubah ke published' : 'Ubah ke draft'}</AdminButton>
      <AdminButton disabled={busy} onPress={() => void save()}>{busy ? 'Menyimpan…' : 'Simpan bagian'}</AdminButton><AdminButton secondary disabled={busy} onPress={() => setEditing(null)}>Batal</AdminButton>
    </View>}
    {loading ? <AdminNotice busy title="Memuat bagian…" /> : error ? <AdminNotice title="Bagian belum tersedia" message={error} /> : !rows.length ? <AdminNotice title="Belum ada bagian" message="Tambahkan bagian pertama dengan key unik dan content JSON." /> : rows.map(row => <View key={row.id} style={styles.panel}>
      <Text style={styles.heading}>{row.section_key}</Text><Text style={styles.body}>Urutan {row.sort_order} · {row.content.kind} · {row.status}</Text>
      <AdminButton secondary disabled={busy} onPress={() => open(row)}>Edit bagian / urutan / publikasi</AdminButton>
      {confirmDelete === row.id ? <><Text style={styles.error}>Hapus bagian ini secara permanen? Tindakan ini tidak dapat dibatalkan.</Text><AdminButton disabled={busy} onPress={() => void remove(row.id)}>Konfirmasi hapus</AdminButton><AdminButton secondary disabled={busy} onPress={() => setConfirmDelete(null)}>Batal hapus</AdminButton></> : <AdminButton secondary disabled={busy} onPress={() => setConfirmDelete(row.id)}>Hapus bagian</AdminButton>}
    </View>)}
  </View>;
}
