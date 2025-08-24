import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Plus, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4">
      
      <Card className="w-full max-w-md shadow-xl border-2 border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            برى السالفة
          </CardTitle>
          <CardDescription className="text-lg">
            لعبة برى السالفة اونلاين
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="playerName" className="text-sm font-medium">
              اسمك :
            </Label>
            <Input
              id="playerName"
              placeholder="ادخل اسمك"
              className="border-2 focus:border-primary"
            />
          </div>

          <div className="grid gap-3">
            <Button
              className="h-12 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              انشاء غرفة 
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  او
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Input
                placeholder="ادخل رمز الغرفة"
                className="border-2 focus:border-accent text-center font-mono text-lg"
              />
              <Button
                variant="outline"
                className="w-full h-12 text-lg font-semibold border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-200 bg-transparent"
              >
                <LogIn className="w-5 h-5 mr-2" />
                انضمام للغرفة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
