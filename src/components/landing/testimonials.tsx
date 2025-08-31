import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

type TestimonialsProps = {
  currentTestimonial: number;
  setCurrentTestimonial: (index: number) => void;
  setIsHeroVisible: (visible: boolean) => void;
};

export const testimonials = [
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
export default function Testimonials({
  currentTestimonial,
  setCurrentTestimonial,
  setIsHeroVisible,
}: TestimonialsProps) {
  return (
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
                  <span className="font-semibold">- {testimonial.author}</span>
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
  );
}
