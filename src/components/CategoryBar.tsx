import {
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Cpu,
  Headphones,
  Keyboard,
  BatteryCharging,
  Wifi,
  Sparkles
} from 'lucide-react';
import { Category } from '../types';

interface CategoryBarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

const CATEGORY_ICON_MAP: Record<string, any> = {
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Cpu,
  Headphones,
  Keyboard,
  BatteryCharging,
  Wifi
};

export function CategoryBar({ categories, selectedCategory, onSelectCategory }: CategoryBarProps) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center overflow-x-auto no-scrollbar py-2.5 gap-2">
          {/* Tất cả */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors border ${
              selectedCategory === null
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tất cả sản phẩm</span>
          </button>

          {/* 9 Danh mục sản phẩm */}
          {categories.map(cat => {
            const IconComponent = CATEGORY_ICON_MAP[cat.icon] || Cpu;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? null : cat.slug)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-500 hover:text-blue-600'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
