'use client';

import Navbar from '@/app/navbar/page';
import Footer from '@/app/footer/page';
import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';

interface MenuItem {
  _id?: string;
  name: string;
  price: number;
  rating: number;
  imgurl: string;
}

interface Restaurant {
  _id: string;
  name: string;
  imgurl: string;
  rating: number;
  menu: MenuItem[];
}

interface CartItem extends MenuItem {
  id: string;
  quantity: number;
}

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

export default function RestaurantPage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<Restaurant | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`/api/admin/${id}/menu`);
        if (!res.ok) {
          throw new Error('Restaurant not found');
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Error loading restaurant:', err);
      }
    };

    fetchRestaurant();
  }, [id]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[];
    setCartItems(savedCart);
  }, []);

  const addToCart = (item: MenuItem) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[];
    const index = existingCart.findIndex(cartItem => cartItem.name === item.name);

    if (index !== -1) {
      existingCart[index].quantity += 1;
    } else {
      existingCart.push({
        ...item,
        id: generateId(),
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCartItems(existingCart);
  };

  const isInCart = (name: string) => {
    return cartItems.some(cartItem => cartItem.name === name);
  };

  if (!data) return <div className="text-center p-10">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-4xl font-bold text-center mb-4">{data.name}</h1>
        <p className="text-center text-gray-500 mb-2">Rating: ⭐ {data.rating}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.menu.map((item, index) => (
            <div key={index} className="border rounded-2xl overflow-hidden shadow-md">
              <img src={item.imgurl} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500">₹ {item.price}.00</p>
                <p className="text-yellow-500 mt-1">⭐ {item.rating}</p>
                <button
                  onClick={() => addToCart(item)}
                  className={`mt-3 px-4 py-2 rounded text-white ${
                    isInCart(item.name)
                      ? 'bg-green-500 cursor-default'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  disabled={isInCart(item.name)}
                >
                  {isInCart(item.name) ? 'Added ✅' : 'Add To Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
