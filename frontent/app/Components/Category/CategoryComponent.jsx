"use client";

import { fetchCategories } from "@/app/redux/slices/categorySlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const CategoryComponent = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { items, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchCategories());
    }
  }, []);

  if (loading) {
    // Skeleton Loader
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 p-4">
        {[...Array(21)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center p-3 border rounded-lg shadow-sm"
          >
            <div className="w-20 h-20 bg-gray-200 rounded animate-pulse" />
            <div className="mt-2 w-16 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-7">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 p-2">
        {items.map((cat) => (
          <div
            key={cat._id}
            onClick={() => router.push(`/category/${cat.slug}`)} // navigate to dynamic category page
            className="flex flex-col items-center p-3 border rounded-lg shadow-sm hover:shadow-lg cursor-pointer transition"
          >
            <img
              src="/categories/c1.avif"
              alt={cat.name}
              className="w-24 h-20 object-contain"
            />
            <p className="mt-2 text-center text-[12px] tracking-[1px] font-semibold">
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryComponent;
