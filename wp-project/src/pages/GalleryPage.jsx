// src/pages/GalleryPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';

axios.defaults.withCredentials = true;

function GalleryPage() {
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchImages = async () => {
      if (!token) return;

      const axiosConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      };

      try {
        const response = await axios.get('http://localhost:5000/api/days/images/all', axiosConfig);
        console.log('API Response:', response.data);
        
        const groupedImages = groupImagesByMonth(response.data);
        setImages(groupedImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [token]);

  const groupImagesByMonth = (data) => {
    return data.reduce((acc, day) => {
      const monthYear = format(new Date(day.date), 'MMMM yyyy');
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(...day.images.map(img => ({
        ...img,
        date: day.date
      })));
      return acc;
    }, {});
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Gallery</h1>
      {Object.entries(images).map(([monthYear, monthImages]) => (
        <div key={monthYear} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">{monthYear}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {monthImages.map((image) => (
              <div 
                key={image._id} 
                className="aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
              >
                <img
                  src={image.url}
                  alt={image.caption || "Gallery image"}
                  className="w-full h-full object-cover"
                  crossOrigin="use-credentials"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default GalleryPage;