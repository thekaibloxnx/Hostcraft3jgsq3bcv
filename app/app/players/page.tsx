"use client";

import React from "react"

import { useState } from "react";
import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MoreVertical,
  UserPlus,
  Shield,
  Ban,
  Crown,
  Clock,
} from "lucide-react";

interface Player {
  id: string;
  name: string;
  uuid: string;
  status: "online" | "offline";
  role: "player" | "op" | "admin";
  lastSeen: string;
  playTime: string;
  server?: string;
}

const mockPlayers: Player[] = [
  {
    id: "1",
    name: "Steve",
    uuid: "8667ba71-b85a-4004-af54-457a9734eed7",
    status: "online",
    role: "admin",
    lastSeen: "Now",
    playTime: "124h 32m",
    server: "Survival World",
  },
  {
    id: "2",
    name: "Alex",
    uuid: "6ab43178-89fd-4905-97f6-0f67d9d76fd9",
    status: "online",
    role: "op",
    lastSeen: "Now",
    playTime: "89h 15m",
    server: "Survival World",
  },
  {
    id: "3",
    name: "Notch",
    uuid: "069a79f4-44e9-4726-a5be-fca90e38aaf5",
    status: "online",
    role: "player",
    lastSeen: "Now",
    playTime: "45h 20m",
    server: "Survival World",
  },
  {
    id: "4",
    name: "Herobrine",
    uuid: "f84c6a79-0a4e-45e0-879b-cd49ebd4c4e2",
    status: "offline",
    role: "player",
    lastSeen: "2 hours ago",
    playTime: "12h 45m",
  },
  {
    id: "5",
    name: "Dinnerbone",
    uuid: "61699b2e-d327-4a01-9f1e-0ea8c3f06bc6",
    status: "offline",
    role: "op",
    lastSeen: "Yesterday",
    playTime: "200h 10m",
  },
];

const bannedPlayers = [
  { name: "Griefer123", reason: "Griefing", date: "2024-01-15" },
  { name: "SpamBot", reason: "Spam", date: "2024-01-10" },
];

const whitelistedPlayers = ["Steve", "Alex", "Notch", "Dinnerbone", "Jeb_"];

export default function PlayersPage() {
  const [players] = useState<Player[]>(mockPlayers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServer, setSelectedServer] = useState("all");

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesServer =
      selectedServer === "all" ||
      (player.server && player.server === selectedServer);
    return matchesSearch && (selectedServer === "all" ? true : matchesServer);
  });

  const onlinePlayers = filteredPlayers.filter((p) => p.status === "online");
  const offlinePlayers = filteredPlayers.filter((p) => p.status === "offline");

  const getRoleBadge = (role: Player["role"]) => {
    switch (role) {
      case "admin":
        return (
          <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
            <Crown className="h-3 w-3" />
            Admin
          </span>
        );
      case "op":
        return (
          <span className="flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
            <Shield className="h-3 w-3" />
            OP
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <AppHeader title="Players" />
      <div className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="online" className="w-full">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="online">
                Online ({onlinePlayers.length})
              </TabsTrigger>
              <TabsTrigger value="all">All Players</TabsTrigger>
              <TabsTrigger value="whitelist">Whitelist</TabsTrigger>
              <TabsTrigger value="banned">Banned</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9 bg-secondary"
                />
              </div>
              <Select value={selectedServer} onValueChange={setSelectedServer}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All servers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Servers</SelectItem>
                  <SelectItem value="Survival World">Survival World</SelectItem>
                  <SelectItem value="Creative Build">Creative Build</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="online" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {onlinePlayers.map((player) => (
                <PlayerCard key={player.id} player={player} getRoleBadge={getRoleBadge} />
              ))}
              {onlinePlayers.length === 0 && (
                <div className="col-span-full rounded-xl border border-border bg-card p-8 text-center">
                  <p className="text-muted-foreground">No players online</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPlayers.map((player) => (
                <PlayerCard key={player.id} player={player} getRoleBadge={getRoleBadge} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="whitelist" className="mt-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Whitelisted Players
                </h3>
                <Button size="sm" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Player
                </Button>
              </div>
              <div className="mt-4 space-y-2">
                {whitelistedPlayers.map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-lg bg-secondary/50 p-3"
                  >
                    <span className="text-foreground">{name}</span>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="banned" className="mt-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Banned Players</h3>
                <Button size="sm" variant="destructive" className="gap-2">
                  <Ban className="h-4 w-4" />
                  Ban Player
                </Button>
              </div>
              <div className="mt-4 space-y-2">
                {bannedPlayers.map((player) => (
                  <div
                    key={player.name}
                    className="flex items-center justify-between rounded-lg bg-secondary/50 p-3"
                  >
                    <div>
                      <span className="font-medium text-foreground">
                        {player.name}
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {player.reason} - {player.date}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Unban
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function PlayerCard({
  player,
  getRoleBadge,
}: {
  player: Player;
  getRoleBadge: (role: Player["role"]) => React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar placeholder */}
          <div className="relative h-10 w-10 rounded-lg bg-secondary">
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
              {player.name[0]}
            </div>
            {player.status === "online" && (
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-primary" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{player.name}</span>
              {getRoleBadge(player.role)}
            </div>
            <p className="text-xs text-muted-foreground">
              {player.status === "online" ? player.server : player.lastSeen}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Make OP</DropdownMenuItem>
            <DropdownMenuItem>Kick</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Ban</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {player.playTime}
        </span>
      </div>
    </div>
  );
}
