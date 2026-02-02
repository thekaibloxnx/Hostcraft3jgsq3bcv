import { Server, Users, Cpu, HardDrive, Activity } from "lucide-react";

interface StatsCardsProps {
  totalServers: number;
  runningServers: number;
  totalPlayers: number;
  cpuUsage: number;
  ramUsage: { used: number; total: number };
}

export function StatsCards({
  totalServers,
  runningServers,
  totalPlayers,
  cpuUsage,
  ramUsage,
}: StatsCardsProps) {
  const stats = [
    {
      icon: Server,
      label: "Total Servers",
      value: totalServers,
      subtext: `${runningServers} running`,
      color: "text-primary",
    },
    {
      icon: Users,
      label: "Online Players",
      value: totalPlayers,
      subtext: "across all servers",
      color: "text-blue-500",
    },
    {
      icon: Cpu,
      label: "CPU Usage",
      value: `${cpuUsage}%`,
      subtext: "system total",
      color: "text-yellow-500",
    },
    {
      icon: HardDrive,
      label: "RAM Usage",
      value: `${ramUsage.used}GB`,
      subtext: `of ${ramUsage.total}GB`,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30"
        >
          <div className="flex items-center justify-between">
            <div className={`rounded-lg bg-secondary p-2 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
