"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ListTodo } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn("border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link
            href="/"
            className="flex items-center space-x-2 font-bold hover:opacity-90 transition-opacity"
          >
            <ListTodo className="h-5 w-5" />
            <span>TaskMaster</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}