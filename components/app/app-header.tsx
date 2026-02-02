"use client";

import { Bell, Search, Minimize2, Maximize2, X, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title = "Dashboard" }: AppHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      {/* Left - Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      {/* Center - Search */}
      <div className="hidden max-w-md flex-1 px-8 md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search servers, commands..."
            className="pl-10 bg-secondary border-border"
          />
        </div>
      </div>

      {/* Right - Actions & Window Controls */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {/* Window Controls (Desktop App Style) */}
        <div className="ml-4 flex items-center gap-1 border-l border-border pl-4">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded hover:bg-secondary"
            aria-label="Minimize"
          >
            <Minus className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded hover:bg-secondary"
            aria-label="Maximize"
          >
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded hover:bg-destructive hover:text-destructive-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
