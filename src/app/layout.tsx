import React from 'react';
import { Metadata } from 'next';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { Outfit } from "next/font/google";
import "@/styles/globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: 'Tatchou Marc',
  description: 'Application de gestion de tâches moderne et intuitive',
  keywords: ['tâches', 'gestion', 'productivité', 'organisation', 'planification'],
  authors: [{ name: 'Tatchou Marc' }],
  creator: 'Tatchou Marc',
  publisher: 'TaskMaster',
  applicationName: 'TaskMaster',
  icons: [
    { rel: 'icon', url: '/code.svg' },
    { rel: 'apple-touch-icon', url: '/code.svg' }
  ]
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${outfit.variable} bg-background text-foreground antialiased`} suppressHydrationWarning>
        <div className="relative flex min-h-screen flex-col mb-5">
          <ClientLayout>
            {children}
          </ClientLayout>
        </div>
      </body>
    </html>
  );
}