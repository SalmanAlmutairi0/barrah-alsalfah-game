import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function RoleRevealedView({
  isImposter,
  secretWord,
  isHost,
}: {
  isImposter: boolean;
  secretWord: string;
  isHost?: boolean;
}) {
  return (
    <div className="text-center space-y-6 animate-in fade-in duration-500">
      {/* Circle icon */}
      <div
        className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
          isImposter
            ? "bg-gradient-to-br from-destructive to-red-600"
            : "bg-gradient-to-br from-primary to-accent"
        }`}
      >
        {isImposter ? (
          <EyeOff className="w-12 h-12 text-destructive-foreground" />
        ) : (
          <Eye className="w-12 h-12 text-primary-foreground" />
        )}
      </div>

      {/* Badge */}
      <Badge
        variant={isImposter ? "destructive" : "default"}
        className={`text-lg px-4 py-2 ${
          isImposter
            ? "bg-destructive text-destructive-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {isImposter ? "برى السالفة" : "داخل السالفة"}
      </Badge>

      {/* Instructions */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
        {isImposter ? (
          <>
            <p className="font-semibold text-destructive">مهمتك:</p>
            <p className="text-sm text-muted-foreground">
              أنت لا تعرف الكلمة السرية. استمع جيدًا للآخرين وحاول أن تندمج
              بينهم. تجنب أن يتم اكتشافك!
            </p>
          </>
        ) : (
          <>
            <p className="font-semibold text-primary">الكلمة السرية:</p>
            <p className="text-2xl font-bold text-center py-2 px-4 bg-primary/10 rounded-lg border-2 border-primary/20">
              {secretWord}
            </p>
            <p className="text-sm text-muted-foreground">
              ناقش هذه الكلمة مع الآخرين بدون ماتوضح. وحاول تكشف مين برى السالفة
              بينهم!
            </p>
          </>
        )}
      </div>

      {isHost && (
        <Button className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-200">
          الاستمرار إلى اللعبة
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      )}
    </div>
  );
}
