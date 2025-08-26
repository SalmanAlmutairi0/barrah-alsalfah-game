"use client";
import { useEffect, useState } from "react";
import CatagoryCard from "./catagoryCard";
import { Category, getCategories } from "@/actions/catagory";
import CategoryCardSkeleton from "./catagoryCardSkeleton";

export default function CatagoryList() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const categories = async () => {
      console.log("getting the categories");

      try {
        setLoading(true);

        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    categories();
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

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category: Category) => (
        <CatagoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
