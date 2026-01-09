import React from "react";
import { FaCamera } from "react-icons/fa";

function ProfileEdit() {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Avatar wrapper */}
      <div className="relative w-28 h-28 mt-5">
        <img
          src="/profile.jpg"
          alt="profile"
          className="w-full h-full rounded-full object-cover"
        />

        
        <div className="absolute bottom-1 right-1 bg-gray-300 p-2 rounded-full shadow cursor-pointer border-2 border-[#f2f2f2]">
          <FaCamera className="text-black text-sm" />
        </div>
      </div>

      <h1 className="text-[#e11d48] text-xl font-medium">
        ផ្លាស់ប្ដូររូបភាព
      </h1>
    </div>
  );
}

export default ProfileEdit;
