"use client";

import { Button } from "@/components/ui/button";
import { Download, Play, ChevronRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Now available for Windows</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Heading */}
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Host Minecraft servers{" "}
            <span className="text-primary">on your PC</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            The easiest way to create and manage Minecraft servers. No technical knowledge required. 
            One-click setup, automatic Java installation, and complete control.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="#download">
                <Download className="h-5 w-5" />
                Download for Windows
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 px-8 bg-transparent" asChild>
              <Link href="/app">
                <Play className="h-5 w-5" />
                Try Demo
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "50K+", label: "Downloads" },
              { value: "Free", label: "Forever" },
              { value: "5 min", label: "Setup Time" },
              { value: "4.9", label: "User Rating" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* App Preview */}
        <div className="mt-20">
          <div className="relative mx-auto max-w-5xl">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
              {/* Window Controls */}
              <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-3">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-primary/80" />
                </div>
                <div className="ml-4 flex-1 text-center text-sm text-muted-foreground">
                  CraftHost v1.2.0
                </div>
              </div>
              {/* App Preview Content */}
              <div className="aspect-video bg-background p-6">
                <div className="flex h-full gap-4">
                  {/* Sidebar */}
                  <div className="w-48 rounded-lg border border-border bg-secondary/30 p-4">
                    <div className="space-y-2">
                      {["Dashboard", "Servers", "Console", "Settings"].map((item, i) => (
                        <div 
                          key={item} 
                          className={`rounded-md px-3 py-2 text-sm ${i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Main Content */}
                  <div className="flex-1 rounded-lg border border-border bg-secondary/30 p-4">
                    <div className="mb-4 text-lg font-semibold text-foreground">Your Servers</div>
                    <div className="grid gap-3">
                      {[
                        { name: "Survival World", status: "Running", players: "3/20" },
                        { name: "Creative Build", status: "Stopped", players: "0/10" },
                      ].map((server, i) => (
                        <div key={i} className="flex items-center justify-between rounded-md border border-border bg-card p-3">
                          <div>
                            <div className="font-medium text-foreground">{server.name}</div>
                            <div className="text-sm text-muted-foreground">Players: {server.players}</div>
                          </div>
                          <div className={`rounded-full px-3 py-1 text-xs ${server.status === "Running" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                            {server.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
