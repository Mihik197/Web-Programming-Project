import React from 'react';
import { useNavigate } from 'react-router-dom';

const CalendarDay = ({ date, isCurrentMonth, hasContent, imageUrl }) => {
  const navigate = useNavigate();
  const day = date.getDate();
  const isToday = new Date().toDateString() === date.toDateString();

  const handleClick = () => {
    const formattedDate = date.getFullYear() + '-' + 
      String(date.getMonth() + 1).padStart(2, '0') + '-' + 
      String(date.getDate()).padStart(2, '0');
    navigate(`/app/day/${formattedDate}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`aspect-square relative overflow-hidden rounded-lg border transition cursor-pointer
        ${isCurrentMonth ? 'bg-[#F0FFFF] hover:bg-[#7DF9FF]' : 'bg-[#89CFF0]/30'} 
        ${isToday ? 'ring-2 ring-[#00FFFF]' : ''}`}
    >
      {/* Day Number - absolute positioned with semi-transparent background */}
      <div className="absolute top-1 left-2 z-10 text-sm font-medium 
        bg-white/50 rounded-full px-1.5 py-0.5 shadow-sm">
        {day}
      </div>

      {/* Thumbnail Image - fills entire block */}
      {hasContent && imageUrl && (
        <div className="absolute inset-0 w-full h-full">
          <img
            src={imageUrl}
            alt={`Preview for ${date.toDateString()}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/50';
              e.target.onerror = null;
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarDay;
