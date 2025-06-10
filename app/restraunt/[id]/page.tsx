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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`/api/admin/${id}/menu`);
        if (!res.ok) throw new Error('Restaurant not found');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Error loading restaurant:', err);
      } finally {
        setLoading(false);
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
      existingCart.push({ ...item, id: generateId(), quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCartItems(existingCart);

    window.dispatchEvent(new Event('cart-updated'));

  };

  const isInCart = (name: string) => cartItems.some(cartItem => cartItem.name === name);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <img
          src="data:image/png;base64,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" 
          alt="Loading"
          className="w-24 h-24 mb-4"
        />
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-b-4 border-solid"></div>
        <p className="text-lg font-semibold text-gray-600 mt-4">Loading Menu...</p>
      </div>
    );
  }

  if (!data) return notFound();

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-4xl font-bold text-center mb-2">{data.name}</h1>
        <p className="text-center text-gray-500 mb-6">Rating: ⭐ {data.rating}</p>

        {data.menu.length === 0 ? (
          <div className="text-center mt-12">
            <p className="text-2xl font-semibold text-gray-600">🍽️ No Menu Items Available</p>
            <p className="text-gray-400 mt-2">This restaurant hasn’t added any food items yet.</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-8">
            {data.menu.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-start border-b pb-6"
              >
                <div className="flex-1 pr-4">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-700 font-medium mt-1">₹{item.price}</p>
                  <p className="text-white text-sm mt-1 p-1 rounded w-15 bg-green-700">⭐ {item.rating}</p>
                </div>

                <div className="relative w-36 flex flex-col items-center">
                  <img
                    src={item.imgurl}
                    alt={item.name}
                    className="w-32 h-24 rounded-md object-cover"
                  />
                  <button
                    onClick={() => addToCart(item)}
                    disabled={isInCart(item.name)}
                    className={`mt-2 px-5 py-1 text-white text-sm rounded-lg font-semibold ${
                      isInCart(item.name)
                        ? 'bg-green-500 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    {isInCart(item.name) ? 'Added ' : 'ADD'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
