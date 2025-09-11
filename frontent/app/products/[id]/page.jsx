"use client";

import Spinner from "@/app/Components/Spinner";
import {
  clearSelectedProduct,
  fetchProductById,
} from "@/app/redux/slices/productSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineTimer } from "react-icons/md";

import { toast } from "react-toastify";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  //  State for main image
  const [mainImage, setMainImage] = useState(null);

  const [time, setTime] = useState(0);
  const [newPrice, setNewPrice] = useState(0);
  const [showMore, setShowMore] = useState(false);

  const {
    selectedProduct: product,
    loading,
    error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (product) {
      setMainImage(product.imageUrl);

      const randomTime = Math.floor(Math.random() * 59) + 1;
      setTime(randomTime);

      const discount = Math.floor(Math.random() * 5) + 1;
      setNewPrice(product.price - discount);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return toast.error(error);
  }

  if (!product) return null;

  return (
    <div className="p-6 max-w-7xl md:mt-14 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row  gap-6 md:gap-16">
          {/* Left: Product Image + Gallery */}
          <div className="flex-1">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-80 object-cover rounded-xl shadow-md"
            />
            {product.gallery?.length > 0 && (
              <div className="flex gap-2">
                <div className="flex gap-2 mt-3 flex-wrap">
                  {product.gallery.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`gallery-${idx}`}
                      onClick={() => setMainImage(img)}
                      className={`h-20 w-20 object-cover p-1 rounded-md cursor-pointer transition-all ${
                        mainImage === img
                          ? "border-3 border-neutral-500"
                          : "border"
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-3">
                  <img
                    src={product.imageUrl}
                    onClick={() => setMainImage(product.imageUrl)}
                    className={`h-20 w-20 object-cover p-1 rounded-md cursor-pointer transition-all ${
                      mainImage === product.imageUrl
                        ? "border-3 border-neutral-500"
                        : "border"
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Highlights Section */}
            <div className="mt-6">
              <h2 className="font-semibold text-lg mb-2">Highlights</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-100 p-3 rounded-md text-center">
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-bold">{product.type || "N/A"}</p>
                </div>
                <div className="bg-slate-100 p-3 rounded-md text-center">
                  <p className="text-sm text-gray-600">Pieces</p>
                  <p className="font-bold">{product.pieces || "N/A"}</p>
                </div>
              </div>
            </div>
            {/* Product Details Section */}

            <div className="mt-6">
              <h2 className="font-semibold text-lg mb-2">Product Details</h2>
              <p className="text-sm text-green-600">
                Protein Per 100 g (g): {product.protein || "14 g"}
              </p>
              {!showMore ? (
                <button
                  onClick={() => setShowMore(true)}
                  className="text-green-600 text-sm md:mt-5 cursor-pointer mt-2"
                >
                  View more details ▼
                </button>
              ) : (
                <div className="mt-2 text-sm text-gray-700">
                  <button
                    onClick={() => setShowMore(false)}
                    className="text-green-600 text-sm mt-2 md:mt-5 cursor-pointer"
                  >
                    View less ▲
                  </button>
                  <p>{product.longDescription || "Full product details..."}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex-1 space-y-2">
            <h1 className="font-bold">{product.name}</h1>
            <div className="flex items-center">
              <div className="bg-slate-100 p-1 rounded flex items-center">
                <MdOutlineTimer size={10} />
                <p className="text-[9px] font-bold px-2 ">
                  {time}
                  <span className="px-1">MINS</span>
                </p>
              </div>
            </div>
            <p className="text-gray-600">{product.description}</p>
            {/* Price with strike-through */}

            <div className="flex items-center gap-2">
              <span className="text-sm line-through text-gray-500">
                ₹{product.price}
              </span>
              <span className="text-lg font-semibold text-red-500">
                ₹{newPrice}
              </span>
            </div>

            <p className="text-sm bg-slate-200 rounded max-w-[110px] my-7  px-2 py-2">
              Stock: {product.stock} {product.unit}
            </p>
            <Button size="lg" className="w-full md:w-auto">
              Add to Cart
            </Button>

            {/* Why Shop Section */}
            <div className="pt-5 md:pt-10 space-y-3">
              <h1 className="font-semibold text-lg">
                Why shop from Ecommerce?
              </h1>
              <div className="space-y-2 text-sm">
                <p>⚡ Superfast Delivery - Get your order delivered quickly</p>
                <p>💰 Best Prices & Offers - Direct from manufacturers</p>
                <p>🛒 Wide Assortment - 5000+ products across categories</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailsPage;
