"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app/app-header";
import { ServerCard } from "@/components/app/server-card";
import { CreateServerDialog } from "@/components/app/create-server-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Server {
  id: string;
  name: string;
  version: string;
  type: string;
  status: "running" | "stopped" | "starting";
  players: { current: number; max: number };
  ram: { used: number; allocated: number };
  cpu: number;
}

const initialServers: Server[] = [
  {
    id: "1",
    name: "Survival World",
    version: "Paper 1.21.4",
    type: "paper",
    status: "running",
    players: { current: 3, max: 20 },
    ram: { used: 2.4, allocated: 4 },
    cpu: 15,
  },
  {
    id: "2",
    name: "Creative Build",
    version: "Vanilla 1.21.4",
    type: "vanilla",
    status: "stopped",
    players: { current: 0, max: 10 },
    ram: { used: 0, allocated: 2 },
    cpu: 0,
  },
  {
    id: "3",
    name: "Modded Adventure",
    version: "Forge 1.20.1",
    type: "forge",
    status: "stopped",
    players: { current: 0, max: 8 },
    ram: { used: 0, allocated: 6 },
    cpu: 0,
  },
  {
    id: "4",
    name: "Minigames Hub",
    version: "Paper 1.21.4",
    type: "paper",
    status: "running",
    players: { current: 8, max: 50 },
    ram: { used: 5.2, allocated: 8 },
    cpu: 32,
  },
  {
    id: "5",
    name: "Skyblock",
    version: "Spigot 1.20.4",
    type: "spigot",
    status: "stopped",
    players: { current: 0, max: 30 },
    ram: { used: 0, allocated: 4 },
    cpu: 0,
  },
];

export default function ServersPage() {
  const [servers, setServers] = useState<Server[]>(initialServers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredServers = servers.filter((server) => {
    const matchesSearch = server.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || server.type === filterType;
    const matchesStatus =
      filterStatus === "all" || server.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleStartServer = (id: string) => {
    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "starting" } : s))
    );
    setTimeout(() => {
      setServers((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                status: "running",
                cpu: Math.floor(Math.random() * 20) + 5,
              }
            : s
        )
      );
    }, 2000);
  };

  const handleStopServer = (id: string) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "stopped",
              players: { ...s.players, current: 0 },
              cpu: 0,
              ram: { ...s.ram, used: 0 },
            }
          : s
      )
    );
  };

  const handleRestartServer = (id: string) => {
    handleStopServer(id);
    setTimeout(() => handleStartServer(id), 500);
  };

  const handleCreateServer = (serverData: {
    name: string;
    type: string;
    version: string;
    ram: number;
    port: number;
  }) => {
    const newServer: Server = {
      id: Date.now().toString(),
      name: serverData.name,
      version: `${serverData.type.charAt(0).toUpperCase() + serverData.type.slice(1)} ${serverData.version}`,
      type: serverData.type,
      status: "stopped",
      players: { current: 0, max: 20 },
      ram: { used: 0, allocated: serverData.ram },
      cpu: 0,
    };
    setServers((prev) => [...prev, newServer]);
  };

  return (
    <>
      <AppHeader title="Servers" />
      <div className="flex-1 overflow-y-auto p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search servers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9 bg-secondary"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="vanilla">Vanilla</SelectItem>
                <SelectItem value="paper">Paper</SelectItem>
                <SelectItem value="spigot">Spigot</SelectItem>
                <SelectItem value="forge">Forge</SelectItem>
                <SelectItem value="fabric">Fabric</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="stopped">Stopped</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <CreateServerDialog onCreateServer={handleCreateServer} />
          </div>
        </div>

        {/* Server Grid */}
        <div
          className={`mt-6 grid gap-4 ${
            viewMode === "grid"
              ? "md:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {filteredServers.map((server) => (
            <ServerCard
              key={server.id}
              name={server.name}
              version={server.version}
              status={server.status}
              players={server.players}
              ram={server.ram}
              cpu={server.cpu}
              onStart={() => handleStartServer(server.id)}
              onStop={() => handleStopServer(server.id)}
              onRestart={() => handleRestartServer(server.id)}
            />
          ))}
        </div>

        {filteredServers.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground">No servers found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your filters or create a new server
            </p>
          </div>
        )}
      </div>
    </>
  );
}
