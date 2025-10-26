import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export type Session = {
  authenticated: boolean;
  user?: { id: string; email: string };
};

export function readServerToken() {
  return cookies().get("auth_token")?.value || null;
}

export function getSession(): Session {
  const token = readServerToken();
  if (!token) return { authenticated: false };
  const decoded: any = jwt.decode(token);
  if (!decoded) return { authenticated: false };
  return {
    authenticated: true,
    user: { id: decoded.id, email: decoded.email },
  };
}
