'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/navbar/page';
import Footer from '@/app/footer/page';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imgurl: string;
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (err) {
        console.error('Error parsing cart:', err);
      }
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const increaseQuantity = (id: string) => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updated);
  };

  const decreaseQuantity = (id: string) => {
    const updated = cart
      .map(item =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter(item => item.quantity > 0);
    updateCart(updated);
  };

  const handlePlaceOrder = () => {
    
    router.push('/user/payment');
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
    <Navbar/>
    <div className="p-6 bg-white">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2762/2762885.png"
            alt="No Orders"
            width={300}
            height={300}
          />
          <h2 className="text-2xl font-semibold mt-4">No Orders Yet!</h2>
          <p className="text-gray-600 mt-2">
            Your cart is empty. Add something from the menu.
          </p>
          <Link href="/user/home">
            <button className="mt-4 px-5 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
              Order Now
            </button>
          </Link>
        </div>
      ) : (
        <>
        {cart.map(item => (
  <div
    key={item.id}
    className="flex justify-between items-center gap-4 mb-6 p-4 border rounded"
  >
    <div className="flex items-center gap-4 flex-1">
      <img
        src={item.imgurl}
        alt={item.name}
        className="w-24 h-24 object-cover rounded"
      />
      <div>
        <h2 className="text-xl font-semibold">{item.name}</h2>
        <p>₹{item.price} each</p>
      </div>
    </div>

    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => decreaseQuantity(item.id)}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          -
        </button>
        <span className="text-lg font-semibold">{item.quantity}</span>
        <button
          onClick={() => increaseQuantity(item.id)}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          +
        </button>
      </div>
      <p className="text-right">Subtotal: ₹{item.price * item.quantity}</p>
    </div>
  </div>
))}

<div className="flex justify-end">
  <div className="text-right">
    <hr className="my-4" />
    <h2 className="text-2xl font-bold">Total: ₹{total}</h2>
    <button
      onClick={handlePlaceOrder}
      className="bg-amber-600 text-white rounded-md px-6 py-2 mt-2"
    >
      Place Order
    </button>
  </div>
</div>
        </>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default Cart;
