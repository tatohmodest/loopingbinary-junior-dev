// src/app/layout.tsx
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import '@/app/globals.css'
import { ThemeProvider } from '@/components/theme-provider';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Looping Binary Junior Dev Arena - Learn Programming & Build Real Projects',
  description: 'Join Looping Binary\'s Junior Dev Arena - the ultimate platform for aspiring developers to learn programming, build real-world projects, collaborate with teams, and accelerate your coding career. Master JavaScript, React, Next.js, Python, and more through hands-on experience.',
  keywords: [
    'looping binary',
    'dev team',
    'dev',
    'junior developer',
    'programming bootcamp',
    'coding arena',
    'learn programming',
    'developer training',
    'coding projects',
    'web development',
    'JavaScript training',
    'React development',
    'Next.js projects',
    'Python programming',
    'full stack development',
    'coding mentorship',
    'developer community',
    'programming challenges',
    'code collaboration',
    'software development',
    'tech career',
    'coding skills',
    'developer portfolio',
    'programming education',
    'coding bootcamp',
    'developer internship',
    'tech training',
    'programming practice',
    'code review',
    'developer tools',
    'coding interview prep',
    'software engineering',
    'web developer training',
    'frontend development',
    'backend development',
    'fullstack developer',
    'coding certification',
    'programming course',
    'developer workshop',
    'tech skills',
    'coding competition',
    'developer networking',
    'programming mentor',
    'code learning platform',
    'developer bootcamp',
    'tech education',
    'coding academy',
    'programming fundamentals',
    'developer resources',
    'coding tutorials',
    'programming projects',
    'developer experience',
    'tech community',
    'coding practice',
    'developer growth',
    'programming career'
  ].join(', '),
  authors: [{ name: 'Looping Binary' }],
  creator: 'Looping Binary',
  publisher: 'Looping Binary',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://loopingbinary-junior-dev.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Looping Binary Junior Dev Arena - Transform Your Coding Journey',
    description: 'Join thousands of aspiring developers in the Junior Dev Arena. Learn programming through real projects, get mentorship, and build your tech career with hands-on experience in JavaScript, React, Python, and more.',
    url: 'https://loopingbinary-junior-dev.vercel.app',
    siteName: 'Looping Binary Junior Dev Arena',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Looping Binary Junior Dev Arena - Learn Programming & Build Projects',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Looping Binary Junior Dev Arena - Learn Programming & Build Real Projects',
    description: 'Transform your coding journey with hands-on projects, expert mentorship, and a supportive developer community. Master JavaScript, React, Python, and more.',
    images: ['/twitter-image.jpg'],
    creator: '@loopingbinary',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'education',
  classification: 'Programming Education Platform',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#000000',
      },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Junior Dev Arena',
    'application-name': 'Junior Dev Arena',
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Looping Binary Junior Dev Arena',
              description: 'A comprehensive platform for aspiring developers to learn programming, build real-world projects, and accelerate their coding careers through hands-on experience and mentorship.',
              url: 'https://loopingbinary-junior-dev.vercel.app',
              logo: 'https://loopingbinary-junior-dev.vercel.app/logo.png',
              sameAs: [
                'https://twitter.com/loopingbinary',
                'https://github.com/loopingbinary',
                'https://linkedin.com/company/loopingbinary',
              ],
              offers: {
                '@type': 'Offer',
                category: 'Programming Education',
                availability: 'https://schema.org/InStock',
              },
              educationalCredentialAwarded: 'Programming Certification',
              hasCredential: {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: 'Programming & Software Development',
              },
              teaches: [
                'JavaScript Programming',
                'React Development',
                'Next.js Framework',
                'Python Programming',
                'Full Stack Development',
                'Web Development',
                'Software Engineering Practices',
              ],
            }),
          }}
        />
      </head>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        fontSans.variable
      )}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
