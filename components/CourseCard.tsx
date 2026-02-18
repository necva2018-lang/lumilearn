import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Star, Eye } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link to={`/course/${course.id}`} className="group block h-full">
      <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        {/* Thumbnail Image */}
        <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-slate-700">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700 dark:text-slate-200 shadow-sm">
            {course.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 leading-snug mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
            {course.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-4">
            <img src={course.instructor.avatar} alt={course.instructor.name} className="w-6 h-6 rounded-full" />
            <span className="text-sm text-gray-500 dark:text-slate-400">{course.instructor.name}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 mt-auto pt-4 border-t border-gray-50 dark:border-slate-700">
             <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-3 w-3 fill-current" />
                    {course.rating}
                </span>
                <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {course.students}
                </span>
                <span className="flex items-center gap-1" title="觀看次數">
                    <Eye className="h-3 w-3" />
                    {course.views.toLocaleString()}
                </span>
             </div>
             <div className="flex flex-col items-end">
                {course.price === 0 ? (
                    <span className="text-teal-600 dark:text-teal-400 font-bold">免費</span>
                ) : (
                    <div className="text-right">
                        {course.originalPrice > course.price && (
                             <span className="text-gray-400 dark:text-slate-500 line-through mr-1">${course.originalPrice}</span>
                        )}
                        <span className="text-gray-900 dark:text-slate-100 font-bold">${course.price}</span>
                    </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;