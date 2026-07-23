'use client';
import { ThemeProvider } from '@/lib/ThemeProvider';

export default function ThemeWrapper({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
