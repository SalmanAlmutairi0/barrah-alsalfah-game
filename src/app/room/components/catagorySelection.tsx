"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import CatagoryList from "@/components/catagoryList";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";

export default function CatagorySelection() {
  const { playerInfo } = usePlayerInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              اختر نوع التصنيف
            </CardTitle>
            <CardDescription className="text-lg">
              اختر تصنيف الكلمات الذي تريد اللعب به
            </CardDescription>
          </CardHeader>
        </Card>

        <CatagoryList />

        {playerInfo.isHost && (
          <div className="flex justify-center">
            <Button className="max-w-2xl w-full cursor-pointer h-12 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-200 transform hover:scale-105 disabled:transform-none">
              بدء اللعبة
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
