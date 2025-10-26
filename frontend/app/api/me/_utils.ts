import { cookies } from 'next/headers';

export function readToken() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  return token;
}
