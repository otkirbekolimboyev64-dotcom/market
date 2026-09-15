import React from 'react';
import { 
  Smartphone, 
  Laptop, 
  Tv, 
  Shirt, 
  Sparkles, 
  BookOpen, 
  Dumbbell,
  Grid,
  ChevronRight
} from 'lucide-react';
import { Category } from '../../../types';

interface CategoryListProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelectCategory: (categoryId: string) => void;
  layoutMode?: 'carousel' | 'grid';
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-5 h-5" />,
  Laptop: <Laptop className="w-5 h-5" />,
  Tv: <Tv className="w-5 h-5" />,
  Shirt: <Shirt className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Dumbbell: <Dumbbell className="w-5 h-5" />,
};

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategoryId = 'all',
  onSelectCategory,
  layoutMode = 'carousel'
}) => {
  if (layoutMode === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <button
          onClick={() => onSelectCategory('all')}
          className={`p-3.5 rounded-2xl flex flex-col items-center text-center transition-all border ${
            selectedCategoryId === 'all'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
              : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200'
          }`}
        >
          <div className={`p-2.5 rounded-xl mb-2 ${
            selectedCategoryId === 'all' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
          }`}>
            <Grid className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold leading-tight line-clamp-1">Barcha bo'limlar</span>
          <span className={`text-[10px] mt-0.5 ${
            selectedCategoryId === 'all' ? 'text-indigo-200' : 'text-neutral-400'
          }`}>
            Hammasi
          </span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`p-3.5 rounded-2xl flex flex-col items-center text-center transition-all border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                  : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200'
              }`}
            >
              <div className={`p-2.5 rounded-xl mb-2 ${
                isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
              }`}>
                {ICON_MAP[cat.icon] || <Grid className="w-5 h-5" />}
              </div>
              <span className="text-xs font-bold leading-tight line-clamp-1">{cat.name}</span>
              <span className={`text-[10px] mt-0.5 ${
                isSelected ? 'text-indigo-200' : 'text-neutral-400'
              }`}>
                {cat.itemCount} ta mahsulot
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Horizontal scrollable pill bar
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-neutral-900 tracking-tight flex items-center gap-2">
          <span>Ommabop kategoriyalar</span>
        </h3>
        <button
          onClick={() => onSelectCategory('all')}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
        >
          <span>Katalogga o'tish</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            selectedCategoryId === 'all'
              ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
              : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Barchasi</span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <span className={isSelected ? 'text-white' : 'text-indigo-600'}>
                {ICON_MAP[cat.icon] || <Grid className="w-4 h-4" />}
              </span>
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-indigo-700/60 text-white' : 'bg-neutral-100 text-neutral-500'
              }`}>
                {cat.itemCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
