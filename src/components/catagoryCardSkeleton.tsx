import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function CategoryCardSkeleton() {
  return (
    <Card className="border-2 border-muted transition-all duration-200">
      <CardContent className="p-6 text-center space-y-4">
        {/* Icon placeholder */}
        <div className="flex justify-center">
          <Skeleton className="h-12 w-12 rounded-full bg-gray-200 " />
        </div>

        {/* Title & subtitle */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-32 mx-auto bg-gray-200" />
          <Skeleton className="h-4 w-40 mx-auto bg-gray-200" />
        </div>

        {/* Badges preview */}
        <div className="flex flex-wrap gap-1 justify-center mt-2">
          <Skeleton className="h-6 w-12 rounded-md bg-gray-200" />
          <Skeleton className="h-6 w-14 rounded-md bg-gray-200" />
          <Skeleton className="h-6 w-10 rounded-md bg-gray-200" />
          <Skeleton className="h-6 w-8 rounded-md bg-gray-200" />
        </div>
      </CardContent>
    </Card>
  );
}
