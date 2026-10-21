import { describe, test, expect, jest } from '@jest/globals';
import type { SupabaseClient } from '@supabase/supabase-js';
import { verifyAdmin } from './verifyAdmin';

function client(role: string | null = 'admin', profileError: unknown = null, user: unknown = { id: 'selected-uid', email: 'admin@example.test' }, authError: unknown = null) {
  const maybeSingle = jest.fn<(...args: unknown[]) => Promise<unknown>>().mockResolvedValue({ data: role === null ? null : { role }, error: profileError });
  const eq = jest.fn().mockReturnValue({ maybeSingle });
  const select = jest.fn().mockReturnValue({ eq });
  const from = jest.fn().mockReturnValue({ select });
  const mock = { auth: { getUser: jest.fn<(...args: unknown[]) => Promise<unknown>>().mockResolvedValue({ data: { user }, error: authError }) }, from };
  return { api: mock as unknown as SupabaseClient, ...mock, eq, select };
}

describe('admin verification (mocked Auth and PostgREST, not live RLS)', () => {
  test('verified admin uses the Auth UID, not metadata', async () => {
    const mock = client();
    expect((await verifyAdmin(mock.api, 'selected-uid')).status).toBe('admin');
    expect(mock.from).toHaveBeenCalledWith('profiles');
    expect(mock.select).toHaveBeenCalledWith('role');
    expect(mock.eq).toHaveBeenCalledWith('id', 'selected-uid');
  });
  test('member remains denied', async () => expect((await verifyAdmin(client('member').api, 'selected-uid')).status).toBe('denied'));
  test('missing or RLS-filtered profile has a distinct state', async () => expect((await verifyAdmin(client(null).api, 'selected-uid')).status).toBe('no-profile'));
  test('profile permission error is not a password error', async () => {
    const result = await verifyAdmin(client('admin', { code: '42501' }).api, 'selected-uid');
    expect(result.status).toBe('error');
    expect(result.error).toContain('bukan kesalahan kata sandi');
  });
  test('expired session is rejected without querying profiles', async () => {
    const mock = client('admin', null, null, { status: 401 });
    expect((await verifyAdmin(mock.api, 'selected-uid')).status).toBe('signed-out');
    expect(mock.from).not.toHaveBeenCalled();
  });
  test('anonymous identity cannot read a profile', async () => expect((await verifyAdmin(client('admin', null, null).api, 'selected-uid')).status).toBe('signed-out'));
  test('mismatched session UID fails closed', async () => expect((await verifyAdmin(client().api, 'other-uid')).status).toBe('signed-out'));
  test('Auth network failure stays distinct from expired credentials', async () => expect((await verifyAdmin(client('admin', null, null, { status: 0 }).api, 'selected-uid')).status).toBe('error'));
});
