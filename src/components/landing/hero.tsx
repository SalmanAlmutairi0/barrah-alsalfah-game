import { ArrowDown, MessageCircle, Play, Sparkles } from 'lucide-react';
import React from 'react'
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type HeroProps = {
  isHeroVisible: boolean;
  router: any;
};


export default function Hero({ isHeroVisible, router }: HeroProps) {
  return (
    <section
      className={cn(
        "relative min-h-screen flex items-center justify-center px-4",
        isHeroVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10"
      )}
    >
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
            لعبة الكشف عن مين برا السالفة اونلاين الرهيبة! 🕵️‍♂️
          </p>
          <p className="text-lg md:text-xl text-muted-foreground animate-in slide-in-from-bottom-9 duration-1000 delay-500">
            ارسل لاخوياك او العائلة واكتشف مين برا السالفة بينكم في أجواء مليانة
            ضحك وحماس
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
  );
}
