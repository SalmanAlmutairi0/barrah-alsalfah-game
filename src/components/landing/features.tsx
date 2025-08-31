import { cn } from "@/lib/utils";
import { Crown, Heart, MessageCircle, Zap } from "lucide-react";
import { Card, CardContent } from "../ui/card";

type FeaturesProps = {
  isFeaturesVisible: boolean;
};

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

export default function Features({ isFeaturesVisible }: FeaturesProps) {
  return (
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
                transition: isFeaturesVisible
                  ? "transform 150ms ease-out, border-color 150ms ease-out, box-shadow 150ms ease-out, opacity 40ms ease-out, translate 100ms ease-out"
                  : "transform 150ms ease-out, border-color 150ms ease-out, box-shadow 150ms ease-out",
                transitionDelay: isFeaturesVisible
                  ? `${400 + index * 100}ms`
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
  );
}
