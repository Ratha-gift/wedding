import React from 'react'
import { Kantumruy_Pro } from 'next/font/google'
const kantumruyPro = Kantumruy_Pro({
  subsets: ['khmer'],
  weight: ['400'],
});
function Search() {
  return (

     <input type="text" className={`w-full rounded-lg p-2 text-md border-2 border-[#e11d48]  ${kantumruyPro.className}`} placeholder='ស្វែងរក....' />

  )
}

export default Search