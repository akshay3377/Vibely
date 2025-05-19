"use client";

import React from "react";

const InputField = ({
  onchange,
  className,
  name,
  onInput,
  label,
  icon,
  register,
  errors,
  ...restProps
}) => {
  const showError = errors && errors[name];

  return (
    <div className=" w-full ">
      <small className="font-semibold  inline-block mb-[8px] text-md">{label}</small>
      <div
        className={`relative  ${className}  bg-[#EDF2F7] dark:bg-[#FFFFFF0A]  ${
          showError && "border border-red"
        } px-3 py-2 rounded-md flex items-center mb-[24px]`}
      >
        <span className="mr-2 text-white">{icon}</span>
        <input
          name={name}
          onInput={onInput}
          onChange={onchange}
          id={name}
          {...restProps}
          {...register}
          className="outline-none  placeholder:text-sm bg-transparent w-full   "
        />

        {showError && (
          <div className="absolute bottom-[-25px] left-0 text-[red] text-[12px]">
            {errors[name]?.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
