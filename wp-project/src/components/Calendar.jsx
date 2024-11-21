import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import Day from './Day';
import { useAuth } from '../hooks/useAuth';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysWithImages, setDaysWithImages] = useState({});
  const { token } = useAuth();

  // Fetch images for the current month
  useEffect(() => {
    const fetchMonthImages = async () => {
      try {
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const response = await axios.get('/api/days/images/all', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Create a map of dates to their first image
        const imageMap = response.data.reduce((acc, day) => {
          if (day.images.length > 0) {
            // Format date to YYYY-MM-DD for consistent comparison
            const dateKey = day.date.split('T')[0];
            acc[dateKey] = day.images[0];
          }
          return acc;
        }, {});

        setDaysWithImages(imageMap);
      } catch (error) {
        console.error('Error fetching month images:', error);
      }
    };

    fetchMonthImages();
  }, [currentDate, token]);

  const getDaysInMonth = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const days = [];
    
    // Previous month's days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }

    // Next month's days - only add enough to complete the row
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {  // Only add if we need to complete the last row
      for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(year, month + 1, day);
        days.push({ date, isCurrentMonth: false });
      }
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const renderDays = () => {
    const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    return days;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-2 text-center font-medium text-gray-600">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mt-4">
        {renderDays().map(({ date, isCurrentMonth }) => {
          const dateKey = date.toISOString().split('T')[0];
          const dayImage = daysWithImages[dateKey];
          
          return (
            <Day
              key={date.toISOString()}
              date={date}
              isCurrentMonth={isCurrentMonth}
              hasContent={!!dayImage}
              imageUrl={dayImage?.url}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
