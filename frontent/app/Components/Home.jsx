"use client";

import React, { useEffect } from "react";
import Carosel from "./Carosel";
import CategoryComponent from "./Category/CategoryComponent";
import { useDispatch } from "react-redux";
import { getMe } from "../redux/slices/authSlice";

const Home = () => {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getMe());
  // }, []);
  return (
    <div className="bg-gradient-to-l from-amber-50 md:mt-20 h-full">
      <Carosel />
      <CategoryComponent />
    </div>
  );
};

export default Home;
