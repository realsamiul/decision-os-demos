"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Main Homepage Component
export default function HomePage() {
  const mainRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!mainRef.current) return;

    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".story-section");

      ScrollTrigger.create({
        trigger: mainRef.current,
        start: "top top",
        end: `+=${(sections.length - 1) * 100}%`,
        pin: true,
      });

      sections.forEach((section, index) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: mainRef.current,
            start: `top+=${index * 100}% top`,
            end: `top+=${(index + 1) * 100}% top`,
            scrub: 1,
          }
        })
        .fromTo(section, { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, ease: "power2.inOut" })
        .to(section, { autoAlpha: 0, scale: 0.95, ease: "power2.inOut" }, ">0.5");
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef}>
      <div className="relative" style={{ height: `${(4) * 100}vh` }}>
        
        {/* Section 1: The Title */}
        <div className="w-full h-screen absolute top-0 left-0 story-section flex flex-col justify-center items-center text-center p-8">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6">
              Beyond Prediction.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400">
              The Kalopathor Decision OS and the Future of Applied Intelligence.
            </p>
        </div>

        {/* Section 2: The "Ghost in the Machine" */}
        <div className="w-full h-screen absolute top-0 left-0 story-section flex flex-col justify-center items-center text-center p-8">
          <p className="text-2xl md:text-4xl leading-relaxed text-gray-300 max-w-4xl">
            In the modern economy, uncertainty is a multi-million-dollar problem. It is the digital <span className="text-white font-medium">ghost in the machine</span>—a phantom of volatility that haunts every contract, supply chain, and policy decision.
          </p>
        </div>
        
        {/* Section 3: The Fundamental Question */}
        <div className="w-full h-screen absolute top-0 left-0 story-section flex flex-col justify-center items-center text-center p-8">
          <p className="text-2xl md:text-4xl leading-relaxed text-gray-300 max-w-4xl">
            We asked a more fundamental question: Could we engineer a system of insight, a true situational awareness platform capable of generating a <span className="text-white font-medium">verifiable, data-driven edge?</span>
          </p>
        </div>

        {/* Section 4: The Reveal & Call to Action */}
        <div className="w-full h-screen absolute top-0 left-0 story-section flex flex-col justify-center items-center text-center p-8">
           <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">This is Kalopathor.</h2>
           <p className="text-xl text-gray-400 mt-4 mb-12">
             An architecture designed not just to find patterns, but to create intelligence.
           </p>
           <Link href="/hyperion/freight">
             <button className="px-8 py-4 bg-white text-black font-semibold rounded-full text-lg hover:bg-gray-200 transition-colors">
                Explore The First Demo
             </button>
           </Link>
        </div>

      </div>
    </main>
  );
}