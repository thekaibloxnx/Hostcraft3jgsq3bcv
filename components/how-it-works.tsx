import { Download, Settings, Play, Users } from "lucide-react";

const steps = [
  {
    icon: Download,
    step: "01",
    title: "Download CraftHost",
    description: "Get the free app for Windows. No account required, no credit card needed.",
  },
  {
    icon: Settings,
    step: "02",
    title: "Configure Your Server",
    description: "Choose your server type (Vanilla, Paper, Spigot, Forge, Fabric) and customize settings.",
  },
  {
    icon: Play,
    step: "03",
    title: "Start Hosting",
    description: "Click start and your server is ready. Java is installed automatically if needed.",
  },
  {
    icon: Users,
    step: "04",
    title: "Invite Friends",
    description: "Share your server IP with friends. Use our port forwarding guide to play online.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-border bg-secondary/30 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Get started in minutes
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            No complex setup or technical knowledge required. Follow these simple steps to host your first server.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden h-px w-full translate-x-1/2 bg-border lg:block" />
              )}
              
              <div className="relative rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50">
                {/* Step Number */}
                <div className="absolute -top-3 left-6 bg-card px-2 text-sm font-mono text-primary">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="h-6 w-6" />
                </div>
                
                {/* Content */}
                <h3 className="mt-4 font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
