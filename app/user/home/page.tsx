'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/app/navbar/page';
import Footer from '@/app/footer/page';

interface Restaurant {
  _id: string;
  imgurl: string;
  name: string;
  rating: number;
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const getRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin');
      const data = await response.json();
      setRestaurants(data || []);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />

      <div className="w-full bg-white py-6 shadow-md mb-8">
        <h2 className="text-2xl font-bold px-6 mb-4 text-gray-800">What's on your mind?</h2>
        <div className="flex gap-8 overflow-x-auto no-scrollbar px-6">
          {[
            { label: 'Tiffen', img: 'https://t4.ftcdn.net/jpg/12/85/50/25/240_F_1285502599_jWZ9JXW8Xw2e02KfofD3qxoIlo6s30sO.jpg' },
            { label: 'Sweets', img: 'https://t4.ftcdn.net/jpg/05/26/08/95/240_F_526089509_D0ql8QDQ9KWlqcBypCX9ugXENda1dnZo.jpg' },
            { label: 'Pure Veg', img: 'https://t4.ftcdn.net/jpg/01/15/48/41/240_F_115484118_OFxvDHelhwIRAkNhXIfCZS6Py0eUyWJD.jpg' },
            { label: 'North Indian', img: 'https://t4.ftcdn.net/jpg/08/36/02/45/240_F_836024580_GMq3eGTwA8WS6JeHUP9I6iT2epmNIINx.jpg' },
            { label: 'Desserts', img: 'https://t3.ftcdn.net/jpg/11/40/01/80/240_F_1140018010_IogQ4mK9OczQIQuKJpdDxD6NjKkaOPFP.jpg' },
            { label: 'Juices', img: 'https://t3.ftcdn.net/jpg/10/82/08/26/240_F_1082082667_7SkdwHdHt1t4xEbRIrLCH6K8bCsWNTlM.jpg' },
            { label: 'Fast Food', img: 'https://t4.ftcdn.net/jpg/02/68/50/29/240_F_268502905_IWGrN1kHECsQ3JO50PQtiEDdjtF2oCex.jpg' },
            { label: 'Biryani', img: 'https://t3.ftcdn.net/jpg/06/08/84/24/240_F_608842413_hdYadp6uSC7c7pq6LJew9s8gPnRSgjln.jpg' },
            { label: 'Tandoori', img: 'https://t4.ftcdn.net/jpg/13/35/94/75/240_F_1335947590_4OAYE4nw3zicWt7FDbGiptshXH29EjrJ.jpg' },
            { label: 'Snacks', img: 'https://t3.ftcdn.net/jpg/13/56/25/66/240_F_1356256637_DaBkkJSZ8Lg3cqGTZsU1Z1dRDrIN6d0O.jpg' },
            { label: 'Pizzas', img: 'https://t3.ftcdn.net/jpg/00/27/57/96/240_F_27579652_tM7V4fZBBw8RLmZo0Bi8WhtO2EosTRFD.jpg' },

          ].map((item) => (
            <div key={item.label} className="flex-shrink-0 text-center w-24">
              <img
                src={item.img}
                alt={item.label}
                className="w-20 h-20 object-cover rounded-full border-2 border-orange-400 mx-auto shadow-sm hover:scale-110 transition-transform duration-300"
              />
              <p className="text-sm mt-2 text-gray-800 font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <main className="px-6">
        <h2 className="text-2xl font-bold mb-4 text-orange-600">Popular Restaurants</h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-12 h-12 border-4 border-orange-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((r) => (
              <Link href={`/restraunt/${r._id}`} key={r._id}>
                <div className="bg-white rounded-xl shadow hover:shadow-2xl transition transform hover:scale-105 cursor-pointer">
                  <img
                    src={r.imgurl}
                    alt={r.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{r.name}</h3>
                        <p className="text-sm text-gray-500">Fast Food</p>
                      </div>
                      <span className="bg-green-500 text-white text-sm px-2 py-1 rounded font-semibold">
                        ★ {r.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
