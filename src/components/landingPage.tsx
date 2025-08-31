"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Crown,
  Zap,
  Heart,
  MessageCircle,
  Trophy,
  ArrowDown,
  Play,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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

  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "خش بالسالفة ",
      description: "اكتشف مين برا السالفة بينكم! لعبة ممتعة مع اخوياك والعائلة",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "خلك بالصدارة",
      description: "اجمع نقاط واطلع فوق الكل في جدول المتصدرين",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "سريع ومجاني",
      description: "ما يحتاج تحميل! افتح واتحدى اخوياك على طول",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "للجميع",
      description: "مناسبة للكبير والصغير، جمعة العائلة ولمة الاصحاب",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const testimonials = [
    {
      text: "والله لعبة حلوة! قضينا سهرة زينة مع الربع 😂",
      author: "أبو فهد",
      rating: 5,
    },
    {
      text: "العيال ما فكوا منها! صارت روتين كل جمعة عندنا",
      author: "أم سارة",
      rating: 5,
    },
    {
      text: "حماس وضحك من أول جولة، ننصح فيها بقوة 🔥",
      author: "محمد",
      rating: 5,
    },
  ];

  const howToPlay = [
    {
      step: "1",
      text: "سو غرفة وشارك الكود مع الي معك",
      icon: <Users className="w-6 h-6" />,
    },
    {
      step: "2",
      text: "اختار تصنيف الكلمات ",
      icon: <MessageCircle className="w-6 h-6" />,
    },
    {
      step: "3",
      text: "الي برا السالفة ما يعرف الكلمة ويحاول يخفي نفسه",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      step: "4",
      text: "ناقشوا وصوتوا واكتشفوا مين برا السالفة!",
      icon: <Crown className="w-6 h-6" />,
    },
  ];

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
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div
          className={cn(
            "max-w-4xl mx-auto text-center space-y-8 transition-all duration-1000",
            isHeroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          )}
        >
          {/* Main Title */}
          <div className="space-y-4">
            <div className="relative">
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-in slide-in-from-bottom-5 duration-1000 p-2">
                برا السالفة
              </h1>
              <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-yellow-500 animate-spin" />
              <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-pink-500 animate-pulse delay-1000" />
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground animate-in slide-in-from-bottom-7 duration-1000 delay-300">
              لعبة الكشف عن مين برا السالفة الرهيبة! 🕵️‍♂️
            </p>
            <p className="text-lg md:text-xl text-muted-foreground animate-in slide-in-from-bottom-9 duration-1000 delay-500">
              اجمع اخوياك او العائلة واكتشف مين برا السالفة بينكم في أجواء
              مليانة ضحك وحماس
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-700",
              isHeroVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
          >
            <Button
              size="lg"
              className="text-xl px-8 py-4 h-auto bg-gradient-to-r from-primary to-accent hover:scale-102 transition-transform duration-75 shadow-2xl"
              onClick={() => router.push("/join")}
            >
              <Play className="w-6 h-6 mr-2" />
              يلا نلعب!
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-xl px-8 py-4 h-auto border-2 hover:scale-102 transition-transform duration-75"
              onClick={() =>
                document
                  .getElementById("how-to-play")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <MessageCircle className="w-6 h-6 mr-2" />
              كيف نلعب؟
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2
            className={cn(
              "text-4xl md:text-5xl font-bold text-center mb-4 p-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-1000",
              isFeaturesVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            )}
          >
            ليش برا السالفة؟
          </h2>
          <p
            className={cn(
              "text-xl text-center text-muted-foreground mb-16 transition-all duration-1000 delay-300",
              isFeaturesVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            )}
          >
            لأنها مو مجرد لعبة... هي تجربة!
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={cn(
                  "group relative overflow-hidden border-2 hover:border-primary/50 hover:shadow-2xl",
                  isFeaturesVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10",
                  ""
                )}
                style={{
                  transition:
                    "transform 150ms ease-out, border-color 150ms ease-out, box-shadow 150ms ease-out, opacity 1000ms ease-out, translate 1000ms ease-out",
                  transitionDelay: isFeaturesVisible
                    ? `${600 + index * 200}ms`
                    : "0ms",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div
                    className={cn(
                      "w-16 h-16 mx-auto rounded-full bg-gradient-to-r flex items-center justify-center text-white",
                      "group-hover:scale-105 transition-transform duration-300",
                      feature.color
                    )}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section
        id="how-to-play"
        className="py-20 px-4 bg-gradient-to-r from-primary/5 to-accent/5"
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className={cn(
              "text-4xl md:text-5xl font-bold text-center mb-4 p-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-1000",
              isHowToPlayVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            )}
          >
            كيف نلعب؟
          </h2>
          <p
            className={cn(
              "text-xl text-center text-muted-foreground mb-16 transition-all duration-1000 delay-300",
              isHowToPlayVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            )}
          >
            سهلة وبسيطة... 4 خطوات وتبدأ المتعة!
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {howToPlay.map((step, index) => (
              <Card
                key={index}
                className={cn(
                  "group relative overflow-hidden border-2 hover:border-accent/50",
                  isHowToPlayVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                )}
                style={{
                  transition:
                    "transform 150ms ease-out, border-color 150ms ease-out, box-shadow 150ms ease-out, opacity 1000ms ease-out, translate 1000ms ease-out",
                  transitionDelay: isHowToPlayVisible
                    ? `${600 + index * 300}ms`
                    : "0ms",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform duration-300">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-medium">{step.text}</p>
                    </div>
                    <div className="text-accent group-hover:scale-105 transition-transform duration-300">
                      {step.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 p-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            إيش يقولون عنا؟
          </h2>
          <p className="text-xl text-muted-foreground mb-16">
            شوف تجارب اللي جربوا اللعبة
          </p>

          <div className="relative h-40 flex items-center justify-center">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={cn(
                  "absolute w-full transition-all duration-500 border-2",
                  currentTestimonial === index
                    ? "opacity-100 scale-100 border-primary/50"
                    : "opacity-0 scale-95 border-transparent"
                )}
              >
                <CardContent className="p-8 text-center">
                  <p className="text-lg mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-semibold">
                      - {testimonial.author}
                    </span>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Trophy
                          key={i}
                          className="w-4 h-4 text-yellow-500 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Testimonial Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  currentTestimonial === index
                    ? "bg-primary scale-125"
                    : "bg-muted-foreground/30"
                )}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            خلاص! وش تنتظر؟
          </h2>
          <p className="text-xl mb-8">
            جمع الربع واستعد لأمتع سهرة في حياتك! 🎉
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-2xl px-12 py-6 h-auto hover:scale-102 transition-transform duration-75 shadow-2xl"
            onClick={() => router.push("/join")}
          >
            <Play className="w-8 h-8 mr-3" />
            ابدأ اللعب حالاً!
          </Button>
        </div>
      </section>
    </div>
  );
}
