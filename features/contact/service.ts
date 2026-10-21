import { supabase } from '../../lib/supabase';
import type { ContactInput, ContactRepository } from '../../types/cms';
const clean = (value: string, max: number) => value.trim().replace(/\s+/g, ' ').slice(0, max);
export function validateContact(input: ContactInput): ContactInput {
  if (input.name.trim().length > 120 || input.email.trim().length > 254 || input.subject.trim().length > 180 || input.message.trim().length > 5000) throw new Error('Data formulir melebihi batas panjang.');
  const value = { name: clean(input.name, 120), email: clean(input.email, 254).toLowerCase(), subject: clean(input.subject, 180), message: input.message.trim().slice(0, 5000), website: clean(input.website ?? '', 200) };
  if (value.website || !value.name || !value.subject || !value.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) throw new Error('Periksa kembali data formulir.');
  return value;
}
let submitting = false;
let lastSent = 0;
/** Honeypot/cooldown improve UX only; production abuse protection belongs at a server boundary. */
export const contactRepository: ContactRepository = {
  async submit(input) {
    const validated = validateContact(input);
    if (!supabase) throw new Error('Form kontak belum terhubung.');
    if (submitting || Date.now() - lastSent < 30_000) throw new Error('Tunggu sebentar sebelum mengirim kembali.');
    submitting = true;
    try {
      const { name, email, subject, message } = validated;
      const { error } = await supabase.from('contact_messages').insert({ name, email, subject, message });
      if (error) throw new Error('Pesan gagal dikirim. Silakan coba lagi.');
      lastSent = Date.now();
    } finally { submitting = false; }
  },
};
export const submitContactMessage = (input: ContactInput) => contactRepository.submit(input);

