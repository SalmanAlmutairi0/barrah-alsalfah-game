import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function CategoryCardSkeleton() {
  return (
    <div className="relative group animate-pulse">
      <Card className="border-2 border-border transition-all duration-300">
        <CardContent className="p-4 text-center space-y-3">
          {/* Icon placeholder with circular background */}
          <div className="relative">
            <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </div>

          {/* Title & subtitle */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-28 mx-auto" />
            <Skeleton className="h-3 w-32 mx-auto" />
          </div>

          {/* Badges preview */}
          <div className="flex flex-wrap gap-1 justify-center pt-1">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
