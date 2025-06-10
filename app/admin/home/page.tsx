'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/app/navbar/page';
import Footer from '@/app/footer/page';
import { Trash2, Pencil, Plus, MoreVertical } from 'lucide-react';
import AdminNavbar from '../adminnavbar/page';

interface Food {
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
  menu: Food[];
}

export default function AdminHome() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', imgurl: '', rating: '' });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [foodForms, setFoodForms] = useState<{ [key: string]: Food }>({});
  const [showFoodForms, setShowFoodForms] = useState<{ [key: string]: boolean }>({});
  const [showUpdateFoodForms, setShowUpdateFoodForms] = useState<{ [key: string]: boolean }>({});

  const [updateRestaurant, setUpdateRestaurant] = useState<Restaurant | null>(null);
  const [updateImage, setUpdateImage] = useState<File | null>(null);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    const res = await axios.get<Restaurant[]>('/api/admin');
    setRestaurants(res.data);
  };

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });

  const handleAddRestaurant = async () => {
    if (!addForm.name || !addForm.rating || !selectedImage) return alert("Fill all fields");
    const imgurl = await convertToBase64(selectedImage);

    await axios.post('/api/admin', {
      name: addForm.name,
      imgurl,
      rating: parseFloat(addForm.rating),
    });
    setAddForm({ name: '', imgurl: '', rating: '' });
    setSelectedImage(null);
    setShowAddForm(false);
    fetchRestaurants();
  };

  const handleDeleteRestaurant = async (id: string) => {
    if (confirm("Delete this restaurant?")) {
      await axios.delete(`/api/admin/${id}`);
      fetchRestaurants();
    }
  };

  const handleUpdateRestaurant = async () => {
    if (!updateRestaurant) return;

    let imgurl = updateRestaurant.imgurl;
    if (updateImage) imgurl = await convertToBase64(updateImage);

    await axios.put(`/api/admin/${updateRestaurant._id}`, {
      name: updateRestaurant.name,
      imgurl,
      rating: parseFloat(updateRestaurant.rating.toString()),
    });

    setUpdateRestaurant(null);
    setUpdateImage(null);
    fetchRestaurants();
  };

  const handleAddFood = async (resId: string) => {
    const food = foodForms[resId];
    if (!food || !food.name || !food.price || !food.rating || !food.imgurl) return;

    await axios.post(`/api/admin/${resId}/menu`, food);
    setFoodForms((prev) => ({ ...prev, [resId]: { name: '', price: 0, rating: 0, imgurl: '' } }));
    setShowFoodForms((prev) => ({ ...prev, [resId]: false }));
    fetchRestaurants();
  };

  const handleUpdateFood = async (resId: string, food: Food) => {
    const key = `${resId}-${food._id}`;
    const updated = { ...foodForms[key], _id: food._id };
    await axios.put(`/api/admin/${resId}/menu/${food._id}`, updated);
    setShowUpdateFoodForms((prev) => ({ ...prev, [key]: false }));
    fetchRestaurants();
  };

  const handleDeleteFood = async (resId: string, foodId?: string) => {
    if (foodId && confirm("Delete this food item?")) {
      await axios.delete(`/api/admin/${resId}/menu/${foodId}`);
      fetchRestaurants();
    }
  };

  const handleFoodImageChange = async (e: React.ChangeEvent<HTMLInputElement>, resId: string, foodId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const imgurl = await convertToBase64(file);
      const key = foodId ? `${resId}-${foodId}` : resId;
      setFoodForms((prev) => ({ ...prev, [key]: { ...prev[key], imgurl } }));
    }
  };

  return (
    <>
      <AdminNavbar/>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
        >
          {showAddForm ? 'Cancel' : 'Add Restaurant'}
        </button>

        {showAddForm && (
          <div className="bg-gray-100 p-4 rounded mb-4 max-w-md">
            <input placeholder="Name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} className="w-full mb-2 p-2 border rounded" />
            <input placeholder="Rating" value={addForm.rating} onChange={(e) => setAddForm({ ...addForm, rating: e.target.value })} className="w-full mb-2 p-2 border rounded" />
            <input type="file" accept="image/*" onChange={(e) => setSelectedImage(e.target.files?.[0] || null)} className="w-full mb-2" />
            <button onClick={handleAddRestaurant} className="bg-green-500 text-white py-2 w-full rounded">Submit</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {restaurants.map((res) => (
            <div key={res._id} className="bg-white border rounded-xl shadow p-4 group relative transition-transform hover:scale-[1.02]">
              <img src={res.imgurl} alt={res.name} className="w-full h-48 object-cover rounded mb-3" />
              <h3 className="text-xl font-semibold">{res.name}</h3>
              <p className="text-gray-600 mb-2">⭐ {res.rating}</p>

              <div className="absolute top-3 right-3">
                <div className="hidden group-hover:flex flex-col bg-white p-2 rounded shadow space-y-2">
                  <button onClick={() => { setUpdateRestaurant(res); setUpdateImage(null); }}><Pencil className="text-orange-500 hover:scale-110" /></button>
                  <button onClick={() => handleDeleteRestaurant(res._id)}><Trash2 className="text-red-500 hover:scale-110" /></button>
                  <button onClick={() => setShowFoodForms((prev) => ({ ...prev, [res._id]: !prev[res._id] }))}><Plus className="text-blue-500 hover:scale-110" /></button>
                </div>
                <MoreVertical className="text-gray-400 group-hover:hidden" />
              </div>

              <button
                onClick={() => setMenuVisible(menuVisible === res._id ? null : res._id)}
                className="mt-3 bg-orange-500 hover:bg-transparent hover:text-orange-500 border border-orange-500 text-white px-4 py-1 rounded transition"
              >
                {menuVisible === res._id ? 'Hide Menu' : 'Menu'}
              </button>

              {showFoodForms[res._id] && (
                <div className="mt-3">
                  <input placeholder="Food Name" className="w-full p-2 mb-2 border rounded" onChange={(e) => setFoodForms((prev) => ({ ...prev, [res._id]: { ...prev[res._id], name: e.target.value } }))} />
                  <input placeholder="Price" type="number" className="w-full p-2 mb-2 border rounded" onChange={(e) => setFoodForms((prev) => ({ ...prev, [res._id]: { ...prev[res._id], price: parseFloat(e.target.value) } }))} />
                  <input placeholder="Rating" type="number" className="w-full p-2 mb-2 border rounded" onChange={(e) => setFoodForms((prev) => ({ ...prev, [res._id]: { ...prev[res._id], rating: parseFloat(e.target.value) } }))} />
                  <input type="file" accept="image/*" className="w-full mb-2" onChange={(e) => handleFoodImageChange(e, res._id)} />
                  <button onClick={() => handleAddFood(res._id)} className="bg-green-500 text-white w-full py-2 rounded">Add Food</button>
                </div>
              )}

              {menuVisible === res._id && res.menu.length > 0 && (
                <div className="mt-4 space-y-3 text-sm">
                  {res.menu.map((food) => {
                    const key = `${res._id}-${food._id}`;
                    return (
                      <div key={food._id} className="border p-2 rounded">
                        <div className="flex justify-between items-center">
                          <span>{food.name} - ₹{food.price} ⭐{food.rating}</span>
                          <div className="flex gap-2">
                            <button onClick={() => {
                              setFoodForms((prev) => ({ ...prev, [key]: food }));
                              setShowUpdateFoodForms((prev) => ({ ...prev, [key]: true }));
                            }}><Pencil className="text-blue-500 hover:scale-110" /></button>
                            <button onClick={() => handleDeleteFood(res._id, food._id)}><Trash2 className="text-red-500 hover:scale-110" /></button>
                          </div>
                        </div>
                        {showUpdateFoodForms[key] && (
                          <div className="mt-2">
                            <input value={foodForms[key]?.name || ''} placeholder="Name" className="w-full p-1 mb-1 border rounded" onChange={(e) => setFoodForms((prev) => ({ ...prev, [key]: { ...prev[key], name: e.target.value } }))} />
                            <input value={foodForms[key]?.price || ''} type="number" placeholder="Price" className="w-full p-1 mb-1 border rounded" onChange={(e) => setFoodForms((prev) => ({ ...prev, [key]: { ...prev[key], price: parseFloat(e.target.value) } }))} />
                            <input value={foodForms[key]?.rating || ''} type="number" placeholder="Rating" className="w-full p-1 mb-1 border rounded" onChange={(e) => setFoodForms((prev) => ({ ...prev, [key]: { ...prev[key], rating: parseFloat(e.target.value) } }))} />
                            <input type="file" accept="image/*" className="w-full mb-1" onChange={(e) => handleFoodImageChange(e, res._id, food._id)} />
                            <button onClick={() => handleUpdateFood(res._id, food)} className="bg-green-500 text-white py-1 px-3 rounded w-full">Save</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
