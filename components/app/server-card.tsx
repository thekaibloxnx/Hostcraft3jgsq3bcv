"use client";

import { Play, Square, RotateCcw, MoreVertical, Users, Cpu, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ServerCardProps {
  name: string;
  version: string;
  status: "running" | "stopped" | "starting";
  players: { current: number; max: number };
  ram: { used: number; allocated: number };
  cpu: number;
  onStart?: () => void;
  onStop?: () => void;
  onRestart?: () => void;
}

export function ServerCard({
  name,
  version,
  status,
  players,
  ram,
  cpu,
  onStart,
  onStop,
  onRestart,
}: ServerCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{version}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              status === "running" && "bg-primary/20 text-primary",
              status === "stopped" && "bg-secondary text-muted-foreground",
              status === "starting" && "bg-yellow-500/20 text-yellow-500"
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Console</DropdownMenuItem>
              <DropdownMenuItem>Edit Settings</DropdownMenuItem>
              <DropdownMenuItem>Open Folder</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete Server</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-xs">Players</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {players.current}/{players.max}
          </p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <HardDrive className="h-4 w-4" />
            <span className="text-xs">RAM</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {ram.used}/{ram.allocated}GB
          </p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Cpu className="h-4 w-4" />
            <span className="text-xs">CPU</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-foreground">{cpu}%</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {status === "running" ? (
          <>
            <Button
              variant="outline"
              className="flex-1 gap-2 bg-transparent"
              onClick={onStop}
            >
              <Square className="h-4 w-4" />
              Stop
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2 bg-transparent"
              onClick={onRestart}
            >
              <RotateCcw className="h-4 w-4" />
              Restart
            </Button>
          </>
        ) : (
          <Button className="flex-1 gap-2" onClick={onStart}>
            <Play className="h-4 w-4" />
            Start Server
          </Button>
        )}
      </div>
    </div>
  );
}
