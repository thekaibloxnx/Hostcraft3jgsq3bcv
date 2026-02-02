"use client";

import { useState } from "react";
import { Plus, Server, Package, Cpu, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const serverTypes = [
  { value: "vanilla", label: "Vanilla", description: "Official Minecraft server" },
  { value: "paper", label: "Paper", description: "High performance fork" },
  { value: "spigot", label: "Spigot", description: "Plugin support" },
  { value: "forge", label: "Forge", description: "Mod support" },
  { value: "fabric", label: "Fabric", description: "Lightweight mods" },
];

const versions = [
  "1.21.4",
  "1.21.3",
  "1.21.2",
  "1.21.1",
  "1.21",
  "1.20.4",
  "1.20.2",
  "1.20.1",
  "1.19.4",
  "1.18.2",
];

interface CreateServerDialogProps {
  onCreateServer?: (server: {
    name: string;
    type: string;
    version: string;
    ram: number;
    port: number;
  }) => void;
}

export function CreateServerDialog({ onCreateServer }: CreateServerDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("paper");
  const [version, setVersion] = useState("1.21.4");
  const [ram, setRam] = useState([4]);
  const [port, setPort] = useState("25565");

  const handleCreate = () => {
    onCreateServer?.({
      name,
      type,
      version,
      ram: ram[0],
      port: parseInt(port),
    });
    setOpen(false);
    setName("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Server
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            Create New Server
          </DialogTitle>
          <DialogDescription>
            Configure your new Minecraft server. You can change these settings later.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Server Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Server Name</Label>
            <Input
              id="name"
              placeholder="My Awesome Server"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Server Type */}
          <div className="space-y-2">
            <Label>Server Type</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {serverTypes.map((serverType) => (
                <button
                  key={serverType.value}
                  type="button"
                  onClick={() => setType(serverType.value)}
                  className={`rounded-lg border p-3 text-left transition-all ${
                    type === serverType.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-medium text-foreground">{serverType.label}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {serverType.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Version */}
          <div className="space-y-2">
            <Label htmlFor="version">Minecraft Version</Label>
            <Select value={version} onValueChange={setVersion}>
              <SelectTrigger>
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                {versions.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* RAM Allocation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                RAM Allocation
              </Label>
              <span className="text-sm font-medium text-primary">{ram[0]} GB</span>
            </div>
            <Slider
              value={ram}
              onValueChange={setRam}
              min={1}
              max={16}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Recommended: 2-4GB for small servers, 6-8GB for modded
            </p>
          </div>

          {/* Port */}
          <div className="space-y-2">
            <Label htmlFor="port" className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              Server Port
            </Label>
            <Input
              id="port"
              placeholder="25565"
              value={port}
              onChange={(e) => setPort(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Default Minecraft port is 25565
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name}>
            Create Server
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
