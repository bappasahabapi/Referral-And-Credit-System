'use client';
import { useEffect, useState } from 'react';

export type Session = {
  authenticated: boolean;
  user?: { id: string; email: string };
};

export function useSession(initial: Session) {
  const [session, setSession] = useState<Session>(initial);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/me/profile');
      const data = await res.json();
      setSession(data);
    }
    load();
  }, []);

  return session;
}
