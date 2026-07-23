import AdminShell from '@/components/admin/AdminShell';
import ThemeWrapper from '@/components/admin/ThemeWrapper';
import { getSessionUser } from '@/lib/auth';

export const metadata = { title: 'Zigma CMS Admin' };

// This layout sits directly under the root app/layout.js (which already
// provides <html>/<body> and loads globals.css), so it only needs to add
// the admin-specific chrome — it deliberately does NOT extend the public
// (site) layout, since the admin has its own header/nav via AdminShell.
export default async function AdminLayout({ children }) {
  const user = await getSessionUser();
  
  return user ? (
    <ThemeWrapper>
      <AdminShell user={user}>{children}</AdminShell>
    </ThemeWrapper>
  ) : (
    // For login page and other unauthenticated pages, render without any wrapper
    // The login page has its own layout that will be used instead
    <>{children}</>
  );
}
