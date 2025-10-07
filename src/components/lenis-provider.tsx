"use client";
import { ReactLenis } from "lenis/react";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// This registration is crucial for GSAP and Lenis to work together
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // This ensures ScrollTrigger is aware of any updates
    ScrollTrigger.refresh();
  }, []);
  
  return <ReactLenis root>{children}</ReactLenis>;
}
