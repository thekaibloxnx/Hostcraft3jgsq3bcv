"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Settings,
  FolderOpen,
  Bell,
  Monitor,
  HardDrive,
  Download,
  Shield,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // General
    startMinimized: false,
    minimizeToTray: true,
    autoUpdate: true,
    language: "en",
    // Paths
    javaPath: "C:\\Program Files\\Java\\jdk-21\\bin\\java.exe",
    serversPath: "C:\\Users\\User\\CraftHost\\Servers",
    backupsPath: "C:\\Users\\User\\CraftHost\\Backups",
    // Performance
    maxRam: [8],
    autoOptimize: true,
    // Notifications
    serverStart: true,
    serverStop: true,
    serverCrash: true,
    playerJoin: false,
    // Security
    enableFirewall: true,
    autoBackup: true,
    backupInterval: "daily",
  });

  const updateSetting = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <AppHeader title="Settings" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* General Settings */}
          <section>
            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Settings className="h-5 w-5 text-primary" />
              General
            </div>
            <div className="mt-4 space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Start Minimized</Label>
                  <p className="text-sm text-muted-foreground">
                    Start CraftHost minimized to system tray
                  </p>
                </div>
                <Switch
                  checked={settings.startMinimized}
                  onCheckedChange={(v) => updateSetting("startMinimized", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Minimize to Tray</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep running in background when closed
                  </p>
                </div>
                <Switch
                  checked={settings.minimizeToTray}
                  onCheckedChange={(v) => updateSetting("minimizeToTray", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Update</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically download and install updates
                  </p>
                </div>
                <Switch
                  checked={settings.autoUpdate}
                  onCheckedChange={(v) => updateSetting("autoUpdate", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Language</Label>
                  <p className="text-sm text-muted-foreground">
                    Application display language
                  </p>
                </div>
                <Select
                  value={settings.language}
                  onValueChange={(v) => updateSetting("language", v)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Espanol</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="fr">Francais</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Paths */}
          <section>
            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <FolderOpen className="h-5 w-5 text-primary" />
              File Paths
            </div>
            <div className="mt-4 space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="space-y-2">
                <Label>Java Executable</Label>
                <div className="flex gap-2">
                  <Input value={settings.javaPath} readOnly className="bg-secondary" />
                  <Button variant="outline">Browse</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Servers Directory</Label>
                <div className="flex gap-2">
                  <Input value={settings.serversPath} readOnly className="bg-secondary" />
                  <Button variant="outline">Browse</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Backups Directory</Label>
                <div className="flex gap-2">
                  <Input value={settings.backupsPath} readOnly className="bg-secondary" />
                  <Button variant="outline">Browse</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Performance */}
          <section>
            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <HardDrive className="h-5 w-5 text-primary" />
              Performance
            </div>
            <div className="mt-4 space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Maximum RAM for Servers</Label>
                  <span className="text-sm font-medium text-primary">
                    {settings.maxRam[0]} GB
                  </span>
                </div>
                <Slider
                  value={settings.maxRam}
                  onValueChange={(v) => updateSetting("maxRam", v)}
                  min={2}
                  max={32}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">
                  System RAM: 16 GB | Available: 10 GB
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Optimize</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically adjust JVM flags for best performance
                  </p>
                </div>
                <Switch
                  checked={settings.autoOptimize}
                  onCheckedChange={(v) => updateSetting("autoOptimize", v)}
                />
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section>
            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </div>
            <div className="mt-4 space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <Label>Server Started</Label>
                <Switch
                  checked={settings.serverStart}
                  onCheckedChange={(v) => updateSetting("serverStart", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Server Stopped</Label>
                <Switch
                  checked={settings.serverStop}
                  onCheckedChange={(v) => updateSetting("serverStop", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Server Crash</Label>
                <Switch
                  checked={settings.serverCrash}
                  onCheckedChange={(v) => updateSetting("serverCrash", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Player Join/Leave</Label>
                <Switch
                  checked={settings.playerJoin}
                  onCheckedChange={(v) => updateSetting("playerJoin", v)}
                />
              </div>
            </div>
          </section>

          {/* Security & Backups */}
          <section>
            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Shield className="h-5 w-5 text-primary" />
              Security & Backups
            </div>
            <div className="mt-4 space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Firewall Rules</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically configure Windows Firewall
                  </p>
                </div>
                <Switch
                  checked={settings.enableFirewall}
                  onCheckedChange={(v) => updateSetting("enableFirewall", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">
                    Regularly backup server worlds
                  </p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(v) => updateSetting("autoBackup", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Backup Frequency</Label>
                  <p className="text-sm text-muted-foreground">
                    How often to create backups
                  </p>
                </div>
                <Select
                  value={settings.backupInterval}
                  onValueChange={(v) => updateSetting("backupInterval", v)}
                  disabled={!settings.autoBackup}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end gap-4 pb-8">
            <Button variant="outline">Reset to Defaults</Button>
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
