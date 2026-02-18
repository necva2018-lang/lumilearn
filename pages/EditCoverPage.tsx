import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Save, Image } from 'lucide-react';
import { useHeroCover, HeroCoverConfig } from '../contexts/HeroCoverContext';

const EditCoverPage: React.FC = () => {
  const { config, updateConfig } = useHeroCover();

  const handleChange = (field: keyof HeroCoverConfig) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateConfig({ [field]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-16 z-30 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-gray-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1 text-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              返回首頁
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <Image className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              封面編輯
            </h1>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Save className="h-4 w-4" />
            儲存並預覽
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">首頁 Hero 區塊</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                標籤文字（徽章）
              </label>
              <input
                type="text"
                value={config.badgeText}
                onChange={handleChange('badgeText')}
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="例如：全新的學習方式"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                主標題（前半段）
              </label>
              <input
                type="text"
                value={config.headlinePrefix}
                onChange={handleChange('headlinePrefix')}
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="例如：學習對您 "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                主標題（強調文字，會以綠色顯示）
              </label>
              <input
                type="text"
                value={config.headlineHighlight}
                onChange={handleChange('headlineHighlight')}
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="例如：至關重要的"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                主標題（後半段）
              </label>
              <input
                type="text"
                value={config.headlineSuffix}
                onChange={handleChange('headlineSuffix')}
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="例如：技能。"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                描述文字
              </label>
              <textarea
                rows={3}
                value={config.description}
                onChange={handleChange('description')}
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                placeholder="課程平台簡介..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                主要按鈕文字
              </label>
              <input
                type="text"
                value={config.primaryButtonText}
                onChange={handleChange('primaryButtonText')}
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="例如：探索課程"
              />
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">點擊後前往「探索課程」頁面</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                次要按鈕文字
              </label>
              <input
                type="text"
                value={config.secondaryButtonText}
                onChange={handleChange('secondaryButtonText')}
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="例如：在 LumiLearn 上教學"
              />
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">點擊後前往「建立課程」頁面</p>
            </div>
          </div>
        </section>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium hover:underline"
          >
            返回首頁查看預覽
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditCoverPage;
