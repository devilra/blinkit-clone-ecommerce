"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  decreaseQuantity,
  fetchCart,
  increaseQuantity,
  removeQuantity,
} from "../redux/slices/cartSlice";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@mui/material";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { PiTrashSimpleThin } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { fetchAddresses } from "../redux/slices/addressSlice";
import CheckoutDrawer from "../Components/CheckoutDrawer";

const CartPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { items, totalPrice, loading, updating } = useSelector(
    (state) => state.cart
  );

  const [incDecLoading, setInDecLoading] = useState(null);

  //console.log(items);

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchAddresses());
  }, []);

  const handleRemove = (productId) => {
    console.log(productId);
    dispatch(removeQuantity(productId)).then(() => dispatch(fetchCart()));
  };

  const handleIncrease = (productId) => {
    setInDecLoading({ id: productId, type: "increase" });
    dispatch(increaseQuantity(productId)).then(() => setInDecLoading(null));
  };

  const handleDecrease = (productId, quantity) => {
    if (quantity === 1) {
      handleRemove(productId);
    } else {
      setInDecLoading({ id: productId, type: "decrease" });
      dispatch(decreaseQuantity(productId)).then(() => setInDecLoading(null));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className=" md:mt-20  flex flex-col md:flex-row gap-6 min">
      <div className="flex-1 bg-white rounded-lg shadow-md p-4 ">
        {items.length > 0 && (
          <div className="sticky bottom-1 right-1 z-10 bg-white py-2 flex justify-end border-b">
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<PiTrashSimpleThin />}
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>
          </div>
        )}

        {loading ? (
          <>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex items-center gap-4 border-b py-4 last:border-none"
              >
                <Skeleton className="h-[100px] w-[100px] rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </>
        ) : items.length === 0 ? ( //  Empty cart only after loading false
          <div className="flex flex-col items-center justify-center h-[83vh]">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/")} // or `/`
            >
              GO TO SHOPPING
            </Button>
          </div>
        ) : (
          items.map((item, idx) => {
            //console.log(item);
            return (
              <div
                key={idx}
                className="flex  items-center gap-4 border-b py-4 last:border-none"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  width={100}
                  height={100}
                  className="object-cover rounded-md"
                />

                {/* Details */}
                <div className="flex-1">
                  <h2 className="font-semibold text-neutral-600">
                    {item.product.name}
                  </h2>
                  <p className="text-gray-500 text-[12px]">Seller: Assured</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="line-through text-[13px] text-gray-500">
                      ₹{item.product.price}
                    </span>
                    <span className="text-lg font-semibold text-[13px] text-neutral-600">
                      ₹{item.product.discountPrice || item.product.price}
                    </span>

                    {item.product.discountPrice && (
                      <span className="text-green-600 font-medium text-sm">
                        {Math.round(
                          (1 -
                            item.product.discountPrice / item.product.price) *
                            100
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity */}

                <div className="flex items-center gap-2 md:gap-5    ">
                  <Button
                    variant="outlined"
                    sx={{ padding: "10px" }}
                    color="error"
                    loading={
                      incDecLoading?.id === item.product._id &&
                      incDecLoading?.type === "decrease"
                    }
                    onClick={() =>
                      handleDecrease(item.product._id, item.quantity)
                    }
                  >
                    <FaMinus size={10} />
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outlined"
                    fullWidth={false}
                    sx={{ padding: "10px" }}
                    color="success"
                    onClick={() => handleIncrease(item.product._id)}
                    loading={
                      incDecLoading?.id === item.product._id &&
                      incDecLoading?.type === "increase"
                    }
                  >
                    <FaPlus size={10} />
                  </Button>
                </div>

                {/* Save & Remove */}
                <div>
                  <Button
                    variant="outlined"
                    sx={{
                      fontSize: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    color="error"
                    onClick={() => handleRemove(item.product._id)}
                  >
                    <FaTrash size={17} className="px-1" />
                    REMOVE
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Right side - Price Details */}
      {items.length > 0 ? (
        <div className="w-full md:w-1/3 bg-white h-screen rounded-lg shadow-md p-4">
          {loading ? (
            <>
              {" "}
              <Skeleton className="h-5 w-1/3 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-10 w-full mt-4 rounded" />
            </>
          ) : (
            <>
              <h2 className="font-semibold border-b pb-2 mb-2">
                PRICE DETAILS
              </h2>

              {/* 🔥 Each item calculation */}

              <ul className="mb-4 list-disc space-y-3 md:space-y-5 mt-5">
                {items.map((item, i) => {
                  const unitPrice =
                    item.product.discountPrice || item.product.price;
                  return (
                    <div key={i}>
                      <li className="flex justify-between py-1">
                        <span className="text-[12px] text-neutral-600">
                          {item.product.name} ({item.quantity} × ₹{unitPrice})
                        </span>
                        <span className="text-[12px] text-neutral-600">
                          ₹{unitPrice * item.quantity}
                        </span>
                      </li>
                      <Separator />
                    </div>
                  );
                })}
              </ul>

              <div className="flex justify-between mb-2 font-medium">
                <span> ({items.length} items)</span>
                <span>₹{totalPrice}</span>
              </div>

              <div className="flex justify-between mb-2 text-green-600">
                <span>Discount</span>
                <span>-₹{Math.round(totalPrice * 0.2)}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Delivery Charges</span>
                <span className="text-green-600">FREE</span>
              </div>

              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total Amount</span>
                <span>₹{totalPrice - Math.round(totalPrice * 0.2)}</span>
              </div>

              <p className="text-green-600 text-sm mt-2">
                You will save ₹{Math.round(totalPrice * 0.2)} on this order
              </p>

              {/* <Button
                variant="contained"
                sx={{ marginTop: "10px" }}
                color="success"
                className="w-full "
                disabled={items.length === 0}
              >
                PLACE ORDER
              </Button> */}

              <CheckoutDrawer />

              {/* <div className="flex justify-between mb-2">
              <span>Price ({items.length} items)</span>
            </div>
            <div className="flex justify-between mb-2 text-green-600">
              <span>Discount</span>
              <span>-₹{Math.round(totalPrice * 0.2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Delivery Charges</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total Amount</span>
              <span>₹{totalPrice - Math.round(totalPrice * 0.2)}</span>
            </div>
            <p className="text-green-600 text-sm mt-2">
              You will save ₹{Math.round(totalPrice * 0.2)} on this order
            </p>
            <Button
              variant="contained"
              color="success"
              className="w-full bg-orange-500 text-white py-2 mt-4 rounded hover:bg-orange-600"
            >
              PLACE ORDER
            </Button> */}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default CartPage;
