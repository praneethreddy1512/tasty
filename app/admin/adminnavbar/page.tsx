'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, ShoppingCart, LogOut } from 'lucide-react';

const AdminNavbar = () => {
  const [cartQuantity, setCartQuantity] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const updateCartQuantity = () => {
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalQty = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartQuantity(totalQty);

      if (totalQty > 0) {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 500);
      }
    };

    updateCartQuantity() ;
    window.addEventListener('cart-updated', updateCartQuantity);

    return () => {
      window.removeEventListener('cart-updated', updateCartQuantity);
    };
  }, []);

  return (
    <header className="bg-white px-6 py-4 shadow-2xl flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <img
          src="data:image/png;base64,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"
          alt="Logo"
          className="h-10 w-10"
        />
        <h1 className="text-orange-500 font-bold text-2xl">Tasty Kitchens</h1>
      </div>

      <nav className="flex items-center gap-6 relative">
        <Link href="/admin/home" className="text-gray-700 hover:text-orange-500 transition duration-200">
          <Home className="w-6 h-6" />
        </Link>

       

        <Link href="/admin/signin">
          <button className="border p-2 rounded text-white bg-orange-500 hover:text-orange-500 hover:bg-white transition duration-200">
            <LogOut className="w-5 h-5" />
          </button>
        </Link>
      </nav>
    </header>
  );
};

export default AdminNavbar;
