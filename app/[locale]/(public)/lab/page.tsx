"use client";

import { motion } from "framer-motion";
import { CoffeeHeroScene } from "@/components/three/CoffeeHeroScene";

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.6, once: false }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
}

export default function LabPage() {
  return (
    <div className="relative -mt-16 bg-[#140d09]">
      <CoffeeHeroScene />

      <div className="relative z-10">
        <Section>
          <h1 className="font-serif text-4xl font-semibold text-[#f7efe0] drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] sm:text-6xl">
            Every Cup,
            <br />A Moment in the Clouds
          </h1>
          <p className="mx-auto mt-6 max-w-sm font-sans text-sm text-[#f7efe0]/70 sm:text-base">
            Scroll to fall into the roast
          </p>
          <motion.div
            className="mx-auto mt-8 h-8 w-5 rounded-full border border-[#f7efe0]/40"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </Section>

        <Section>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-[#839bae]">
            Small-Batch Roasted
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-[#f7efe0] sm:text-5xl">
            Poured With Care,
            <br />
            Sip By Sip
          </h2>
        </Section>

        <Section>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-[#839bae]">
            84 Rue Boileau, Lyon
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-[#f7efe0] sm:text-5xl">
            Cloud9
          </h2>
          <a
            href="../"
            className="mt-8 inline-block rounded-full border border-[#f7efe0]/40 px-6 py-3 font-sans text-sm font-medium text-[#f7efe0] transition-colors hover:bg-[#f7efe0]/10"
          >
            Back to the site
          </a>
        </Section>
      </div>
    </div>
  );
}
