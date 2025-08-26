import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Category } from "@/actions/catagory";

type Props = {
  category: Category;
};

export default function CatagoryCard({ category }: Props) {
  const handleCategorySelect = (key: number) => {
    console.log("Selected category:", key);
    // later: update room category in Supabase here
  };
  return (
    <Card
      className="border-2 border-muted hover:border-primary/50 transition-all duration-200 cursor-pointer transform hover:scale-105 hover:shadow-lg"
      onClick={() => handleCategorySelect(category.id)}
    >
      <CardContent className="p-6 text-center space-y-4">
        <div className="text-4xl">{category.icon}</div>
        <div>
          <h3 className="text-xl font-bold text-foreground">{category.name}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {category.words.length} كلمات متاحة
          </p>
        </div>

        <div className="flex flex-wrap gap-1 justify-center">
          {category.words.slice(0, 3).map((word, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {word.word}
            </Badge>
          ))}

          {category.words.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{category.words.length - 3} اكثر
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
