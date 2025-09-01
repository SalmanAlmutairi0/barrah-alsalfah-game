"use client";
import React, { useState, useEffect, useRef } from "react";
import Hero from "./landing/hero";
import Features from "./landing/features";
import HowToPlay from "./landing/howToPlay";
import Testimonials, { testimonials } from "./landing/testimonials";
import Footer from "./landing/footer";

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const [isHowToPlayVisible, setIsHowToPlayVisible] = useState(false);

  // Use refs to avoid stale closures in event handlers
  const isFeaturesVisibleRef = useRef(false);
  const isHowToPlayVisibleRef = useRef(false);

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
            if (
              entry.target.id === "features-section" &&
              !isFeaturesVisibleRef.current
            ) {
              isFeaturesVisibleRef.current = true;
              setIsFeaturesVisible(true);
            } else if (
              entry.target.id === "how-to-play" &&
              !isHowToPlayVisibleRef.current
            ) {
              isHowToPlayVisibleRef.current = true;
              setIsHowToPlayVisible(true);
            }
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: "0px 0px -200px 0px", // Only trigger when element is actually entering viewport
      }
    );

    // Observe sections after a short delay to ensure they're rendered
    // Fallback scroll listener
    const handleScroll = () => {
      const featuresSection = document.getElementById("features-section");
      const howToPlaySection = document.getElementById("how-to-play");

      if (featuresSection && !isFeaturesVisibleRef.current) {
        const rect = featuresSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        // Only trigger when at least 30% of the section is visible and it's properly in the viewport
        const visibleHeight =
          Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        const sectionHeight = rect.height;
        const visibilityRatio = Math.max(0, visibleHeight) / sectionHeight;

        if (visibilityRatio >= 0.3 && rect.top < viewportHeight - 200) {
          isFeaturesVisibleRef.current = true;
          setIsFeaturesVisible(true);
        }
      }

      if (howToPlaySection && !isHowToPlayVisibleRef.current) {
        const rect = howToPlaySection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        // Only trigger when at least 30% of the section is visible and it's properly in the viewport
        const visibleHeight =
          Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        const sectionHeight = rect.height;
        const visibilityRatio = Math.max(0, visibleHeight) / sectionHeight;

        if (visibilityRatio >= 0.3 && rect.top < viewportHeight - 200) {
          isHowToPlayVisibleRef.current = true;
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

      // Only check scroll if user has actually scrolled from the top
      if (window.scrollY > 100) {
        handleScroll();
      }
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
      <Hero isHeroVisible={isHeroVisible} />

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
      <Footer />
    </div>
  );
}
