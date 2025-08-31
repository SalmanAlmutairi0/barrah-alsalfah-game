"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Hero from "./landing/hero";
import Features from "./landing/features";
import HowToPlay from "./landing/howToPlay";
import Testimonials, { testimonials } from "./landing/testimonials";
import Footer from "./landing/footer";

export default function LandingPage() {
  const router = useRouter();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const [isHowToPlayVisible, setIsHowToPlayVisible] = useState(false);

  useEffect(() => {
    // Ensure page starts at the top on refresh
    window.scrollTo(0, 0);

    setIsHeroVisible(true);

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    // Intersection Observer for scroll-based animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === "features-section") {
              setIsFeaturesVisible(true);
            } else if (entry.target.id === "how-to-play") {
              setIsHowToPlayVisible(true);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px", // Trigger 100px before the element enters viewport
      }
    );

    // Observe sections after a short delay to ensure they're rendered
    // Fallback scroll listener
    const handleScroll = () => {
      const featuresSection = document.getElementById("features-section");
      const howToPlaySection = document.getElementById("how-to-play");

      if (featuresSection && !isFeaturesVisible) {
        const rect = featuresSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
          setIsFeaturesVisible(true);
        }
      }

      if (howToPlaySection && !isHowToPlayVisible) {
        const rect = howToPlaySection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
          setIsHowToPlayVisible(true);
        }
      }
    };

    // Add scroll listener as fallback
    window.addEventListener("scroll", handleScroll);

    setTimeout(() => {
      const featuresSection = document.getElementById("features-section");
      const howToPlaySection = document.getElementById("how-to-play");

      if (featuresSection) {
        observer.observe(featuresSection);
      }
      if (howToPlaySection) {
        observer.observe(howToPlaySection);
      }

      // Also check immediately after ensuring scroll position is correct
      handleScroll();
    }, 300);

    return () => {
      clearInterval(interval);
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-accent/10 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-secondary/10 rounded-full animate-bounce delay-3000"></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-primary/20 rounded-full animate-pulse"></div>
      </div>

      {/* Hero Section */}
      <Hero isHeroVisible={isHeroVisible} router={router} />

      {/* Features Section */}
      <Features isFeaturesVisible={isFeaturesVisible} />

      {/* How to Play Section */}
      <HowToPlay isHowToPlayVisible={isHowToPlayVisible} />

      {/* Testimonials Section */}
      <Testimonials
        currentTestimonial={currentTestimonial}
        setCurrentTestimonial={setCurrentTestimonial}
        setIsHeroVisible={setIsHeroVisible}
      />

      {/* footer */}
      <Footer router={router} />
    </div>
  );
}
