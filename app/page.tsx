'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div
      className="h-screen w-full flex flex-col justify-center items-center bg-cover bg-center bg-white relative text-white"
    //   style={{
    //     backgroundImage: `url('https://img.freepik.com/free-photo/flat-lay-arrangement-with-salad-box-sauce_23-2148247883.jpg')`,
    //   }}
    >
      <div className="z-10 text-center">
        <h1 className="text-5xl text-black font-bold mb-8 drop-shadow-lg">
          Welcome to <span className="text-orange-400">Tasty Kitchen</span>
        </h1>

        <div className="flex gap-6 justify-center">
          <Link href="user/signin">
            <button className="relative px-6 py-3 text-lg bg-orange-500 text-white rounded-lg overflow-hidden transition-all duration-300 hover:bg-transparent hover:text-orange-500 border-2 border-orange-500">
              <span className="z-10 relative">Sign In</span>
              <span className="absolute inset-0 animate-slide bg-white bg-opacity-20" />
            </button>
          </Link>

          <Link href="user/signup">
            <button className="relative px-6 py-3 text-lg bg-orange-500 text-white rounded-lg overflow-hidden transition-all duration-300 hover:bg-transparent hover:text-orange-500 border-2 border-orange-500">
              <span className="z-10 relative">Sign Up</span>
              <span className="absolute inset-0 animate-slide bg-white bg-opacity-20" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
