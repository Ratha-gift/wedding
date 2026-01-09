import React, { useState } from "react";

function Profile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex text-sm bg-dark rounded-full  mr-5"
      >
        <img className="w-13 h-13 border-3 border-white rounded-full" src="/profile.jpg" alt="user" />
      </button>

      {open && (
        <div className="absolute right-5 z-30 bg-white rounded-2xl border-default-medium rounded-base shadow-lg w-42">
          <ul className="p-2 text-sm">
            <li>
              <a className="block p-2 hover:bg-neutral-tertiary-medium rounded">
                Account
              </a>
            </li>
            <li>
              <a className="block p-2 text-red-600 hover:bg-neutral-tertiary-medium rounded">
                Sign out
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Profile;
