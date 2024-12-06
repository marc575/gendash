"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  Settings,
  BarChart3,
  Users,
  FolderKanban,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tâches",
    href: "/tasks",
    icon: ListTodo,
  },
  {
    title: "Projets",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Calendrier",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1 px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
              isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("h-4 w-4", isActive ? "text-foreground" : "text-muted-foreground")} />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}