import {
  Server,
  FolderOpen,
  Zap,
  Download,
  HardDrive,
  Users,
  Settings,
  Terminal,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "One-Click Server Creation",
    description: "Create new servers in seconds with our intuitive interface. Choose from Vanilla, Paper, Spigot, Forge, Fabric, and more.",
  },
  {
    icon: Download,
    title: "Auto Java Installation",
    description: "Don't have Java? No problem. CraftHost automatically downloads and configures the correct Java version for each server.",
  },
  {
    icon: HardDrive,
    title: "Unlimited Servers",
    description: "Run as many servers as your PC can handle. No artificial limits, no subscription fees.",
  },
  {
    icon: Terminal,
    title: "Built-in Console",
    description: "Execute commands directly from the app with a full-featured server console and command history.",
  },
  {
    icon: Users,
    title: "Player Management",
    description: "Easily manage players, ops, whitelist, and bans through a clean interface.",
  },
  {
    icon: Settings,
    title: "Advanced Configuration",
    description: "Edit server.properties, configure plugins, and adjust settings without leaving the app.",
  },
  {
    icon: FolderOpen,
    title: "File Manager",
    description: "Browse, edit, and manage all your server files directly in the application with syntax highlighting.",
  },
  {
    icon: Server,
    title: "Port Management",
    description: "Automatic port forwarding guides and network configuration help to get you online fast.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Everything you need in one app
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            CraftHost gives you complete control over your Minecraft servers with an intuitive desktop application.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:bg-card/80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
