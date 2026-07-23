export const metadata = { title: 'Login - Zigma CMS Admin' };

// Login page layout - no AdminShell, just children directly
// This ensures the login page displays without the side menu
export default function LoginLayout({ children }) {
  return <>{children}</>;
}
