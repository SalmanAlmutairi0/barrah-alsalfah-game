import { cn } from "@/lib/utils";
import { Crown, MessageCircle, Users, Zap } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../ui/card";

type HowToPlayProps = {
  isHowToPlayVisible: boolean;
};

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

export default function HowToPlay({ isHowToPlayVisible }: HowToPlayProps) {
  return (
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
                  "transform 150ms ease-out, border-color 150ms ease-out, box-shadow 150ms ease-out, opacity 500ms ease-out, translate 500ms ease-out",
                transitionDelay: isHowToPlayVisible
                  ? `${300 + index * 100}ms`
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
  );
}
