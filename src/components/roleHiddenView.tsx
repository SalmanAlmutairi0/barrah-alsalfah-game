import { Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";

export default function RoleHiddenView({ onReveal }: { onReveal: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center animate-pulse">
        <EyeOff className="w-12 h-12 text-primary-foreground" />
      </div>
      <p className="text-muted-foreground">اضغط أدناه لكشف دورك</p>
      <Button
        onClick={onReveal}
        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-200"
      >
        <Eye className="w-5 h-5 mr-2" />
        كشف الدور
      </Button>
    </div>
  );
}
