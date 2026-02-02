"use client";

import React from "react"

import { useState, useRef, useEffect } from "react";
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
import { Send, Trash2, Download, Copy, Terminal } from "lucide-react";

interface LogEntry {
  id: number;
  timestamp: string;
  type: "info" | "warn" | "error" | "player" | "command";
  message: string;
}

const initialLogs: LogEntry[] = [
  { id: 1, timestamp: "15:23:01", type: "info", message: "[Server] Starting Minecraft server..." },
  { id: 2, timestamp: "15:23:02", type: "info", message: "[Server] Loading properties" },
  { id: 3, timestamp: "15:23:03", type: "info", message: "[Server] Default game type: SURVIVAL" },
  { id: 4, timestamp: "15:23:05", type: "info", message: "[Server] Preparing level \"world\"" },
  { id: 5, timestamp: "15:23:08", type: "info", message: "[Server] Preparing spawn area: 0%" },
  { id: 6, timestamp: "15:23:12", type: "info", message: "[Server] Preparing spawn area: 50%" },
  { id: 7, timestamp: "15:23:15", type: "info", message: "[Server] Preparing spawn area: 100%" },
  { id: 8, timestamp: "15:23:16", type: "info", message: "[Server] Done! For help, type \"help\"" },
  { id: 9, timestamp: "15:24:32", type: "player", message: "[Server] Steve joined the game" },
  { id: 10, timestamp: "15:25:01", type: "player", message: "[Server] Alex joined the game" },
  { id: 11, timestamp: "15:26:45", type: "command", message: "[Steve] /gamemode creative" },
  { id: 12, timestamp: "15:26:46", type: "info", message: "[Server] Set Steve's game mode to Creative Mode" },
  { id: 13, timestamp: "15:28:03", type: "warn", message: "[Server] Can't keep up! Is the server overloaded?" },
  { id: 14, timestamp: "15:30:15", type: "player", message: "[Server] Notch joined the game" },
];

const servers = [
  { id: "1", name: "Survival World" },
  { id: "2", name: "Creative Build" },
  { id: "3", name: "Modded Adventure" },
];

export default function ConsolePage() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [command, setCommand] = useState("");
  const [selectedServer, setSelectedServer] = useState("1");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSendCommand = () => {
    if (!command.trim()) return;

    const newLog: LogEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      type: "command",
      message: `[Console] /${command}`,
    };

    setLogs((prev) => [...prev, newLog]);
    setCommandHistory((prev) => [command, ...prev]);
    setCommand("");
    setHistoryIndex(-1);

    // Simulate server response
    setTimeout(() => {
      const responseLog: LogEntry = {
        id: Date.now() + 1,
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        type: "info",
        message: `[Server] Command executed: ${command}`,
      };
      setLogs((prev) => [...prev, responseLog]);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendCommand();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setCommand("");
      }
    }
  };

  const clearLogs = () => setLogs([]);

  const copyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] ${l.message}`).join("\n");
    navigator.clipboard.writeText(text);
  };

  const getLogColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "error":
        return "text-red-400";
      case "warn":
        return "text-yellow-400";
      case "player":
        return "text-blue-400";
      case "command":
        return "text-primary";
      default:
        return "text-foreground/80";
    }
  };

  return (
    <>
      <AppHeader title="Console" />
      <div className="flex flex-1 flex-col overflow-hidden p-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-muted-foreground" />
            <Select value={selectedServer} onValueChange={setSelectedServer}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select server" />
              </SelectTrigger>
              <SelectContent>
                {servers.map((server) => (
                  <SelectItem key={server.id} value={server.id}>
                    {server.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyLogs}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={clearLogs}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        {/* Console Output */}
        <div
          ref={consoleRef}
          className="mt-4 flex-1 overflow-y-auto rounded-lg border border-border bg-[#0d1117] p-4 font-mono text-sm"
        >
          {logs.length === 0 ? (
            <p className="text-muted-foreground">No logs yet. Start your server to see output.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="py-0.5">
                <span className="text-muted-foreground">[{log.timestamp}]</span>{" "}
                <span className={getLogColor(log.type)}>{log.message}</span>
              </div>
            ))
          )}
        </div>

        {/* Command Input */}
        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-primary">/</span>
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter command..."
              className="pl-6 font-mono bg-secondary"
            />
          </div>
          <Button onClick={handleSendCommand}>
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Commands */}
        <div className="mt-4">
          <p className="mb-2 text-xs text-muted-foreground">Quick Commands</p>
          <div className="flex flex-wrap gap-2">
            {["help", "list", "time set day", "weather clear", "save-all", "stop"].map((cmd) => (
              <Button
                key={cmd}
                variant="outline"
                size="sm"
                onClick={() => {
                  setCommand(cmd);
                }}
                className="font-mono text-xs"
              >
                /{cmd}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
