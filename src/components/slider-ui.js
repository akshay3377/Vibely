"use client";
import React from "react";
import Slider from "react-slick";



const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="z-50 absolute left-0 top-1/2 transform -translate-y-1/2 bg-[white] text-white rounded-full p-2   hover:translate-x-1 transition-transform "
    >
      f
    </button>
  );
};

const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="z-50 absolute right-0 top-1/2 transform -translate-y-1/2 bg-[white] text-white  rounded-full p-2  hover:translate-x-1 transition-transform "
    >
      f
    </button>
  );
};

export { CustomPrevArrow, CustomNextArrow };

const SliderUI = () => {
  const settings = {
    // dots: true,
    centerMode: false,
    infinite: false,
    centerPadding: "0",
    slidesToShow: 3,
    // speed: 500,
    arrows: true,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <div className="max-w-[1400px] mx-auto ">
      <Slider {...settings}>
        {[1, 2, 3, 4, 5, 6, 7].map((slide, index) => (
          <div key={index} className="px-4">
            <div className="mx-auto bg-red h-[250px] rounded-lg">{index}</div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderUI;
