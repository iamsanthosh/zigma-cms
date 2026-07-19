import AdminShell from '@/components/admin/AdminShell';
import { getSessionUser } from '@/lib/auth';

export const metadata = { title: 'Zigma CMS Admin' };

// This layout sits directly under the root app/layout.js (which already
// provides <html>/<body> and loads globals.css), so it only needs to add
// the admin-specific chrome — it deliberately does NOT extend the public
// (site) layout, since the admin has its own header/nav via AdminShell.
export default function AdminLayout({ children }) {
  const user = getSessionUser();
  return user ? <AdminShell user={user}>{children}</AdminShell> : <>{children}</>;
}
