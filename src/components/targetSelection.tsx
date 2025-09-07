import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { MessageCircle, Clock, Users, ArrowLeft } from "lucide-react";

export default function TargetSelection() {
  // Mock data - replace with real data from your context/hooks
  const currentTurn = {
    asker: "أحمد",
    target: "فاطمة",
    timeLeft: "00:45",
  };

  const interactionHistory = [
    { id: 1, asker: "سارة", target: "محمد", time: "2 دقائق مضت" },
    { id: 2, asker: "خالد", target: "نور", time: "3 دقائق مضت" },
    { id: 3, asker: "ليلى", target: "عمر", time: "5 دقائق مضت" },
    { id: 4, asker: "يوسف", target: "مريم", time: "7 دقائق مضت" },
    { id: 5, asker: "فاطمة", target: "خالد", time: "8 دقائق مضت" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          تتبع الأدوار
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Turn */}
        <div>
          <div className="flex items-center justify-between  p-3 rounded-lg bg-primary/5 mb-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">الدور الحالي</span>
            </div>
            <Badge variant="secondary">
              <Clock className="w-3 h-3 mr-1" />
              {currentTurn.timeLeft}
            </Badge>
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-3" dir="rtl">
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
                  {currentTurn.asker}
                </div>
                <ArrowLeft className="w-5 h-5 text-primary" />
                <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium">
                  {currentTurn.target}
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-2">
                يسأل الآن
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* History */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">تاريخ الأدوار</span>
          </div>

          <ScrollArea className="h-[300px]">
            <div className="space-y-2 pr-2">
              {interactionHistory.map((interaction) => (
                <div
                  key={interaction.id}
                  className="bg-muted/30 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2" dir="rtl">
                      <span className="text-sm font-medium text-primary">
                        {interaction.asker}
                      </span>
                      <ArrowLeft className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm font-medium text-secondary-foreground">
                        {interaction.target}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {interaction.time}
                    </span>
                  </div>
                </div>
              ))}

              {interactionHistory.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">لا توجد أدوار بعد</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
