import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import CreateCoursePage from './pages/CreateCoursePage';
import EditCoverPage from './pages/EditCoverPage';
import ExplorePage from './pages/ExplorePage';
import { MOCK_COURSES } from './constants';
import { Course } from './types';

function EditCourseWrapper({ courses, onUpdateCourse, onRenameCategory }: { 
  courses: Course[]; 
  onUpdateCourse: (c: Course) => void;
  onRenameCategory: (old: string, newName: string) => void;
}) {
  const { id } = useParams<{ id: string }>();
  const course = courses.find(c => c.id === id);
  if (!course) return <Navigate to="/" replace />;
  return (
    <CreateCoursePage
      initialCourse={course}
      onUpdateCourse={onUpdateCourse}
      onAddCourse={() => {}}
      onRenameCategory={onRenameCategory}
    />
  );
}

function App() {
  // Initialize state from localStorage if available, otherwise use MOCK_COURSES
  // Changed key to 'lumilearn_courses_v2' to ensure users get the new data structure (videoId instead of youtubeId)
  const [courses, setCourses] = useState<Course[]>(() => {
    const savedCourses = localStorage.getItem('lumilearn_courses_v2');
    if (savedCourses) {
      try {
        return JSON.parse(savedCourses);
      } catch (e) {
        console.error("Failed to parse courses from local storage", e);
        return MOCK_COURSES;
      }
    }
    return MOCK_COURSES;
  });

  // Persist courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('lumilearn_courses_v2', JSON.stringify(courses));
  }, [courses]);

  const handleIncrementView = (courseId: string) => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === courseId 
          ? { ...course, views: course.views + 1 } 
          : course
      )
    );
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [newCourse, ...prev]);
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses(prev =>
      prev.map(c => (c.id === updatedCourse.id ? updatedCourse : c))
    );
  };

  const handleRenameCategory = (oldName: string, newName: string) => {
    setCourses(prev =>
      prev.map(c =>
        c.category === oldName ? { ...c, category: newName } : c
      )
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-gray-900 dark:text-slate-100 transition-colors">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage courses={courses} />} />
          <Route 
            path="/explore" 
            element={<ExplorePage courses={courses} />} 
          />
          <Route 
            path="/course/:id" 
            element={<CoursePage courses={courses} incrementView={handleIncrementView} />} 
          />
          <Route 
            path="/edit-cover" 
            element={<EditCoverPage />} 
          />
          <Route 
            path="/create-course" 
            element={
              <CreateCoursePage 
                onAddCourse={handleAddCourse} 
                onRenameCategory={handleRenameCategory}
              />
            } 
          />
          <Route 
            path="/course/:id/edit" 
            element={
              <EditCourseWrapper 
                courses={courses} 
                onUpdateCourse={handleUpdateCourse}
                onRenameCategory={handleRenameCategory}
              />
            } 
          />
        </Routes>
        
        {/* Simple Footer */}
        <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 py-10 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 dark:text-slate-400 text-sm">
            <p className="mb-2">&copy; {new Date().getFullYear()} LumiLearn. 版權所有。</p>
            <p>為了學習的樂趣而製作。</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;