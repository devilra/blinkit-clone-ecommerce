"use client";

import { fetchProducts } from "@/app/redux/slices/productSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Product Card component (memoized)

const ProductCard = memo(({ product, onAddToCart, adding }) => {
  return (
    <Card className="flex flex-col justify-between p-3">
      <CardHeader className="p-0 mb-2">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-40 object-contain rounded"
        />
      </CardHeader>
      <CardContent className="p-0">
        <h2 className="font-medium text-gray-800">{product.name}</h2>
        <p className="text-sm text-gray-600 mt-1">₹{product.price}</p>
      </CardContent>
      <CardFooter className="p-0 mt-2">
        <Button
          className="w-full"
          //onClick={() => onAddToCart(product)} disabled={adding}
        >
          {adding ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
});

const CategoryProductsPage = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { items, loading } = useSelector((state) => state.products);
  const [addingToCartId, setAddingToCartId] = useState(null);

  console.log(items);

  useEffect(() => {
    dispatch(fetchProducts({ category: slug }));
  }, [slug, dispatch]);

  return (
    <div className="p-6 md:mt-28">
      {loading ? (
        <Skeleton className="max-w-md h-20 mb-2 rounded" />
      ) : (
        <h1 className="text-xl font-bold mb-4">
          Products for {items[0]?.category?.name || slug}
        </h1>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="p-3">
              <Skeleton className="w-full h-40 mb-2 rounded" />
              <Skeleton className="h-4 w-3/4 mb-1 rounded" />
              <Skeleton className="h-4 w-1/2 mb-2 rounded" />
              <Skeleton className="h-8 w-full rounded" />
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center md:text-3xl text-lg font-medium  p-4  ">
          No products found for{" "}
          <span className="font-semibold text-gray-700">
            {items[0]?.category?.name || slug}
          </span>
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((product) => (
            // <Card
            //   key={product._id}
            //   className="flex flex-col justify-between  p-3"
            // >
            //   <CardHeader className="p-0 mb-2">
            //     <img
            //       src={product.image}
            //       alt={product.name}
            //       className="w-full h-40 object-cover rounded"
            //     />
            //   </CardHeader>
            //   <CardContent className="p-0">
            //     <h2 className="font-medium text-gray-800">{product.name}</h2>
            //     <p className="text-sm text-gray-600 mt-1">₹{product.price}</p>
            //   </CardContent>
            //   <CardFooter className="p-0 mt-2">
            //     <Button className="w-full">Add to Cart</Button>
            //   </CardFooter>
            // </Card>
            <ProductCard
              key={product._id}
              product={product}
              adding={addingToCartId === product._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProductsPage;
