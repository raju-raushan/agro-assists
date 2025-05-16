import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'AgroAssist',
  description: 'Your AI-powered agricultural assistant.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/components/assets/icon.png" type="image/gif" />
        <title>AgroAssist</title>
      </head>
      <body className={`${GeistSans.className} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
