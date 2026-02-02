import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturesGrid } from "@/components/features-grid";
import { HowItWorks } from "@/components/how-it-works";
import { FAQSection } from "@/components/faq-section";
import { DownloadSection } from "@/components/download-section";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <section id="features">
          <FeaturesGrid />
        </section>
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <section id="faq">
          <FAQSection />
        </section>
        <DownloadSection />
      </main>
      <Footer />
    </div>
  );
}
