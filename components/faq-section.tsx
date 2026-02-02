"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is CraftHost really free?",
    answer: "Yes, CraftHost is completely free with no hidden fees, subscriptions, or limitations. You can host unlimited servers on your PC without paying anything.",
  },
  {
    question: "Do I need to install Java separately?",
    answer: "No! CraftHost automatically detects if you have Java installed and downloads the correct version for each server type if needed. No manual Java installation required.",
  },
  {
    question: "Can my friends join my server over the internet?",
    answer: "Yes! For friends on your local network, they can join directly. For online play, you'll need to set up port forwarding on your router. CraftHost includes a built-in guide to help you through this process.",
  },
  {
    question: "What server types are supported?",
    answer: "CraftHost supports Vanilla, Paper, Spigot, Forge, Fabric, and many other server types. You can easily switch between them or run multiple different servers.",
  },
  {
    question: "How much RAM does my server need?",
    answer: "A small server (2-5 players) needs about 2-4GB of RAM. CraftHost includes a memory slider to allocate the right amount based on your system and player count.",
  },
  {
    question: "Can I install mods and plugins?",
    answer: "Absolutely! CraftHost supports drag-and-drop installation of mods (Forge/Fabric) and plugins (Spigot/Paper). You can also manage them through the built-in file manager.",
  },
  {
    question: "Will my server run when the app is closed?",
    answer: "The server runs as long as CraftHost is open. When you close the app, your server will gracefully shut down. You can minimize to tray to keep it running in the background.",
  },
  {
    question: "Is my world saved when I stop the server?",
    answer: "Yes, your world is always saved. CraftHost also includes automatic backup features to protect your world from corruption or accidental changes.",
  },
];

export function FAQSection() {
  return (
    <section className="border-t border-border py-20 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Everything you need to know about hosting Minecraft servers with CraftHost.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-foreground hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
