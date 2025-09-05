"use client";
import { useEffect, useState } from "react";
import CatagoryCard from "./catagoryCard";
import { Category, getCategories } from "@/actions/catagory";
import CategoryCardSkeleton from "./catagoryCardSkeleton";
import { toast } from "sonner";

type Props = {
  selectedCategory: number;
  setSelectedCategory: (category: number) => void;
};

export default function CatagoryList({ selectedCategory, setSelectedCategory }: Props) {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data as Category[]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("حدث خطاء", {
          description: "حصل خطأ أثناء جلب التصنيفات. حاول مرة أخرى.",
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

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <CategoryCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full border-2 border-primary/20 p-2 rounded-lg shadow-lg bg-gradient-to-br from-background via-card to-muted max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <CatagoryCard
            key={category.id}
            category={category}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        ))}
      </div>
    </div>
  );
}
