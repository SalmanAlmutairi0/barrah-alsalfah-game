import React from "react";
import { Skeleton } from "./ui/skeleton";

export default function PlayerCardSkeleton() {
  return (
    <div className="flex items-center justify-between  p-3 rounded-lg  border border-border">
      <div className="flex items-center gap-3">
        {/* Player initial circle */}
        <Skeleton className="w-[30px] h-[30px] rounded-full bg-gray-200" />

        {/* Player name */}
        <Skeleton className="w-[300px] h-[20px] bg-gray-200" />
      </div>

      {/* Right-side action (badge or button) */}
      <Skeleton className="h-7 rounded-md gap-1.5 px-4 bg-gray-200" />
    </div>
  );
}
