import React from 'react';
import { Star } from 'lucide-react';

const CourseCard = ({ course, onClick }) => {
  // Mock data if some fields are missing
  const {
    title,
    instructorName = "Unknown Instructor",
    rating = 4.5,
    ratingCount = 120,
    price,
    imageUrl = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category,
    bestseller
  } = course;

  return (
    <div 
      onClick={onClick}
      className="group flex flex-col bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden cursor-pointer h-full"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {bestseller && (
           <span className="absolute top-2 left-2 bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded shadow-sm">
             Bestseller
           </span>
        )}
      </div>
      
      <div className="flex flex-col flex-grow p-4">
        <h3 className="font-bold text-gray-900 leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{instructorName}</p>
        
        <div className="flex items-center mb-2 gap-1">
          <span className="font-bold text-sm text-yellow-600">{rating}</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">({ratingCount})</span>
        </div>

        <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <span className="font-bold text-gray-900">₹{price}</span>
             {/* <span className="text-sm text-gray-400 line-through">₹{price * 2}</span> */}
           </div>
           {category && (
             <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
               {category}
             </span>
           )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
