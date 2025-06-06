'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '@/app/footer/page';
import Navbar from '@/app/navbar/page';

interface Food {
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
  menu: Food[];
}

export default function AdminHome() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', imgurl: '', rating: '' });

  const fetchRestaurants = async () => {
    const res = await axios.get<Restaurant[]>('/api/admin');
    setRestaurants(res.data);
  };

  const handleAddRestaurant = async () => {
    await axios.post('/api/admin', {
      name: form.name,
      imgurl: form.imgurl,
      rating: parseFloat(form.rating),
    });
    setForm({ name: '', imgurl: '', rating: '' });
    setShowForm(false);
    fetchRestaurants();
  };

  const handleAddFood = async (id: string) => {
    const name = prompt("Food name:");
    const price = prompt("Price:");
    const rating = prompt("Rating:");
    const imgurl = prompt("Image URL:");

    if (name && price && rating && imgurl) {
      await axios.post(`/api/admin/${id}/menu`, {
        name,
        price: parseFloat(price),
        rating: parseFloat(rating),
        imgurl,
      });
      fetchRestaurants();
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <>
    <Navbar/>
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Admin Dashboard</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        {showForm ? 'Close' : 'Add Restaurant'}
      </button>

      {showForm && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '30px',
            maxWidth: '400px',
          }}
        >
          <input
            placeholder="Restaurant Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input
            placeholder="Image URL"
            value={form.imgurl}
            onChange={(e) => setForm({ ...form, imgurl: e.target.value })}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input
            placeholder="Rating"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button
            onClick={handleAddRestaurant}
            style={{
              padding: '8px 16px',
              backgroundColor: 'green',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        {restaurants.map((res) => (
          <div
            key={res._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              background: '#fff',
            }}
          >
            <img src={res.imgurl} alt={res.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
            <div style={{ padding: '12px' }}>
              <h3 style={{ margin: '0 0 4px' }}>{res.name}</h3>
              <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#555' }}>Fast Food</p>
              <p style={{ fontSize: '14px', marginBottom: '8px' }}>
                ⭐ {res.rating} <span style={{ color: '#888' }}>(user ratings)</span>
              </p>
              <button
                onClick={() => handleAddFood(res._id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Add Food Item
              </button>

              {res.menu.length > 0 && (
                <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                  {res.menu.map((food, idx) => (
                    <li key={idx} style={{ fontSize: '13px' }}>
                      🍽️ {food.name} - ₹{food.price} ⭐{food.rating}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
}
