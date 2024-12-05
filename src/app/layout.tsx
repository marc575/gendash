import React from 'react';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { Outfit } from "next/font/google";
import "@/styles/globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: 'Tatchou Marc',
  description: 'Gérez vos tâches efficacement',
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={`${outfit.variable} bg-background text-foreground antialiased`} suppressHydrationWarning>
        <div className="relative flex min-h-screen flex-col">
          <ClientLayout>
            {children}
          </ClientLayout>
        </div>
      </body>
    </html>
  );
}