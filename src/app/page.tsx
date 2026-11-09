import { Hero } from "@/components/hero/Hero";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { About } from "@/components/sections/About";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { Roadmap } from "@/components/sections/Roadmap";
import { Story } from "@/components/sections/Story";
import { StudioPreview } from "@/components/sections/StudioPreview";

export default function Home() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-[60] rounded-full bg-starlight px-5 py-3 font-semibold text-void focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido" className="flex-1">
        <Hero />
        <About />
        <Story />
        <Ecosystem />
        <StudioPreview />
        <Roadmap />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
