import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Collections } from "@/components/site/Collections";
import { Featured } from "@/components/site/Featured";
import { Story } from "@/components/site/Story";
import { Categories } from "@/components/site/Categories";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />
      <Hero />
      <Collections />
      <Featured />
      <Story />
      <Categories />
      <Footer />
    </main>
  );
}
