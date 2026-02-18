import React, { useState, useMemo } from 'react';
import { Course } from '../types';
import CourseCard from '../components/CourseCard';
import { Search, Compass, Filter } from 'lucide-react';

interface ExplorePageProps {
  courses: Course[];
}

const LEVELS = ['全部', '入門', '中階', '進階'];

const ExplorePage: React.FC<ExplorePageProps> = ({ courses }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedLevel, setSelectedLevel] = useState('全部');

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(courses.map(c => c.category)));
    return ['全部', ...uniqueCats];
  }, [courses]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === '全部' || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('全部');
    setSelectedLevel('全部');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-lg">
               <Compass className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">探索課程</h1>
          </div>
          <p className="text-gray-600 dark:text-slate-300 max-w-2xl">
            瀏覽我們所有的線上課程。使用分類導航按鈕快速篩選您感興趣的主題。
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters Container */}
        <div className="space-y-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500" />
                    <input
                    type="text"
                    placeholder="搜尋課程標題或關鍵字..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-800 dark:text-slate-200 shadow-sm transition-all"
                    />
                </div>

                {/* Level Filter Dropdown */}
                <div className="relative w-full md:w-48 shrink-0">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 pointer-events-none">
                        <Filter className="h-4 w-4" />
                    </div>
                    <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="w-full pl-9 pr-10 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-800 dark:text-slate-200 shadow-sm appearance-none cursor-pointer text-gray-700 font-medium"
                    >
                        {LEVELS.map((level) => (
                            <option key={level} value={level}>
                                {level === '全部' ? '所有難度' : level}
                            </option>
                        ))}
                    </select>
                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Category Pills Navigation */}
            <div className="flex overflow-x-auto pb-2 gap-2 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                            selectedCategory === category
                                ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200'
                                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-500'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-slate-200">
                {selectedCategory === '全部' ? '所有課程' : `${selectedCategory} 課程`}
                {selectedLevel !== '全部' && <span className="text-teal-600 dark:text-teal-400 mx-1">({selectedLevel})</span>}
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-slate-400">
                    (共 {filteredCourses.length} 堂)
                </span>
            </h2>
        </div>

        {/* Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div key={course.id} className="h-full">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-600">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-700 mb-4">
              <Search className="h-8 w-8 text-gray-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100">找不到相關課程</h3>
            <p className="text-gray-500 dark:text-slate-400 mt-1">
                沒有找到符合目前搜尋條件的課程。
            </p>
             <button 
                onClick={handleClearFilters}
                className="mt-4 text-teal-600 dark:text-teal-400 font-medium hover:underline"
            >
                清除所有篩選
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;