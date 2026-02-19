import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import CourseCard from '../components/CourseCard';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHeroCover } from '../contexts/HeroCoverContext';
import { useShare } from '../contexts/ShareContext';

interface HomePageProps {
  courses: Course[];
}

const DEFAULT_CATEGORIES = ['程式開發', '設計', '商業', '攝影', '語言', '生活風格'];

const HomePage: React.FC<HomePageProps> = ({ courses }) => {
  const { config: hero } = useHeroCover();
  const { isViewOnly } = useShare();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 分類：全部 + 預設 + 課程中出現的其餘（去重）
  const courseCategories = [...new Set(courses.map(c => c.category).filter(Boolean))];
  const allCategories = [...new Set(['全部', ...DEFAULT_CATEGORIES, ...courseCategories])];

  const filteredCourses = selectedCategory && selectedCategory !== '全部'
    ? courses.filter(c => c.category === selectedCategory)
    : courses;

  // Select top 5 courses for the carousel (use filtered for consistency when a category is selected)
  const featuredCourses = filteredCourses.slice(0, 5);

  useEffect(() => {
    if (featuredCourses.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredCourses.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [featuredCourses.length]);

  // Reset slide when category changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [selectedCategory]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredCourses.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredCourses.length) % featuredCourses.length);
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Text Content */}
          <div className="flex-1 max-w-2xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold uppercase tracking-wide mb-6">
              <Sparkles className="h-3 w-3" />
              {hero.badgeText}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight leading-tight mb-6">
              {hero.headlinePrefix}
              <br/>
              <span className="text-teal-600 dark:text-teal-400">{hero.headlineHighlight}</span>
              {hero.headlineSuffix}
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-300 mb-8 leading-relaxed max-w-lg">
              {hero.description}
            </p>
            <div className="flex gap-4">
              <Link to="/explore" className="bg-teal-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">
                {hero.primaryButtonText}
              </Link>
              {!isViewOnly && (
                <Link to="/create-course" className="bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  {hero.secondaryButtonText}
                </Link>
              )}
            </div>
          </div>

          {/* Right Carousel Content */}
          <div className="flex-1 w-full md:w-auto hidden md:block relative">
             {/* Decorative Background Blobs */}
             <div className="absolute top-10 right-10 w-72 h-72 bg-purple-200 rounded-full filter blur-3xl opacity-30 -z-10 animate-pulse"></div>
             <div className="absolute bottom-10 left-10 w-72 h-72 bg-teal-200 rounded-full filter blur-3xl opacity-30 -z-10"></div>
             
             {/* Carousel Container */}
             <div className="relative w-full aspect-[16/10] rounded-2xl shadow-2xl border-4 border-white dark:border-slate-700 overflow-hidden bg-gray-100 dark:bg-slate-800 group">
                {featuredCourses.length > 0 ? (
                  featuredCourses.map((course, index) => (
                    <div 
                      key={course.id}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      {/* Image */}
                      <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Dark Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>
                      
                      {/* Course Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 text-white">
                        <div className="inline-block px-2 py-1 bg-teal-600 text-xs font-bold rounded mb-2">
                          {course.category}
                        </div>
                        <h3 className="text-xl font-bold leading-tight mb-1 line-clamp-1 drop-shadow-md">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-200">
                          <img src={course.instructor.avatar} alt="" className="w-5 h-5 rounded-full border border-white/50" />
                          <span>{course.instructor.name}</span>
                        </div>
                      </div>
                      
                      {/* Full Click Link Overlay */}
                      <Link to={`/course/${course.id}`} className="absolute inset-0 z-20" aria-label={`View course: ${course.title}`} />
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500">
                    尚無課程
                  </div>
                )}

                {/* Navigation Arrows (Visible on Hover) */}
                <button 
                  onClick={(e) => { e.preventDefault(); prevSlide(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); nextSlide(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Dots Indicators */}
                <div className="absolute bottom-4 right-4 z-30 flex gap-1.5">
                  {featuredCourses.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === currentSlide ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
           <div>
             <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">熱門課程</h2>
             <p className="text-gray-500 dark:text-slate-400 mt-1">探索我們講師評價最高的內容。</p>
           </div>
           <Link to="/explore" className="text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-700 dark:hover:text-teal-300 hidden sm:block">查看全部 &rarr;</Link>
        </div>

        {/* 分類篩選 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allCategories.map(cat => {
            const isActive = (selectedCategory === null && cat === '全部') || selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === '全部' ? null : cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600 hover:border-teal-300 dark:hover:border-teal-600 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="h-full">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;