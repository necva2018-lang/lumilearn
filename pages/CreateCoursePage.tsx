import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, Save, Video, LayoutList, Link as LinkIcon, AlertCircle, Sparkles, Settings, X, Check, XCircle, ChevronLeft, Pencil, CheckCircle } from 'lucide-react';
import { Course, Module, Lesson } from '../types';
import { generateCourseDescription } from '../services/geminiService';

interface CreateCoursePageProps {
  onAddCourse: (course: Course) => void;
  /** 編輯模式：傳入既有課程時預填表單並改為更新行為 */
  initialCourse?: Course | null;
  onUpdateCourse?: (course: Course) => void;
  /** 重新命名分類時，同步更新所有使用該分類的課程 */
  onRenameCategory?: (oldName: string, newName: string) => void;
}

const DEFAULT_CATEGORIES = ['程式開發', '設計', '商業', '攝影', '語言', '生活風格'];

const CreateCoursePage: React.FC<CreateCoursePageProps> = ({ onAddCourse, initialCourse, onUpdateCourse, onRenameCategory }) => {
  const navigate = useNavigate();
  const isEditMode = !!initialCourse && !!onUpdateCourse;

  // Basic Info State（編輯時從 initialCourse 預填）
  const [title, setTitle] = useState(() => initialCourse?.title ?? '');
  const [description, setDescription] = useState(() => initialCourse?.description ?? '');
  const [price, setPrice] = useState<number>(() => initialCourse?.price ?? 0);
  const [originalPrice, setOriginalPrice] = useState<number>(() => initialCourse?.originalPrice ?? 0);
  const [level, setLevel] = useState(() => initialCourse?.level ?? '入門');
  const [thumbnail, setThumbnail] = useState(() => initialCourse?.thumbnail ?? 'https://picsum.photos/800/450?random=100');
  
  // Category State (with safe localStorage persistence)
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lumilearn_categories');
      const parsed = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error("Failed to load categories from local storage", e);
    }
    return DEFAULT_CATEGORIES;
  });
  const [category, setCategory] = useState(() => initialCourse?.category ?? categories[0] ?? '未分類');

  // New Category Management State
  const [isManagingCats, setIsManagingCats] = useState(false);
  const [newCatInput, setNewCatInput] = useState('');
  const [catError, setCatError] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryValue, setEditCategoryValue] = useState('');

  // AI Generation State
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  
  // Instructor State
  const [instructorName, setInstructorName] = useState(() => initialCourse?.instructor?.name ?? '講師名稱');
  const [instructorBio, setInstructorBio] = useState(() => initialCourse?.instructor?.bio ?? '請輸入講師簡介...');
  const [instructorAvatar, setInstructorAvatar] = useState(() => initialCourse?.instructor?.avatar ?? 'https://picsum.photos/100/100?random=101');

  // Curriculum State（編輯時載入既有章節與單元）
  const [modules, setModules] = useState<Module[]>(() => {
    if (initialCourse?.modules?.length) {
      return initialCourse.modules;
    }
    return [
      {
        id: `m-${Date.now()}`,
        title: '第一章：課程介紹',
        lessons: []
      }
    ];
  });

  // Persist categories whenever they change
  useEffect(() => {
    localStorage.setItem('lumilearn_categories', JSON.stringify(categories));
  }, [categories]);

  // 編輯模式：確保課程既有分類出現在選單中
  useEffect(() => {
    if (initialCourse?.category && !categories.includes(initialCourse.category)) {
      setCategories(prev => [...prev, initialCourse!.category]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Category Management Functions
  const handleAddCategory = () => {
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    
    if (categories.includes(trimmed)) {
      setCatError('此分類已存在');
      return;
    }

    const newCats = [...categories, trimmed];
    setCategories(newCats);
    setNewCatInput('');
    setCatError('');
    setCategory(trimmed); // Auto select the new category
  };

  const handleDeleteCategory = (targetCat: string) => {
    if (categories.length <= 1) {
      setCatError('系統至少需要保留一個分類');
      return;
    }
    
    if (confirm(`確定要永久刪除「${targetCat}」分類嗎？這不會影響已建立的課程。`)) {
       const newCats = categories.filter(c => c !== targetCat);
       setCategories(newCats);
       
       if (category === targetCat) {
         setCategory(newCats[0]);
       }
       setCatError('');
       setEditingCategory(null);
    }
  };

  const handleStartEditCategory = (cat: string) => {
    setEditingCategory(cat);
    setEditCategoryValue(cat);
    setCatError('');
  };

  const handleSaveEditCategory = () => {
    const trimmed = editCategoryValue.trim();
    if (!trimmed) {
      setCatError('分類名稱不可為空');
      return;
    }
    if (trimmed === editingCategory) {
      setEditingCategory(null);
      return;
    }
    if (categories.includes(trimmed)) {
      setCatError('此分類名稱已存在');
      return;
    }

    const oldName = editingCategory!;
    const newCats = categories.map(c => (c === oldName ? trimmed : c));
    setCategories(newCats);
    if (category === oldName) setCategory(trimmed);
    onRenameCategory?.(oldName, trimmed);
    setEditingCategory(null);
    setEditCategoryValue('');
    setCatError('');
  };

  const handleCancelEditCategory = () => {
    setEditingCategory(null);
    setEditCategoryValue('');
    setCatError('');
  };

  // Handle AI Description Generation
  const handleAiGenerateDescription = async () => {
    if (!title.trim()) {
      alert("請先輸入課程標題，AI 才能為您撰寫描述。");
      return;
    }

    setIsGeneratingDesc(true);
    try {
      const generatedText = await generateCourseDescription(title, category, level);
      setDescription(generatedText);
    } catch (error) {
      alert("AI 撰寫失敗，請檢查網路連線或 API Key。");
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  // Helper: Extract Video ID from URL (YouTube or Google Drive)
  const extractVideoId = (url: string): string => {
    if (!url) return '';
    const cleanUrl = url.trim();

    // 1. Check for YouTube
    const youtubeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const youtubeMatch = cleanUrl.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[2].length === 11) {
      return youtubeMatch[2];
    }

    // 2. Check for Google Drive
    const driveRegex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
    const driveMatch = cleanUrl.match(driveRegex);
    if (driveMatch) return driveMatch[1];
    
    const driveIdParamMatch = cleanUrl.match(/id=([a-zA-Z0-9_-]+)/);
    if (driveIdParamMatch) return driveIdParamMatch[1];

    if (!cleanUrl.includes('/')) {
        return cleanUrl;
    }

    return cleanUrl;
  };

  const handleUrlChange = async (moduleId: string, lessonId: string, url: string) => {
     const id = extractVideoId(url);
     updateLesson(moduleId, lessonId, 'videoId', id);

     if (id) {
        const isYouTube = url.includes('youtu') || (id.length === 11 && !url.includes('drive'));
        
        if (isYouTube) {
          try {
             const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`);
             const data = await response.json();
             
             if (data.title) {
                setModules(prev => prev.map(m => 
                  m.id === moduleId 
                    ? {
                        ...m,
                        lessons: m.lessons.map(l => {
                          if (l.id === lessonId && (l.title === '新單元' || !l.title)) {
                            return { ...l, title: data.title };
                          }
                          return l;
                        })
                      }
                    : m
                ));
             }
          } catch (error) {
             console.error("Failed to fetch video title:", error);
          }
        }
     }
  };

  // Handlers for Curriculum
  const addModule = () => {
    setModules([
      ...modules,
      {
        id: `m-${Date.now()}`,
        title: '新章節',
        lessons: []
      }
    ]);
  };

  const removeModule = (moduleId: string) => {
    if (modules.length === 1) return alert("至少需要一個章節");
    setModules(modules.filter(m => m.id !== moduleId));
  };

  const updateModuleTitle = (moduleId: string, newTitle: string) => {
    setModules(modules.map(m => m.id === moduleId ? { ...m, title: newTitle } : m));
  };

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: `l-${Date.now()}`,
      title: '新單元',
      duration: '10:00',
      videoId: '',
      isFree: false
    };

    setModules(modules.map(m => 
      m.id === moduleId 
        ? { ...m, lessons: [...m.lessons, newLesson] } 
        : m
    ));
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId 
        ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } 
        : m
    ));
  };

  const updateLesson = (moduleId: string, lessonId: string, field: keyof Lesson, value: any) => {
    setModules(prevModules => prevModules.map(m => 
      m.id === moduleId 
        ? {
            ...m,
            lessons: m.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l)
          }
        : m
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) return alert("請填寫完整課程資訊");
    
    const hasContent = modules.some(m => m.lessons.length > 0 && m.lessons.some(l => l.videoId));
    if (!hasContent) return alert("請至少新增一個帶有影片連結的單元");

    const savedCourse: Course = {
      id: initialCourse?.id ?? `c-${Date.now()}`,
      title,
      description,
      price,
      originalPrice,
      category,
      level,
      thumbnail,
      rating: initialCourse?.rating ?? 0,
      students: initialCourse?.students ?? 0,
      views: initialCourse?.views ?? 0,
      tags: [category, level],
      updatedAt: new Date().toISOString().split('T')[0],
      instructor: {
        name: instructorName,
        bio: instructorBio,
        avatar: instructorAvatar
      },
      modules
    };

    if (isEditMode && onUpdateCourse) {
      onUpdateCourse(savedCourse);
      navigate(`/course/${savedCourse.id}`);
    } else {
      onAddCourse(savedCourse);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
       {/* Header */}
       <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-16 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {isEditMode && (
              <Link 
                to={`/course/${initialCourse!.id}`} 
                className="text-gray-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1 text-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                返回課程
              </Link>
            )}
            <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">{isEditMode ? '編輯課程內容' : '建立新課程'}</h1>
          </div>
          <button 
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Save className="h-4 w-4" />
            {isEditMode ? '儲存變更' : '發布課程'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Basic Info */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
            <LayoutList className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            基本資訊
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">課程標題</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                placeholder="例如：精通 Python 資料分析"
              />
            </div>
            
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-1">
                 <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">課程描述</label>
                 <button
                    type="button"
                    onClick={handleAiGenerateDescription}
                    disabled={isGeneratingDesc}
                    className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 ${
                      isGeneratingDesc 
                        ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 border-gray-200 dark:border-slate-600 cursor-wait'
                        : 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/50 shadow-sm'
                    }`}
                 >
                    {isGeneratingDesc ? (
                      <>
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        AI 撰寫中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        AI 協助撰寫
                      </>
                    )}
                 </button>
              </div>
              <textarea 
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none transition-all"
                placeholder={title ? "點擊上方「AI 協助撰寫」按鈕，或在此手動輸入..." : "請先輸入課程標題..."}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">支援 AI 自動生成</p>
            </div>

            {/* Optimized Category Management */}
            <div>
              <div className="flex justify-between items-center mb-1">
                 <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">分類</label>
                 <button 
                    type="button"
                    onClick={() => setIsManagingCats(!isManagingCats)}
                    className="text-xs font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1 hover:bg-teal-50 px-2 py-1 rounded transition-colors"
                 >
                    <Settings className="h-3.5 w-3.5" />
                    {isManagingCats ? '隱藏管理' : '管理分類'}
                 </button>
              </div>

              {/* Main Selection Dropdown */}
              <div className="relative">
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-600 rounded-lg pl-4 pr-10 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 appearance-none focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expandable Manager Panel */}
              {isManagingCats && (
                  <div className="mt-3 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600 animate-in fade-in slide-in-from-top-2 duration-200">
                      <p className="text-xs font-medium text-gray-500 mb-3">編輯現有分類：</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                          {categories.map(c => (
                              editingCategory === c ? (
                                <div key={c} className="inline-flex items-center gap-1 bg-white border-2 border-teal-500 rounded-full pl-3 pr-1 py-1">
                                  <input
                                    type="text"
                                    value={editCategoryValue}
                                    onChange={e => setEditCategoryValue(e.target.value)}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter') handleSaveEditCategory();
                                      if (e.key === 'Escape') handleCancelEditCategory();
                                    }}
                                    className="w-24 text-sm outline-none border-0 bg-transparent focus:ring-0"
                                    autoFocus
                                  />
                                  <button type="button" onClick={handleSaveEditCategory} className="text-teal-600 hover:text-teal-700 p-1 rounded-full hover:bg-teal-50" title="儲存">
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                  <button type="button" onClick={handleCancelEditCategory} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100" title="取消">
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <span key={c} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm transition-colors ${category === c ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-white border-gray-200 text-gray-700'}`}>
                                  {c}
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditCategory(c)}
                                    className="text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-full p-0.5 transition-colors"
                                    title="修改"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                  <button 
                                    type="button" 
                                    onClick={() => handleDeleteCategory(c)} 
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors"
                                    title="刪除"
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                  </button>
                                </span>
                              )
                          ))}
                      </div>

                      <div className="border-t border-gray-200 pt-3">
                         <label className="text-xs font-medium text-gray-500 mb-2 block">新增分類：</label>
                         <div className="flex gap-2">
                             <input 
                                 type="text" 
                                 value={newCatInput} 
                                 onChange={e => {
                                    setNewCatInput(e.target.value);
                                    if(catError) setCatError('');
                                 }}
                                 placeholder="輸入新分類名稱"
                                 className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                 onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                             />
                             <button 
                                type="button" 
                                onClick={handleAddCategory} 
                                className="px-3 py-1.5 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-1"
                             >
                                <Plus className="h-4 w-4" /> 新增
                             </button>
                         </div>
                         {catError && (
                             <div className="flex items-center gap-1 mt-2 text-red-500 text-xs animate-pulse">
                                <AlertCircle className="h-3 w-3" />
                                {catError}
                             </div>
                         )}
                      </div>
                  </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">難易度</label>
              <select 
                value={level} 
                onChange={e => setLevel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
              >
                <option>入門</option>
                <option>中階</option>
                <option>進階</option>
              </select>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">售價 (NT$)</label>
               <input 
                 type="number" 
                 value={price}
                 onChange={e => setPrice(Number(e.target.value))}
                 className="w-full border border-gray-300 rounded-lg px-4 py-2"
               />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">原價 (NT$) (若無特價請填相同)</label>
               <input 
                 type="number" 
                 value={originalPrice}
                 onChange={e => setOriginalPrice(Number(e.target.value))}
                 className="w-full border border-gray-300 rounded-lg px-4 py-2"
               />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">封面圖片網址 (URL)</label>
              <input 
                type="text" 
                value={thumbnail}
                onChange={e => setThumbnail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-500"
              />
            </div>
          </div>
        </section>

        {/* Curriculum Editor */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <Video className="h-5 w-5 text-teal-600" />
              課程大綱
            </h2>
            <button 
              onClick={addModule}
              type="button"
              className="text-sm bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              新增章節
            </button>
          </div>

          <div className="space-y-6">
            {modules.map((module, mIdx) => (
              <div key={module.id} className="border border-gray-200 dark:border-slate-600 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-slate-700/30">
                {/* Module Header */}
                <div className="bg-gray-100 dark:bg-slate-700 px-4 py-3 flex items-center gap-3">
                  <span className="font-bold text-gray-500 dark:text-slate-400 text-sm whitespace-nowrap">章節 {mIdx + 1}</span>
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                    className="flex-1 bg-transparent border-b border-transparent focus:border-teal-500 focus:bg-white dark:focus:bg-slate-600 px-2 py-1 outline-none font-medium text-gray-900 dark:text-slate-200 transition-all"
                    placeholder="輸入章節名稱..."
                  />
                  <button 
                    onClick={() => removeModule(module.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Lessons List */}
                <div className="p-4 space-y-3">
                  {module.lessons.map((lesson, lIdx) => (
                    <div key={lesson.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 p-4 rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="flex-1 w-full space-y-3">
                         <div className="flex gap-2">
                           <span className="text-xs font-mono text-gray-400 mt-2.5">{lIdx + 1}.</span>
                           <div className="flex-1">
                             <label className="text-xs text-gray-400 block mb-1">單元名稱</label>
                             <div className="relative">
                               <input
                                 type="text"
                                 value={lesson.title}
                                 onChange={(e) => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                                 className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                                 placeholder="單元標題"
                               />
                             </div>
                           </div>
                         </div>
                         
                         <div className="flex gap-3 pl-5">
                            <div className="flex-1">
                               <label className="text-xs text-gray-400 block mb-1 flex items-center justify-between">
                                  <span className="flex items-center gap-1">
                                    <LinkIcon className="h-3 w-3" />
                                    影片來源 (YouTube 或 Google Drive)
                                  </span>
                               </label>
                               <div className="relative">
                                 <input
                                   type="text"
                                   defaultValue={lesson.videoId ? (lesson.videoId.length === 11 ? `https://youtu.be/${lesson.videoId}` : `https://drive.google.com/file/d/${lesson.videoId}/view`) : ''}
                                   onBlur={(e) => handleUrlChange(module.id, lesson.id, e.target.value)}
                                   className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm font-mono text-gray-600 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-colors"
                                   placeholder="貼上 YouTube 或 Google Drive 連結..."
                                 />
                               </div>
                               {lesson.videoId && (
                                   <div className="flex items-center gap-2 mt-1">
                                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${lesson.videoId.length === 11 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {lesson.videoId.length === 11 ? 'YouTube' : 'Drive'}
                                      </span>
                                      <p className="text-[10px] text-green-600">ID: {lesson.videoId.substring(0, 15)}...</p>
                                   </div>
                               )}
                            </div>
                            <div className="w-24">
                               <label className="text-xs text-gray-400 block mb-1">時長</label>
                               <input
                                 type="text"
                                 value={lesson.duration}
                                 onChange={(e) => updateLesson(module.id, lesson.id, 'duration', e.target.value)}
                                 className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                                 placeholder="MM:SS"
                               />
                            </div>
                         </div>
                      </div>

                      <div className="flex md:flex-col items-center gap-2 mt-2 md:mt-0 ml-5 md:ml-0">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input 
                            type="checkbox"
                            checked={lesson.isFree}
                            onChange={(e) => updateLesson(module.id, lesson.id, 'isFree', e.target.checked)}
                            className="w-4 h-4 text-teal-600 rounded"
                          />
                          <span className="text-xs text-gray-600">免費試看</span>
                        </label>
                        <button 
                          onClick={() => removeLesson(module.id, lesson.id)}
                          className="text-gray-400 hover:text-red-500 p-2 md:mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-start gap-2">
                     <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                     <div className="text-xs text-blue-700 leading-relaxed">
                        <p className="font-bold mb-1">影片設定說明：</p>
                        <ul className="list-disc list-inside space-y-0.5 ml-1">
                           <li><strong>Google Drive：</strong>請確認檔案共用設定為「知道連結的使用者」皆可檢視。</li>
                           <li><strong>YouTube：</strong>支援一般影片或 Unlisted (不公開) 影片。</li>
                        </ul>
                     </div>
                  </div>

                  <button 
                    onClick={() => addLesson(module.id)}
                    className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 text-sm hover:border-teal-500 hover:text-teal-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> 新增單元
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CreateCoursePage;