import React from "react";

export default function TextAreaField({
  icon,
  placeholder,
  label,
  name,
  register,
}) {
  return (
    <div className="mx-auto mb-[40px]">
      <small className="font-[600] inline-block mb-[8px] text-md ">{label}</small>
      <div className="w-[100%]  bg-[#EDF2F7] dark:bg-[#FFFFFF0A]    px-[12px] py-[12px] rounded-md flex justify-center items-start">
        <span className="mr-[8px]"> {icon}</span>
        <textarea
          id={name}
          {...register}
          rows={2}
          cols={2}
          className="outline-none w-full shadow-none placeholder:text-sm  bg-transparent "
          type="text"
          placeholder={placeholder}
        ></textarea>
      </div>
    </div>
  );
}
