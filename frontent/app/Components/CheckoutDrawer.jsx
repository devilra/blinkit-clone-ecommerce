"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddresses } from "../redux/slices/addressSlice";
import { IoCallSharp } from "react-icons/io5";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { RainbowButton } from "@/components/magicui/rainbow-button";

const CheckoutDrawer = () => {
  const dispatch = useDispatch();
  const { addresses, loading } = useSelector((state) => state.address);

  console.log("checkout Drawer,", addresses);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  return (
    <div className="mt-10 mx-5 ">
      <Drawer>
        <DrawerTrigger>
          {" "}
          <Button
            variant="contained"
            component="span"
            sx={{
              backgroundColor: "black",
              color: "white",
              fontSize: "12px",
              padding: "10px 80px",
            }}
          >
            Go to Address
          </Button>
        </DrawerTrigger>
        <DrawerContent className="pb-20">
          <DrawerHeader>
            <DrawerTitle>Choose Delivery Address</DrawerTitle>
          </DrawerHeader>

          {/* Saved addresses */}
          <div className="space-y-4 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-5 mx-5">
            {addresses.length > 0 ? (
              addresses.map((addr) => (
                <div key={addr._id} className="">
                  <div
                    className={`border p-3 rounded-lg cursor-pointer flex flex-col justify-between ${
                      addr.isDefault ? "border-green-500" : "border-gray-300"
                    }`}
                    //onClick={}
                  >
                    <p className="font-semibold">{addr.city}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {addr.addressLine1} - {addr.city} - {addr.state} -{" "}
                      {addr.postalCode}
                    </p>
                    <p className="text-sm flex items-center  text-neutral-900">
                      <IoCallSharp className="px-2" size={30} />
                      {addr.phone}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No saved addresses found</p>
            )}
          </div>

          {/* Add new address */}
          <div className="pt-4 space-y-3 mx-5">
            <h3 className="font-semibold text-gray-700">Add New Address</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 ">
              <div className="">
                <Label className="py-2">Name</Label>
                <Input
                // value={newAddress.name}
                // onChange={(e) =>
                //   setNewAddress({ ...newAddress, name: e.target.value })
                // }
                />
              </div>
              <div className="">
                <Label className="py-2">Phone</Label>
                <Input
                //value={newAddress.phone}
                // onChange={(e) =>
                //   setNewAddress({ ...newAddress, phone: e.target.value })
                // }
                />
              </div>
              <div className="">
                <Label className="py-2">Pincode</Label>
                <Input
                //   value={newAddress.pincode}
                //   onChange={(e) =>
                //     setNewAddress({ ...newAddress, pincode: e.target.value })
                //   }
                />
              </div>
              <div className="">
                <Label className="py-2">Street</Label>
                <Input
                //   value={newAddress.street}
                //   onChange={(e) =>
                //     setNewAddress({ ...newAddress, street: e.target.value })
                //   }
                />
              </div>
              <div className="">
                <Label className="py-2">City</Label>
                <Input
                //   value={newAddress.city}
                //   onChange={(e) =>
                //     setNewAddress({ ...newAddress, city: e.target.value })
                //   }
                />
              </div>
              <div className="">
                <Label className="py-2">State</Label>
                <Input
                //   value={newAddress.state}
                //   onChange={(e) =>
                //     setNewAddress({ ...newAddress, state: e.target.value })
                //   }
                />
              </div>
              <div className="md:mt-7">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "black",
                    fontSize: "12px",
                    padding: "10px 30px",
                  }}
                  //className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  // onClick={handleAddAddress}
                  // disabled={loading}
                >
                  Save Address
                </Button>
              </div>
            </div>
          </div>

          <DrawerFooter className="">
            <div className="flex justify-end  ">
              {/* <RainbowButton className="md:w-[200px]">Checkout</RainbowButton> */}
              <ShinyButton className="md:w-[200px] border border-neutral-700 rounded font-bold ">
                Checkout
              </ShinyButton>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CheckoutDrawer;
