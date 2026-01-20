import Link from 'next/link'
import { IoMdArrowRoundBack } from "react-icons/io";
import { AllData } from './Components/Data/Image/image';
export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-800 relative bg-cover bg-center"
    style={{ backgroundImage: `url(${AllData.Background.data})` }}
    >
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-6">Oops! Page not found.</p>
      <Link href="/home">
        <div className="p-3 h-10 flex items-center cursor-pointer justify-center transform transtition duration-200 hover:scale-110 bg-[#f29aad] rounded-md">
            <IoMdArrowRoundBack />
            <p>back to home page</p>
        </div>
      </Link>
     
    </div>
  );
}