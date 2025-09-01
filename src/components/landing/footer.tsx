import { Button } from '../ui/button';
import { Play } from 'lucide-react';
import { useRouter } from 'next/navigation';



export default function Footer() {
  const router = useRouter();
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">خلاص! وش تنتظر؟</h2>
        <p className="text-xl mb-8">جمع اخوياك واستعد لأمتع سهرة في حياتك! 🎉</p>
        <Button
          size="lg"
          variant="secondary"
          className="text-xl px-12 py-6 h-auto hover:scale-102 transition-transform duration-150 shadow-2xl"
          onClick={() => router.push("/join")}
        >
          <Play className="w-8 h-8 mr-3" />
          ابدأ العب الآن!
        </Button>
      </div>
    </section>
  );
}
