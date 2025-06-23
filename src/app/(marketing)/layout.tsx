// src/app/layout.tsx
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import '@/app/globals.css'
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '../header';
import { SiteFooter } from '@/components/footer/footer';
import { ProgramAlertCard } from '@/components/alert';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Looping Binary TeamHub',
  description: 'A platform to manage teams, projects, and progress tracking for the Junior Dev Arena',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        fontSans.variable
      )}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ProgramAlertCard />
            <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
