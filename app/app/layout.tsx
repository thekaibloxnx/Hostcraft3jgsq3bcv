import React from "react"
import { AppSidebar } from "@/components/app/app-sidebar";

const mockServers = [
  { id: "1", name: "Survival World", status: "running" as const },
  { id: "2", name: "Creative Build", status: "stopped" as const },
  { id: "3", name: "Modded Server", status: "stopped" as const },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar servers={mockServers} />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
