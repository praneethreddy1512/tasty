'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/app/navbar/page';
import Footer from '@/app/footer/page';
import { motion } from 'framer-motion';
import { Trash2, Pencil, Plus, MoreVertical } from 'lucide-react';

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

  const [loading, setLoading] = useState(true);


 const fetchRestaurants = async () => {
  try {
    setLoading(true);
    const res = await axios.get<Restaurant[]>('/api/admin');
    setRestaurants(res.data);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchRestaurants();
  }, []);

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

    try {
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
    } catch (error) {
      console.error("Failed to update restaurant", error);
    }
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
    const updated = foodForms[key];

    if (!updated || !updated.name || !updated.price || !updated.rating || !updated.imgurl) return;

    try {
      await axios.put(`/api/admin/${resId}/menu/${food._id}`, updated);
      setShowUpdateFoodForms((prev) => ({ ...prev, [key]: false }));
      fetchRestaurants();
    } catch (error) {
      console.error("Failed to update food item", error);
    }
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
      <Navbar />
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mb-4"
        >
          {showAddForm ? 'Cancel' : 'Add Restaurant'}
        </motion.button>

        {updateRestaurant && (
          <div className="bg-gray-100 p-4 rounded my-4 max-w-md">
            <h2 className="text-lg font-semibold mb-2">Update Restaurant</h2>
            <input
              value={updateRestaurant.name}
              onChange={(e) => setUpdateRestaurant({ ...updateRestaurant, name: e.target.value })}
              className="w-full mb-2 p-2 border"
              placeholder="Restaurant Name"
            />
            <input
              value={updateRestaurant.rating.toString()}
              onChange={(e) => setUpdateRestaurant({ ...updateRestaurant, rating: parseFloat(e.target.value) })}
              className="w-full mb-2 p-2 border"
              placeholder="Rating"
              type="number"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUpdateImage(e.target.files?.[0] || null)}
              className="w-full mb-2"
            />
            <div className="flex gap-2">
              <button onClick={handleUpdateRestaurant} className="bg-green-500 text-white py-2 w-full rounded">
                Update
              </button>
              <button onClick={() => setUpdateRestaurant(null)} className="bg-red-500 text-white py-2 w-full rounded">
                Cancel
              </button>
            </div>
          </div>

        )}

        {loading ? (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-opacity-100"></div>
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {restaurants.map((res) => (
      <motion.div
              key={res._id}
              className="bg-white border rounded shadow p-3 relative group hover:scale-105 transition-transform"
            >
              <img src={res.imgurl} alt={res.name} className="w-full h-48 object-cover rounded mb-2" />
              <h3 className="text-lg font-semibold">{res.name}</h3>
              <p className='bg-green-700 text-white w-15 rounded'>⭐ {res.rating}</p>

              <div className="absolute top-2 right-2 hidden group-hover:flex flex-col gap-1 bg-white p-2 rounded shadow z-10">
                <button onClick={() => { setUpdateRestaurant(res); setUpdateImage(null); }}><Pencil className="text-orange-500 hover:scale-110" /></button>
                <button onClick={() => handleDeleteRestaurant(res._id)}><Trash2 className="text-red-500 hover:scale-110" /></button>
                <button onClick={() => setShowFoodForms((prev) => ({ ...prev, [res._id]: !prev[res._id] }))}><Plus className="text-blue-500 hover:scale-110" /></button>
              </div>
              <MoreVertical className="absolute top-2 right-2 group-hover:hidden text-gray-500" />

              <button className="mt-2 bg-orange-500 hover:bg-transparent hover:text-orange-500 border border-orange-500 text-white py-1 px-3 rounded" onClick={() => setMenuVisible(menuVisible === res._id ? null : res._id)}>
                {menuVisible === res._id ? 'Hide Menu' : 'Menu'}
              </button>

              {showFoodForms[res._id] && (
                <div className="mt-2">
                  <input placeholder="Food Name" className="w-full p-1 mb-1 border" onChange={(e) => setFoodForms((prev) => ({ ...prev, [res._id]: { ...prev[res._id], name: e.target.value } }))} />
                  <input placeholder="Price" type="number" className="w-full p-1 mb-1 border" onChange={(e) => setFoodForms((prev) => ({ ...prev, [res._id]: { ...prev[res._id], price: parseFloat(e.target.value) } }))} />
                  <input placeholder="Rating" type="number" className="w-full p-1 mb-1 border" onChange={(e) => setFoodForms((prev) => ({ ...prev, [res._id]: { ...prev[res._id], rating: parseFloat(e.target.value) } }))} />
                  <input type="file" accept="image/*" className="w-full mb-1" onChange={(e) => handleFoodImageChange(e, res._id)} />
                  <button onClick={() => handleAddFood(res._id)} className="bg-green-500 text-white py-1 px-3 rounded w-full">Add Food</button>
                </div>
              )}

              {menuVisible === res._id && res.menu.length > 0 && (
                <div className="mt-3 text-sm">
                  {res.menu.map((food) => {
                    const key = `${res._id}-${food._id}`;
                    const defaultFood = foodForms[key] || food;

                    return (
                      <motion.div
                        key={food._id}
                        className="mb-1 bg-gray-50 p-2 rounded hover:bg-gray-100"
                      >
                        <div className="flex justify-between items-center">
                          <span>{food.name} - ₹{food.price} ⭐{food.rating}</span>
                          <div className="flex gap-2">
                            <button onClick={() => {
                              setFoodForms((prev) => ({
                                ...prev,
                                [key]: {
                                  name: food.name,
                                  price: food.price,
                                  rating: food.rating,
                                  imgurl: food.imgurl,
                                }
                              }));
                              setShowUpdateFoodForms((prev) => ({ ...prev, [key]: true }));
                            }}><Pencil className="text-blue-500 hover:scale-110" /></button>
                            <button onClick={() => handleDeleteFood(res._id, food._id)}><Trash2 className="text-red-500 hover:scale-110" /></button>
                          </div>
                        </div>
                        {showUpdateFoodForms[key] && (
                          <div className="bg-gray-100 p-2 rounded mt-1">
                            <input value={defaultFood.name} placeholder="Name" className="w-full p-1 mb-1 border" onChange={(e) => setFoodForms((prev) => ({ ...prev, [key]: { ...prev[key], name: e.target.value } }))} />
                            <input value={defaultFood.price} type="number" placeholder="Price" className="w-full p-1 mb-1 border" onChange={(e) => setFoodForms((prev) => ({ ...prev, [key]: { ...prev[key], price: parseFloat(e.target.value) } }))} />
                            <input value={defaultFood.rating} type="number" placeholder="Rating" className="w-full p-1 mb-1 border" onChange={(e) => setFoodForms((prev) => ({ ...prev, [key]: { ...prev[key], rating: parseFloat(e.target.value) } }))} />
                            <input type="file" accept="image/*" className="w-full mb-1" onChange={(e) => handleFoodImageChange(e, res._id, food._id)} />
                            <button onClick={() => handleUpdateFood(res._id, food)} className="bg-green-500 text-white py-1 px-3 rounded w-full">Save</button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>     
    ))}
  </div>
)}      
      </div>
      <Footer />
    </>
  );
}


