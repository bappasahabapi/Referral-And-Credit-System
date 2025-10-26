import NavbarClient from "./NavbarClient";
import { getSession } from "../lib/server/session";

export default function Navbar() {
  const session = getSession();
  return <NavbarClient initialSession={session} />;
}
