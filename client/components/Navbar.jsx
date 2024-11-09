// frontend/components/Navbar.js
import React from "react";
import { useRouter } from "next/navigation";
import { IoHomeOutline } from "react-icons/io5";
import { AiOutlineMessage } from "react-icons/ai";
import { GoPeople } from "react-icons/go";
import { BsCalendar4Event } from "react-icons/bs";
import { IoNotificationsOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";


const Navbar = ({ handleLogout, handleMessageClick }) => {
  const router = useRouter();

  return (
    <div className="flex gap-6 lg:gap-12 text-gray-600">
      <IoHomeOutline
        className="w-6 h-6 lg:w-8 lg:h-8 cursor-pointer"
        onClick={() => router.push("/")}
      />
      <AiOutlineMessage
        className="w-6 h-6 lg:w-8 lg:h-8 cursor-pointer"
        onClick={handleMessageClick}
      />
      <IoNotificationsOutline
        className="w-6 h-6 lg:w-8 lg:h-8 cursor-pointer"
        onClick={() => router.push("/")}
      />
      <GoPeople
        className="w-6 h-6 lg:w-8 lg:h-8 cursor-pointer"
        onClick={() => router.push("/")}
      />
      <BsCalendar4Event
        className="w-6 h-6 lg:w-8 lg:h-8 cursor-pointer"
        onClick={() => router.push("/event")}
      />
      <RxDashboard
        className="w-6 h-6 lg:w-8 lg:h-8 cursor-pointer"
        onClick={() => router.push("/")}
      />
      {/* <button
        onClick={handleLogout}
        className="text-red-500 font-semibold lg:hidden" // Show logout only on mobile
      >
        Log Out
      </button> */}
    </div>
  );
};

export default Navbar;
