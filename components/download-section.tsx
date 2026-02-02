import { Button } from "@/components/ui/button";
import { Download, Github, Shield, Cpu, HardDrive } from "lucide-react";

const requirements = [
  { icon: Cpu, label: "Windows 10/11" },
  { icon: HardDrive, label: "4GB+ RAM" },
  { icon: Shield, label: "Admin rights" },
];

export function DownloadSection() {
  return (
    <section id="download" className="border-t border-border bg-secondary/30 py-20 md:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
          Ready to host your server?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
          Download CraftHost for free and start hosting in minutes. No account required.
        </p>

        {/* Download Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="gap-2 px-8">
            <Download className="h-5 w-5" />
            Download for Windows
            <span className="ml-2 rounded bg-primary-foreground/20 px-2 py-0.5 text-xs">v1.2.0</span>
          </Button>
          <Button variant="outline" size="lg" className="gap-2 px-8 bg-transparent">
            <Github className="h-5 w-5" />
            View on GitHub
          </Button>
        </div>

        {/* System Requirements */}
        <div className="mt-12">
          <p className="mb-4 text-sm text-muted-foreground">System Requirements</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-foreground">
                <req.icon className="h-4 w-4 text-primary" />
                {req.label}
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            No malware or adware
          </div>
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-primary" />
            50,000+ downloads
          </div>
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4 text-primary" />
            Open source
          </div>
        </div>
      </div>
    </section>
  );
}
