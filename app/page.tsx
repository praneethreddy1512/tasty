'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNavigate = (path: string) => {
    setLoading(true);
    setTimeout(() => {
      router.push(path);
    }, 500);
  };

  return (
    <div
      className="h-screen w-full flex flex-col justify-center items-center bg-cover bg-center relative text-white"
      style={{
        backgroundImage: `url('https://img.freepik.com/premium-photo/frame-made-sandwiches-with-avocado-salami-cucumber_118925-2319.jpg?semt=ais_items_boosted&w=740')`,
      }}
    >
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
        </div>
      )}

      <div className="z-10 text-center">
        <img className='p-2 h-20' src="data:image/png;base64,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"/>
        <h1 className="text-5xl font-bold mb-8 drop-shadow-lg">
          Welcome to <span className="text-orange-400">Tasty Kitchen</span>
        </h1>

        <div className="flex gap-6 justify-center">
          <button
            onClick={() => handleNavigate('/user/signin')}
            className="relative px-6 py-3 text-lg bg-orange-500 text-white rounded-lg overflow-hidden transition-all duration-300 hover:bg-transparent hover:text-orange-500 border-2 border-orange-500"
          >
            <span className="z-10 relative">Sign In</span>
            <span className="absolute inset-0 animate-slide bg-white bg-opacity-20" />
          </button>

          <button
            onClick={() => handleNavigate('/user/signup')}
            className="relative px-6 py-3 text-lg bg-orange-500 text-white rounded-lg overflow-hidden transition-all duration-300 hover:bg-transparent hover:text-orange-500 border-2 border-orange-500"
          >
            <span className="z-10 relative">Sign Up</span>
            <span className="absolute inset-0 animate-slide bg-white bg-opacity-20" />
          </button>
        </div>
      </div>
    </div>
  );
}
