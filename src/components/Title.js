import Image from "next/image";
import React from "react";

export default function Title({ title1, title2, src }) {
  return (
    <div className="flex items-center   ">
      <div>
        <h2 className="text-4xl md:text-5xl font-black leading-tight  ">
          <span className="">{title1}</span>
        </h2>
        <h3 className="text-4xl md:text-5xl font-black text-primary -mt-5">{title2}</h3>
      </div>
      {src && (
        <div className="ml-[-10px] ">
          {" "}
          <Image
            src={src}
            height={100}
            width={100}
            alt="image"
            className="object-cover h-20 w-20 md:h-22 md:w-22 "
          />
        </div>
      )}
    </div>
  );
}
