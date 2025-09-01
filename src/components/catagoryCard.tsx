"use client";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Category, updateSelectedCategory } from "@/actions/catagory";
import { useRoom } from "@/hooks/useRoom";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { Loader2, Check, Lock } from "lucide-react";
import { toast } from "sonner";

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
  const { playerInfo, savePlayerInfo } = usePlayerInfo();
  const [loading, setLoading] = useState(false);

  const isSelected =
    room?.selected_catagory === category.id || selectedCategory === category.id;
  const canSelect = playerInfo.isHost && !loading;

  const handleCategorySelect = async (categoryID: number) => {
    if (!playerInfo.isHost) {
      toast.info("المضيف فقط يمكنه اختيار التصنيف", {
        action: {
          label: "إغلاق",
          onClick: () => toast.dismiss(),
        },
        duration: 3000,
      });
      return;
    }

    if (room?.selected_catagory === categoryID) {
      toast.info("التصنيف محدد بالفعل", {
        action: {
          label: "إغلاق",
          onClick: () => toast.dismiss(),
        },
        duration: 3000,
      });
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
        savePlayerInfo({
          ...playerInfo,
          selectedCatagory: selectedCategoryID.selected_catagory,
        });
        toast.success("تم تحديث التصنيف بنجاح");
      } else {
        console.error("Room ID is undefined. Cannot update category.");
        toast.error("خطأ في معرف الغرفة");
      }
    } catch (error) {
      console.error("Error selecting category:", error);
      toast.error("حدث خطأ", {
        description: "حصل خطأ أثناء تحديث التصنيف. حاول مرة أخرى.",
        action: {
          label: "إغلاق",
          onClick: () => toast.dismiss(),
        },
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group">
      <Card
        onClick={() => canSelect && handleCategorySelect(category.id)}
        className={`
          relative overflow-hidden border-2 transition-all duration-300 ease-in-out
          ${canSelect ? "cursor-pointer" : "cursor-not-allowed"}
          ${
            isSelected
              ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
              : "border-border hover:border-primary/40"
          }
          ${
            canSelect && !isSelected ? "hover:scale-[1.02] hover:shadow-md" : ""
          }
          ${!playerInfo.isHost ? "opacity-75" : ""}
        `}
      >
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-primary text-primary-foreground rounded-full p-1">
              <Check className="h-4 w-4" />
            </div>
          </div>
        )}

        {/* Lock indicator for non-hosts */}
        {!playerInfo.isHost && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-muted text-muted-foreground rounded-full p-1">
              <Lock className="h-3 w-3" />
            </div>
          </div>
        )}

        <CardContent className="p-4 text-center space-y-3">
          {/* Icon with background circle */}
          <div className="relative">
            <div
              className={`
              w-12 h-12 mx-auto rounded-full flex items-center justify-center text-2xl
              ${
                isSelected
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }
              transition-colors duration-300
            `}
            >
              {category.icon}
            </div>
          </div>

          {/* Category info */}
          <div className="space-y-1">
            <h3
              className={`
              text-base font-bold transition-colors duration-300
              ${isSelected ? "text-primary" : "text-foreground"}
            `}
            >
              {category.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {category.words.length} كلمة متاحة
            </p>
          </div>

          {/* Word preview badges */}
          <div className="flex flex-wrap gap-1 justify-center pt-1">
            {category.words.slice(0, 2).map((word, index) => (
              <Badge
                key={index}
                variant={isSelected ? "default" : "secondary"}
                className="text-xs px-1.5 py-0.5 font-medium"
              >
                {word.word}
              </Badge>
            ))}
            {category.words.length > 2 && (
              <Badge
                variant="outline"
                className="text-xs px-1.5 py-0.5 font-medium"
              >
                +{category.words.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="bg-card border rounded-full p-3 shadow-lg">
              <Loader2 className="animate-spin h-6 w-6 text-primary" />
            </div>
          </div>
        )}
      </Card>

      {/* Glow effect for selected card */}
      {isSelected && (
        <div className="absolute inset-0 -z-10 bg-primary/20 rounded-lg blur-xl scale-105 opacity-50" />
      )}
    </div>
  );
}
