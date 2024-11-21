import React from 'react';
import { useNavigate } from 'react-router-dom';

const CalendarDay = ({ date, isCurrentMonth, hasContent }) => {
  const navigate = useNavigate();
  const day = date.getDate();
  const isToday = new Date().toDateString() === date.toDateString();

  const handleClick = () => {
    // Format date as YYYY-MM-DD for URL
    const formattedDate = date.toISOString().split('T')[0];
    navigate(`/app/day/${formattedDate}`); // Updated path
  };

  return (
    <div
      onClick={handleClick}
      className={`aspect-square p-2 rounded-lg border transition cursor-pointer
      ${isCurrentMonth ? 'bg-[#F0FFFF] hover:bg-[#7DF9FF]' : 'bg-[#89CFF0]/30'} 
      ${isToday ? 'ring-2 ring-[#00FFFF]' : ''}`}
    >
      {/* Day Number - keeping black for readability */}
      <div className="text-sm font-medium text-black">{day}</div>

      {/* Thumbnail Image */}
      {hasContent && (
        <img
          src="/path/to/thumbnail.jpg"
          alt={`Content for ${day}`}
          className="w-full h-full object-cover rounded-md mt-2"
        />
      )}
    </div>
  );
};

export default CalendarDay;
