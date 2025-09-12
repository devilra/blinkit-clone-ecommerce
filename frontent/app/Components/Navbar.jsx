"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link"; // ✅ Import Link

import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { clearState, getMe, logoutUser } from "../redux/slices/authSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCart } from "../redux/slices/cartSlice";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!user) {
      dispatch(getMe());
    }

    dispatch(fetchCart());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => dispatch(clearState()));
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/75 backdrop-blur-2xl  dark:bg-gray-900 md:py-2 shadow z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className={` text-2xl font-bold`}>
            <Link href="/">LOGO</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link className={` hover:text-blue-600`} href="/">
              Home
            </Link>
            <Link className={` hover:text-blue-600`} href="/products">
              Products
            </Link>
            <Link className={` hover:text-blue-600`} href="/blog">
              Blog
            </Link>
            {loading ? (
              <>
                <Skeleton className="h-[20px] w-[100px] rounded-full" />
              </>
            ) : user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="hover:text-red-600 font-medium"
                >
                  Logout
                </button>
                <div className="flex items-center gap-1">
                  <FiUser className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-800">
                    {user.name}
                  </span>
                </div>
              </>
            ) : (
              <Link className="hover:text-blue-600" href="/login">
                Login
              </Link>
            )}
            <Link className={` text-pink-600`} href="/category-form">
              Add Category
            </Link>

            <Link className={` text-pink-600`} href="/create-product">
              Product create
            </Link>

            {/* Icons */}
            <FiSearch className="w-5 h-5 cursor-pointer hover:text-blue-600" />
            <FiUser className="w-5 h-5 cursor-pointer hover:text-blue-600" />
            <Link
              href="/cart"
              className="flex items-center space-x-1 cursor-pointer hover:text-neutral-600 transition-all relative"
            >
              <FiShoppingCart className="w-5 h-5" />

              {loading ? (
                <>
                  <Skeleton className="absolute -top-2 -left-1 h-[30px] w-[100px] rounded-full" />
                  <Skeleton className="absolute -top-2 -left-1 h-[30px] w-[100px] rounded-full" />
                  <Skeleton className="absolute -top-2 -left-1 h-[30px] w-[100px] rounded-full" />
                </>
              ) : items?.length > 0 ? (
                <span className="absolute -top-2 -left-1  bg-red-600 text-white p-1 text-[9px] w-[17px] border-2  border-white h-[17px] flex items-center justify-center rounded-full">
                  {items.length}
                </span>
              ) : null}

              <span className={` text-sm`}>Cart</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu}>
              {menuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 pt-2 pb-4 space-y-2 shadow-md">
          <Link className={` block hover:text-blue-600`} href="/">
            Home
          </Link>
          <Link className={` block hover:text-blue-600`} href="/products">
            Products
          </Link>
          <Link className={` block hover:text-blue-600`} href="/blog">
            Blog
          </Link>
          <Link className={` block hover:text-blue-600`} href="/bulk-enquiry">
            Bulk Enquiry
          </Link>
          {loading ? (
            <div className="flex items-center gap-2 animate-pulse">
              <div className="w-6 h-6 rounded-full bg-gray-300"></div>
              <div className="w-20 h-4 bg-gray-300 rounded"></div>
            </div>
          ) : user ? (
            <>
              <button
                onClick={handleLogout}
                className="block hover:text-red-600"
              >
                Logout
              </button>
              <div className="flex items-center gap-1 mt-2">
                <FiUser className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-800">
                  {user.name}
                </span>
              </div>
            </>
          ) : (
            <Link className="block hover:text-blue-600" href="/login">
              Login
            </Link>
          )}

          <div className="flex space-x-4 mt-2">
            <FiSearch className="w-5 h-5 cursor-pointer hover:text-blue-600" />
            <FiUser className="w-5 h-5 cursor-pointer hover:text-blue-600" />
            <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-600">
              <FiShoppingCart className="w-5 h-5" />
              <span className={`text-sm`}>Cart</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
