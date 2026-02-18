import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, Lock, CheckCircle, Clock, ChevronLeft, Eye, Pencil } from 'lucide-react';
import { Course, Lesson } from '../types';
import AIChatBot from '../components/AIChatBot';

interface CoursePageProps {
  courses: Course[];
  incrementView: (id: string) => void;
}

const CoursePage: React.FC<CoursePageProps> = ({ courses, incrementView }) => {
  const { id } = useParams<{ id: string }>();
  const course = courses.find((c) => c.id === id);
  
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (course) {
      // Set initial active lesson to the first one
      if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
        setActiveLesson(course.modules[0].lessons[0]);
      }
      // Track view
      incrementView(course.id);
    }
    window.scrollTo(0, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col bg-slate-50 dark:bg-slate-900">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-200">找不到課程</h2>
        <Link to="/" className="text-teal-600 dark:text-teal-400 mt-4 hover:underline">返回首頁</Link>
      </div>
    );
  }

  const handleLessonClick = (lesson: Lesson) => {
    setActiveLesson(lesson);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to determine video source
  const renderPlayer = () => {
    if (!activeLesson) return <div className="w-full h-full flex items-center justify-center text-white">載入播放器中...</div>;

    const { videoId } = activeLesson;
    
    // Safety check for empty ID
    if (!videoId) {
       return <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-900">影片 ID 無效</div>;
    }

    // Heuristic: YouTube IDs are usually exactly 11 characters. 
    // Google Drive IDs are much longer (28-33+ chars).
    const isYouTube = videoId.length === 11;

    // Use unique key to force re-render when lesson changes
    if (isYouTube) {
      return (
        <iframe
          key={videoId} 
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
          title={activeLesson.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      );
    } else {
      // Google Drive Embed
      return (
        <iframe 
          key={videoId}
          src={`https://drive.google.com/file/d/${videoId}/preview`} 
          className="w-full h-full" 
          allow="autoplay; fullscreen"
          allowFullScreen
          title={activeLesson.title}
        ></iframe>
      );
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-20">
      {/* Breadcrumb / Back */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            返回課程列表
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Player & Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player Container */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video relative group">
              {renderPlayer()}
            </div>

            {/* Video Meta */}
            <div>
              <div className="flex items-start justify-between mb-4">
                 <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">{activeLesson?.title || course.title}</h1>
                     <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400">
                        <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded text-xs font-semibold">{course.category}</span>
                        <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {course.views.toLocaleString()} 次觀看</span>
                        <span>最後更新：{course.updatedAt}</span>
                     </div>
                 </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                 <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-slate-100">關於此課程</h3>
                 <p className="text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{course.description}</p>
                 
                 <div className="mt-6 flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-slate-700">
                    <img src={course.instructor.avatar} alt="inst" className="w-12 h-12 rounded-full ring-2 ring-white shadow-md" />
                    <div>
                        <p className="font-bold text-gray-900 dark:text-slate-100">{course.instructor.name}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{course.instructor.bio}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Right Column: Syllabus */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden sticky top-28">
              <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 dark:text-slate-100">課程內容</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-slate-400">{course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} 堂課</span>
                  <Link
                    to={`/course/${course.id}/edit`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    編輯
                  </Link>
                </div>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                {course.modules.map((module, mIdx) => (
                  <div key={module.id}>
                    <div className="bg-gray-100/50 dark:bg-slate-700/50 px-4 py-3 border-b border-gray-100 dark:border-slate-600">
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-slate-200">章節 {mIdx + 1}: {module.title}</h4>
                    </div>
                    <div>
                      {module.lessons.map((lesson, lIdx) => {
                        const isActive = activeLesson?.id === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonClick(lesson)}
                            className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border-b border-gray-100 dark:border-slate-700 last:border-0 ${isActive ? 'bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-50 dark:hover:bg-teal-900/30' : ''}`}
                          >
                            <div className={`mt-0.5 ${isActive ? 'text-teal-600' : 'text-gray-400'}`}>
                                {isActive ? <PlayCircle className="h-5 w-5 fill-current" /> : <CheckCircle className="h-5 w-5" />}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${isActive ? 'text-teal-700 dark:text-teal-300' : 'text-gray-700 dark:text-slate-300'}`}>
                                {lIdx + 1}. {lesson.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {lesson.duration}
                                </span>
                                {!lesson.isFree && (
                                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 rounded flex items-center gap-0.5">
                                    <Lock className="h-2 w-2" /> 付費限定
                                  </span>
                                )}
                                {lesson.isFree && (
                                   <span className="text-[10px] bg-green-100 text-green-600 px-1.5 rounded font-medium">
                                    免費試看
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                 <button className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">
                    購買課程 ${course.price}
                 </button>
                 <p className="text-center text-xs text-gray-500 mt-2">30 天退款保證</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Assistant */}
      <AIChatBot course={course} />
    </div>
  );
};

export default CoursePage;