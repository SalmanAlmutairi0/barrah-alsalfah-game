"use client";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Category, updateSelectedCategory } from "@/actions/catagory";
import { useRoom } from "@/hooks/useRoom";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { Loader2 } from "lucide-react";

type Props = {
  category: Category;
  selectedCategory: number | null;
  setSelectedCategory: (id: number) => void;
};

export default function CatagoryCard({
  category,
  selectedCategory,
  setSelectedCategory,
}: Props) {
  const { room } = useRoom();
  const { playerInfo } = usePlayerInfo();
  const [loading, setLoading] = useState(false);

  const handleCategorySelect = async (categoryID: number) => {
    if (!playerInfo.isHost) {
      console.log("Only the host can select a category");
      return;
    }

    // if the category is already selected, do nothing
    if (room?.selected_catagory == categoryID) {
      console.log("Category already selected:", categoryID);
      return;
    }

    setLoading(true);

    try {
      if (room?.id !== undefined) {
        const selectedCategoryID = await updateSelectedCategory(
          room.id,
          categoryID
        );
        setSelectedCategory(selectedCategoryID.selected_catagory);
      } else {
        console.error("Room ID is undefined. Cannot update category.");
      }
    } catch (error) {
      console.error("Error selecting category:", error);
      throw new Error("Failed to select category.");
    }finally {
      setLoading(false);
    }
  };

  return (
    <Card
      onClick={() => handleCategorySelect(category.id)}
      className={`border-2 border-muted transition-all duration-200  transform p-0 ${
        playerInfo.isHost
          ? "hover:scale-105 hover:shadow-lg hover:border-primary/50 cursor-pointer"
          : ""
      } ${
        room?.selected_catagory == category.id ||
        selectedCategory == category.id
          ? "border-primary hover:scale-100 hover:border-primary/100"
          : ""
      }`}
    >
      <CardContent className="p-6 text-center space-y-4 relative">
      
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


        {loading && (
          <div className="absolute inset-0 bg-primary/30 flex items-center justify-center rounded-lg p-1 ">
            <Loader2 className="animate-spin h-6 w-6 text-primary" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
