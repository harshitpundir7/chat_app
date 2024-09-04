"use client";
import React from "react";
import Footer from "@/components/footer";
import Navbar from "@/components/ui/navbar";
import Main from "@/components/main";

export default function Home() {
  return (
    <>
    <div className="bg-black">
      <nav>
        <Navbar/>
      </nav>
      <main>
        <Main/>
      </main>
      <footer>
      <Footer/>
      </footer>
      </div>
    </>
  );
}
