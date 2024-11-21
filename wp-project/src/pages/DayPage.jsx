import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { X } from 'lucide-react'; // For delete icon

const DayPage = () => {
  const { date } = useParams();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages(prev => [...prev, {
            id: Date.now(),
            url: e.target.result,
            file: file
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDeleteImage = (id) => {
    setImages(prev => prev.filter(image => image.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{formattedDate}</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Photos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Upload Button */}
          <div 
            onClick={() => fileInputRef.current.click()}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500"
          >
            <span className="text-gray-500">+ Add Photos</span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Image Previews */}
          {images.map(image => (
            <div key={image.id} className="relative aspect-square">
              <img
                src={image.url}
                alt="uploaded preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => handleDeleteImage(image.id)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notes Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Notes</h2>
        <textarea
          className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Write about your day..."
        />
      </div>
    </div>
  );
};

export default DayPage;