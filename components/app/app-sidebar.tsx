"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Server,
  Terminal,
  Settings,
  FolderOpen,
  Users,
  Plus,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const mainNavItems = [
  { href: "/app", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/app/servers", icon: Server, label: "Servers" },
  { href: "/app/console", icon: Terminal, label: "Console" },
  { href: "/app/players", icon: Users, label: "Players" },
  { href: "/app/files", icon: FolderOpen, label: "Files" },
  { href: "/app/settings", icon: Settings, label: "Settings" },
];

interface AppSidebarProps {
  servers?: Array<{ id: string; name: string; status: "running" | "stopped" }>;
}

export function AppSidebar({ servers = [] }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Server className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-sidebar-foreground">CraftHost</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Servers List */}
        <div className="mt-8">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-semibold uppercase text-sidebar-foreground/60">
              Your Servers
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 space-y-1">
            {servers.length === 0 ? (
              <p className="px-3 py-2 text-xs text-sidebar-foreground/60">
                No servers yet
              </p>
            ) : (
              servers.map((server) => (
                <Link
                  key={server.id}
                  href={`/app/servers/${server.id}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      server.status === "running" ? "bg-primary" : "bg-muted-foreground"
                    )}
                  />
                  <span className="flex-1 truncate">{server.name}</span>
                  <ChevronRight className="h-4 w-4 text-sidebar-foreground/40" />
                </Link>
              ))
            )}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent p-3">
          <p className="text-xs text-sidebar-foreground/60">System Status</p>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-sidebar-foreground">CPU</span>
            <span className="text-sidebar-primary">23%</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-sidebar-foreground">RAM</span>
            <span className="text-sidebar-primary">4.2 GB</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
