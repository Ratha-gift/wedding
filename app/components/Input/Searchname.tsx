import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

interface SearchnameProps {
  Children?: string; // ← សម្រាប់ input placeholder
  className?: string;
  textColor?: string;
  width?: string;
  height?: string;
  border?: string;
  radius?: string;
  shadow?: string;
  type?: string;
  focus?: string;
}

function Searchname({ 
    Children = "",
    className,
    textColor = "", 
    width = "w-80", 
    height = "h-12", 
    border = "",
    radius = "rounded-md",
    shadow = "", 
    type = "text",
    focus = "focus:outline focus:outline-[#e11d48]"
}: SearchnameProps) {

  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`relative`}>
      <input 
        type={inputType}
        className={`${textColor} ${width} ${height} ${border} ${radius} ${className} ${shadow} ${focus} pr-10`}  
        placeholder={Children} 
      />
      {type === "password" && (
        <span 
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
        </span>
      )}
    </div>
  )
}

export default Searchname;
