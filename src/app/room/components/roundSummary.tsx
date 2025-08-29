"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Trophy, Medal, Award, Users, Target } from "lucide-react";

// Dummy data structure for leaderboard
type LeaderboardPlayer = {
  id: number;
  name: string;
  score: number;
  isEliminated: boolean;
  wasTarget: boolean;
  votesReceived: number;
  role: "innocent" | "outsider";
};

// Example scenarios - you can switch between them to test different outcomes

// Scenario 1: Outsider was caught (gets 0 points, eliminated)
const scenarioOutsiderCaught: LeaderboardPlayer[] = [
  {
    id: 1,
    name: "أحمد",
    score: 150,
    isEliminated: false,
    wasTarget: false,
    votesReceived: 1,
    role: "innocent",
  },
  {
    id: 2,
    name: "فاطمة",
    score: 0, // Outsider caught = 0 points
    isEliminated: true,
    wasTarget: true,
    votesReceived: 4,
    role: "outsider",
  },
  {
    id: 3,
    name: "محمد",
    score: 120,
    isEliminated: false,
    wasTarget: false,
    votesReceived: 0,
    role: "innocent",
  },
  {
    id: 4,
    name: "زينب",
    score: 100,
    isEliminated: false,
    wasTarget: false,
    votesReceived: 2,
    role: "innocent",
  },
  {
    id: 5,
    name: "عبدالله",
    score: 80,
    isEliminated: false,
    wasTarget: false,
    votesReceived: 1,
    role: "innocent",
  },
];

// Scenario 2: Innocent was eliminated (outsider gets bonus points, survives)
const scenarioInnocentEliminated: LeaderboardPlayer[] = [
  {
    id: 2,
    name: "فاطمة",
    score: 180, // Outsider survived = bonus points!
    isEliminated: false,
    wasTarget: false,
    votesReceived: 1,
    role: "outsider", // The outsider got away with it!
  },
  {
    id: 1,
    name: "أحمد",
    score: 130,
    isEliminated: false,
    wasTarget: false,
    votesReceived: 0,
    role: "innocent",
  },
  {
    id: 4,
    name: "زينب",
    score: 110,
    isEliminated: false,
    wasTarget: false,
    votesReceived: 2,
    role: "innocent",
  },
  {
    id: 3,
    name: "محمد",
    score: 90,
    isEliminated: true,
    wasTarget: true,
    votesReceived: 4,
    role: "innocent", // Wrong target - innocent eliminated
  },
  {
    id: 5,
    name: "عبدالله",
    score: 70,
    isEliminated: false,
    wasTarget: false,
    votesReceived: 1,
    role: "innocent",
  },
];

// Scenario 3: Tie vote - no elimination (outsider gets bonus points for surviving)
const scenarioNoElimination: LeaderboardPlayer[] = [
  {
    id: 2,
    name: "فاطمة",
    score: 160, // Outsider survived tie = bonus points!
    isEliminated: false,
    wasTarget: false,
    votesReceived: 2,
    role: "outsider",
  },
  {
    id: 1,
    name: "أحمد",
    score: 120,
    isEliminated: false,
    wasTarget: false,
    votesReceived: 2,
    role: "innocent",
  },
  {
    id: 3,
    name: "محمد",
    score: 100,
    isEliminated: false,
    wasTarget: false,
    votesReceived: 2,
    role: "innocent",
  },
  {
    id: 4,
    name: "زينب",
    score: 80,
    isEliminated: false,
    wasTarget: false,
    votesReceived: 0,
    role: "innocent",
  },
];

// Choose which scenario to display (change this to test different outcomes)
const dummyLeaderboardData = scenarioInnocentEliminated; // <-- Change this to test different scenarios

export default function RoundSummary() {
  // Sort players by score (highest first)
  const sortedPlayers = [...dummyLeaderboardData].sort(
    (a, b) => b.score - a.score
  );

  // Find the eliminated player and determine round outcome
  const eliminatedPlayer = sortedPlayers.find((p) => p.isEliminated);
  const outsiderCaught = eliminatedPlayer?.role === "outsider";
  const innocentEliminated = eliminatedPlayer?.role === "innocent";
  const noElimination = !eliminatedPlayer;
  const outsider = sortedPlayers.find((p) => p.role === "outsider");
  const outsiderSurvived = outsider && !outsider.isEliminated;

  // Scoring analysis - outsider gets bonus points when they survive, 0 when caught
  const outsiderGotBonusPoints = outsiderSurvived;
  const outsiderGotZeroPoints = outsiderCaught;

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">
            {position}
          </div>
        );
    }
  };

  const getRankBadgeVariant = (position: number) => {
    switch (position) {
      case 1:
        return "default";
      case 2:
        return "secondary";
      case 3:
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Round Result Header */}
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-8 h-8 text-primary" />
              <CardTitle className="text-3xl font-bold text-primary">
                نتائج الجولة
              </CardTitle>
            </div>
            <CardDescription className="text-lg">
              {outsiderGotZeroPoints ? (
                <div className="text-green-600 font-semibold">
                  <Target className="w-5 h-5 inline mr-2" />
                  تم القبض على برا السالفة! حصل على 0 نقاط
                </div>
              ) : outsiderGotBonusPoints ? (
                <div className="text-amber-600 font-semibold">
                  <Users className="w-5 h-5 inline mr-2" />
                  برا السالفة نجا! حصل على نقاط إضافية
                </div>
              ) : (
                <div className="text-blue-600 font-semibold">
                  <Trophy className="w-5 h-5 inline mr-2" />
                  انتهت الجولة - تحديث النقاط
                </div>
              )}
            </CardDescription>
            {eliminatedPlayer && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  تم إقصاء:{" "}
                  <span className="font-semibold text-foreground">
                    {eliminatedPlayer.name}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  الدور:{" "}
                  {eliminatedPlayer.role === "outsider"
                    ? "برا السالفة"
                    : "بريء"}
                </p>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Leaderboard */}
        <Card className="border-2 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-accent" />
              جدول النقاط
            </CardTitle>
            <CardDescription>ترتيب اللاعبين حسب النقاط المحققة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedPlayers.map((player, index) => {
              const position = index + 1;
              return (
                <div
                  key={player.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    position === 1
                      ? "border-primary bg-primary/10 shadow-md"
                      : position <= 3
                      ? "border-accent/50 bg-accent/5"
                      : "border-border bg-muted/30"
                  } ${player.isEliminated ? "opacity-75" : ""}`}
                >
                  <div className="flex flex-row-reverse items-center justify-between">
                    {/* Player Info */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">
                            {player.name}
                          </span>
                          {player.isEliminated && (
                            <Badge variant="destructive" className="text-xs">
                              مقصي
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {player.votesReceived} أصوات
                          </span>
                          {player.role === "outsider" &&
                            player.isEliminated && (
                              <Badge variant="destructive" className="text-xs">
                                برا السالفة
                              </Badge>
                            )}
                          {player.role === "outsider" &&
                            !player.isEliminated && (
                              <Badge
                                variant="outline"
                                className="text-xs opacity-50"
                              >
                                
                              </Badge>
                            )}
                        </div>
                      </div>

                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Rank and Score */}
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <div
                          className={`text-2xl font-bold ${
                            player.role === "outsider" &&
                            outsiderGotBonusPoints &&
                            !player.isEliminated
                              ? "text-amber-600"
                              : player.role === "outsider" &&
                                outsiderGotZeroPoints
                              ? "text-red-600"
                              : "text-primary"
                          }`}
                        >
                          {player.score}
                          {player.role === "outsider" &&
                            outsiderGotBonusPoints &&
                            !player.isEliminated && (
                              <span className="text-sm ml-1">🎭</span>
                            )}
                          {player.role === "outsider" &&
                            outsiderGotZeroPoints && (
                              <span className="text-sm ml-1">😞</span>
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          نقطة
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant={getRankBadgeVariant(position)}>
                          #{position}
                        </Badge>
                        {getRankIcon(position)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-3">
              {/* Game always continues - focus on scoring and performance */}
              <Button
                className="w-full h-12 text-lg font-semibold"
                variant="default"
              >
                <Target className="w-5 h-5 mr-2" />
                الجولة التالية
              </Button>

              {/* Show scoring insights
              <div className="p-3 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg">
                <p className="text-sm text-foreground text-center font-medium">
                  {outsiderGotZeroPoints
                    ? "👏 أحسنتم! تم القبض على برا السالفة"
                    : outsiderGotBonusPoints
                    ? "🎭 برا السالفة خدعكم وحصل على نقاط إضافية!"
                    : "📊 تم تحديث نقاط جميع اللاعبين"}
                </p>
                {outsiderGotBonusPoints && (
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    حاولوا أكثر في الجولة القادمة!
                  </p>
                )}
              </div> */}

              {/* <Button
                className="w-full h-12 text-lg font-semibold"
                variant="outline"
              >
                <Users className="w-5 h-5 mr-2" />
                العودة لغرفة الانتظار
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
