"use client";

import React, { useState } from 'react';
import { Navigation } from './navigation';
import { Header } from './Header';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-gray-900">Tatchou Marc</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden rounded-lg p-1 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <Navigation />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile toggle button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-4 right-4 z-50 rounded-full bg-primary-600 p-3 text-blue shadow-lg hover:bg-primary-700 transition-colors lg:hidden"
        >
          <Menu className="h-6 w-6 " />
        </button>
      )}
    </div>
  );
}
