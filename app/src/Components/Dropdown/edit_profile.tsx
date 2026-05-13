// "use client";

// import { FaCamera } from "react-icons/fa";
// import { useRef } from "react";

// interface ProfileEditProps {
//   image: string;
//   onChangeImage: (img: string) => void;
  
// }

// function ProfileEdit({ image, onChangeImage }: ProfileEditProps) {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleCameraClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       onChangeImage(URL.createObjectURL(file)); //  update parent
//     }
//   };

//   return (
//     <div className="flex flex-col items-center gap-2">
//       <div className="relative w-28 h-28 mt-5">
//         <img
//           src={image}
//           alt="profile"
//           className="w-full h-full rounded-full object-cover"
//         />

//         <div
//           onClick={handleCameraClick}
//           className="absolute bottom-1 right-1 bg-gray-300 p-2 rounded-full cursor-pointer border-2 border-white"
//         >
//           <FaCamera className="text-black cursor-pointer text-sm" />
//         </div>

//         <input
//           type="file"
//           ref={fileInputRef}
//           accept="image/*"
//           onChange={handleFileChange}
//           className="hidden"
//         />
//       </div>

//       <h1 className="text-[#e11d48] text-xl">ផ្លាស់ប្ដូររូបភាព</h1>
//     </div>
//   );
// }

// export default ProfileEdit;
