import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function RoundResultHeader() {
  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
            نتائج الجولة
          </CardTitle>
        </div>
        <CardDescription className="text-base sm:text-lg">
          <div className="text-blue-600 font-semibold">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
            انتهت الجولة - تحديث النقاط
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
