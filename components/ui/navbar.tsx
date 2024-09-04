import Image from "next/image";
import React from "react";
import LinkBtn from "../link-btn";
import PrimaryBtn from "../primary-btn";
import { MessageCircleDashed } from "lucide-react";

export default function Navbar() {
  return (
    <div className="w-screen flex justify-around items-center h-16 bg-zinc-900">
      <div className="logo-menu flex items-center justify-between w-full md:w-1/4">
        <div className="flex items-center mx-4 md:mx-0">
          <MessageCircleDashed size={40} />
          <div className="mx-2 poppins-extrabold text-purple-400 text-xl"> Mingle</div>
        </div>
        <div className="hidden md:flex justify-between w-2/3 ">
          <LinkBtn link="#" text="Features" />
        </div>
      </div>
      <div className="auth flex justify-evenly items-center w-full md:w-48">
        <span  className="mx-4 md:mx-0">
          <LinkBtn link="/login" text="Login" />
        </span>
        <span  className="mx-4 md:mx-0">
          <PrimaryBtn link="/signup" text="Signup" />
        </span>
      </div>
    </div>
  );
}