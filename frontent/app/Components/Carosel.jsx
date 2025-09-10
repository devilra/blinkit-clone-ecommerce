"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";

function Carosel() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  };

  const slides = ["/banner/b1.png", "/banner/b2.png", "/banner/b3.png"];
  const cardSlides = ["/card/c1.avif", "card/c2.avif", "/card/c3.avif"];

  return (
    <div className="slider-container overflow-hidden  p-5">
      <Slider {...settings}>
        {slides.map((src, index) => (
          <div key={index} className="rounded-lg p-2">
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className=" rounded-3xl w-full h-[250px] "
            />
          </div>
        ))}
      </Slider>
      <div className="mt-10 max-w-5xl ">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* <img
            src="/card/c1.avif"
            alt="card-1"
            className="h-40 w-[400px] rounded-md cursor-pointer hover:opacity-80 transition duration-300 ease-in-out"
          />
          <img
            src="/card/c2.avif"
            alt="card-1"
            className="h-40 w-[400px] rounded-md cursor-pointer hover:opacity-80 transition duration-300 ease-in-out"
          />
          <img
            src="/card/c3.avif"
            alt="card-1"
            className="h-40 w-[400px] rounded-md"
          /> */}
          {cardSlides.map((src, index) => (
            <div key={index} className="px-2">
              <img
                src={src}
                alt={`card-${index + 1}`}
                className="h-44 w-[400px] rounded-md cursor-pointer hover:opacity-80 transition duration-300 ease-in-out"
              />
            </div>
          ))}
        </div>
      </div>
      {/* <Slider
          {...settings}
          slidesToShow={2}
          centerPadding="0px"
          slidesToScroll={1}
        >
          {cardSlides.map((src, index) => (
            <div key={index} className="rounded-lg gap-2 max-w-md ">
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className=" rounded-lg w-full  h-[200px]"
              />
            </div>
          ))}
        </Slider> */}
    </div>
  );
}

export default Carosel;
