import React, { Children, ReactNode } from 'react'

interface SaveButtonProps{
  children: ReactNode;
  width?: string;        
  height?: string;       
  textColor?: string;      
  bg?: string;
  radius?: string;
  shadow?: string;
  className?: string;
  icon?: ReactNode | null;
  iconposition?: 'left' | 'right';

}

function Button({ Children ="",className = '', textColor = "", width="w-30", height="h-10", bg="bg-[#E11D48]", radius ="rounded-md", shadow ="shadow-2xl", iconposition="", icon=null }) {
  return (
    <button className={`${textColor} ${width} ${height} ${bg} ${radius} ${className} ${shadow} cursor-pointer flex items-center justify-center gap-2`}>
      {icon && iconposition === "left" && icon}

      {Children}
      
      {icon && iconposition === "right" && icon}
    </button>
  )
}

export default Button;