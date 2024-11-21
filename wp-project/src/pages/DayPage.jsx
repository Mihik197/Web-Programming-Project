import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

const DayPage = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  const getImageUrl = (imageId) => {
    return axios.get(`/api/days/${date}/images/${imageId}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    })
    .then(response => URL.createObjectURL(response.data));
  };

  useEffect(() => {
    const fetchDay = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/days/${date}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const imagesWithUrls = await Promise.all(
          response.data.images.map(async (image) => {
            const imageUrl = await getImageUrl(image._id);
            return { ...image, url: imageUrl };
          })
        );
        
        setImages(imagesWithUrls);
        setNotes(response.data.notes || '');
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load day data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDay();
    
    // Cleanup function
    return () => {
      images.forEach(image => {
        if (image.url) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [date, token]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post(
          `/api/days/${date}/images`,
          formData,
          {
            headers: { 
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        );

        setImages(prev => [...prev, response.data]);
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await axios.delete(`/api/days/${date}/images/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state by filtering out the deleted image
      setImages(prevImages => prevImages.filter(img => img._id !== imageId));
      toast.success('Image deleted successfully');

    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleBack = () => {
    navigate('/app'); // Navigate back to Calendar
    // Alternatively, use navigate(-1) to go back in history
  };

  const saveNotes = async (newNotes) => {
    try {
      await axios.patch(`/api/days/${date}/notes`, 
        { notes: newNotes },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      toast.success('Notes saved');
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (notes) {
        saveNotes(notes);
      }
    }, 1000); // Save after 1 second of no typing

    return () => clearTimeout(timeoutId);
  }, [notes]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => navigate('/app')}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        &larr; Back to Calendar
      </button>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h1>

          {/* Images Section */}
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
                <div key={image._id} className="relative aspect-square">
                  <img
                    src={image.url}
                    alt={image.caption || 'Uploaded'}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleDeleteImage(image._id)}
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              // Implement saving notes logic
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DayPage;