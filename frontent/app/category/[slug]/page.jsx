"use client";

import {
  addToCart,
  decreaseQuantity,
  fetchCart,
  increaseQuantity,
} from "@/app/redux/slices/cartSlice";
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
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Btn from "@mui/material/Button";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { Loader2Icon } from "lucide-react";

// Product Card component (memoized)

const ProductCard = memo(
  ({
    product,
    onAddToCart,
    adding,
    cart,
    onIncrease,
    onDecrease,
    incDecLoading,
    load,
  }) => {
    const router = useRouter();

    return (
      <Card className="flex flex-col justify-between cursor-pointer hover:shadow-lg transition  p-3">
        <CardHeader className="p-0 mb-2">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-40 object-contain rounded"
            onClick={() => router.push(`/products/${product._id}`)}
          />
        </CardHeader>
        <CardContent className="p-0">
          <h2 className="font-medium text-gray-800">{product.name}</h2>
          <p className="text-sm text-gray-600 mt-1">₹{product.price}</p>
        </CardContent>
        <CardFooter className="p-0 mt-2">
          {/* <Button
          className="w-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // Card click block pannitu button handle pannum
            onAddToCart(product._id);
          }}
          disabled={adding}
        >
          {adding ? "Adding..." : "Add to Cart"}
        </Button> */}
          {cart ? (
            // If item is in cart → show quantity controls
            <div className="flex items-center justify-between w-full">
              <Btn
                variant="outlined"
                color="error"
                sx={{ padding: "10px 0px" }}
                loading={
                  incDecLoading?.id === product._id &&
                  incDecLoading?.type === "decrease"
                }
                // disabled={
                //   incDecLoading?.id === product._id &&
                //   incDecLoading?.type === "decrease"
                // }
                onClick={(e) => {
                  e.stopPropagation();
                  onDecrease(product._id);
                }}
              >
                <FaMinus />
              </Btn>
              <span className="px-2 font-medium">{cart.quantity}</span>
              <Btn
                variant="outlined"
                color="success"
                sx={{ padding: "10px 0px" }}
                loading={
                  incDecLoading?.id === product._id &&
                  incDecLoading?.type === "increase"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onIncrease(product._id);
                }}
              >
                <FaPlus />
              </Btn>
            </div>
          ) : (
            // If item not in cart → show add button
            <Button
              className="w-full cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product._id);
              }}
            >
              "Add to Cart"
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }
);

const CategoryProductsPage = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { items, loading, productLoading } = useSelector(
    (state) => state.products
  );
  const [addingToCartId, setAddingToCartId] = useState(null);
  const [incDecLoading, setInDecLoading] = useState(null);
  const {
    items: cartItems,
    inc_dec,
    loading: load,
  } = useSelector((state) => state.cart);
  //console.log(cartItems);

  //console.log(items);

  //console.log(inc_dec);

  useEffect(() => {
    dispatch(fetchProducts({ category: slug }));
  }, [slug, dispatch]);

  const handleAddToCart = (productId) => {
    console.log(productId);
    try {
      setAddingToCartId(productId); // loader start
      dispatch(addToCart({ productId, quantity: 1 })).then(() =>
        dispatch(fetchCart())
      );
      setAddingToCartId(null); // loader end
    } catch (error) {
      toast.error(error);
      setAddingToCartId(null);
    }
  };

  const handleIncrease = (productId) => {
    setInDecLoading({ id: productId, type: "increase" });
    dispatch(increaseQuantity(productId))
      .then(() => {
        dispatch(fetchCart());
      })
      .finally(() => setInDecLoading(null));
  };

  const handleDecrease = (productId) => {
    setInDecLoading({ id: productId, type: "decrease" });
    dispatch(decreaseQuantity(productId))
      .then(() => dispatch(fetchCart()))
      .finally(() => setInDecLoading(null));
  };

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
          {items.map((product) => {
            const cart = cartItems?.find((i) => i.product._id === product._id);
            return (
              <ProductCard
                key={product._id}
                product={product}
                adding={addingToCartId === product._id}
                onAddToCart={handleAddToCart}
                cart={cart}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                incDecLoading={incDecLoading}
                load={load}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryProductsPage;
