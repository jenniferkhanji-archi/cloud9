"use client";

import Image from "next/image";
import { Link as LocaleLink } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { OrbitingClouds } from "@/components/cloud/OrbitingClouds";

function Slide({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative flex h-full w-full shrink-0 snap-start snap-always items-center justify-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-blue/15 via-transparent to-cream" />
      <OrbitingClouds className="pointer-events-none absolute left-1/2 top-1/2" />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export default function LabPage() {
  return (
    <div className="h-[calc(100vh-4rem)] snap-y snap-mandatory overflow-y-scroll scroll-smooth bg-cream">
      <Slide>
        <Image
          src="/brand/mascot-blue.png"
          alt=""
          width={220}
          height={244}
          priority
          className="mx-auto h-28 w-auto"
        />
        <h1 className="mt-6 font-serif text-4xl font-medium text-espresso sm:text-6xl">
          Every Cup,
          <br />A Moment in the Clouds
        </h1>
        <p className="mx-auto mt-6 max-w-sm font-sans text-base text-stone-600">
          Scroll to drift through Cloud9
        </p>
        <div className="mx-auto mt-10 h-8 w-5 animate-bounce rounded-full border-2 border-espresso/40" />
      </Slide>

      <Slide>
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-sky-blue">
          Small-Batch Roasted
        </p>
        <h2 className="mt-4 font-serif text-3xl font-medium text-espresso sm:text-5xl">
          Poured With Care,
          <br />
          Sip By Sip
        </h2>
        <p className="mx-auto mt-6 max-w-md font-sans text-base text-stone-600">
          Specialty coffee, matcha, and pastries — made fresh, served with a smile.
        </p>
      </Slide>

      <Slide>
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-sky-blue">
          84 Rue Boileau, Lyon
        </p>
        <h2 className="mt-4 font-serif text-4xl font-medium text-espresso sm:text-6xl">Cloud9</h2>
        <div className="mt-10">
          <Button asChild variant="bold" size="lg">
            <LocaleLink href="/">Back to the site</LocaleLink>
          </Button>
        </div>
      </Slide>
    </div>
  );
}
