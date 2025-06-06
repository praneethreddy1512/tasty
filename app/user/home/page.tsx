'use client';
import React, { use } from "react";
import Image from "next/image";
import Navbar from "@/app/navbar/page";
import Footer from "@/app/footer/page";
import { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";

type Restaurant = {
  _id: string;
  imgurl: string;
  name: string;
  rating: number;
};


export default function Home() {
  
const [restaurants, setrestuarents] = useState<Restaurant[]>([])

const getRestaurants = async () => {
    try {
      const response = await fetch("/api/admin");
      const data = await response.json();
      setrestuarents(data|| []);
      console.log(data);

    } catch (error) {
      console.error("Failed to fetch restaurants:", error);
    }
  };

useEffect(() => {
    getRestaurants();

  }, []);
  return (
    <div className="bg-gray-100 min-h-screen">
    <Navbar/>
      <section className="relative bg-orange-500 p-6 rounded-lg mx-4 my-6">
        <div className="flex items-center gap-6">
          <img src="https://static1.squarespace.com/static/5f2fa039103c7a08856032c1/5f2fa051df524e64bc14bd2a/6265f28d83150d6937812406/1653757580513/public.jpeg?format=1500w" alt="South Indian" className="rounded-xl h-60  w-70" />
          <div>
            <h2 className="text-2xl font-semibold text-white">South Indian Food</h2>
            <p className="text-white">Best offers on South India holiday tour packages via Dream World</p>
            <p className="text-white">📞 +123 456 7890</p>
            <div className="mt-2 text-lg bg-white text-orange-500 font-bold w-max px-4 py-1 rounded-full">50% OFF</div>
          </div>
        </div>
      </section>

      <main className="mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Popular Restaurants</h2>
          <select className="p-2 border rounded">
            <option>Sort by Lowest</option>
            <option>Sort by Highest</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map((r, index) => (
          <Link href={`/restraunt/${r._id}`} key={r._id}>
            <div key={index} className="bg-white rounded shadow p-4">
              <img src={r.imgurl} alt={r.name}  height={200} className="rounded-lg w-full" />
              <div className="mt-2">
                <h3 className="font-bold text-lg">{r.name}</h3>
                <p className="text-sm text-gray-600">Fast Food</p>
                <p className="text-yellow-500">⭐ {r.rating}</p>
              </div>
            </div>
            </Link>
          ))}
{/* {
  restaurants.map((r) => (
    <Link href={`/restraunt/${r._id}`} key={r._id}>
      <div className="p-4 shadow rounded-xl hover:bg-gray-100 cursor-pointer">
        <img src={r.imgurl} alt={r.name} className="h-32 w-full object-cover rounded" />
        <h2 className="text-lg font-bold mt-2">{r.name}</h2>
        <p>⭐ {r.rating}</p>
      </div>
    </Link>
  ))
} */}


        </div>

      </main>
      <Footer/>
    </div>
  );
}