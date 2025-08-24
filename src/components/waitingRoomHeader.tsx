import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Users } from "lucide-react";

export default function WaitingRoomHeader() {
  return (
    <div className="w-full mx-auto space-y-6">
      <Card className=" border-2 border-primary/20 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">
              رقم الغرفة 2323
            </CardTitle>
          </div>
          <CardDescription> في انتظار الاعبين (2/5)</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
