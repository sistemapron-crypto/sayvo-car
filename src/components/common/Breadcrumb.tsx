import React from 'react';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onHomeClick?: () => void;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  onHomeClick,
  className = '',
}) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs md:text-sm text-slate-500 py-3 ${className}`}>
      <button
        type="button"
        onClick={onHomeClick}
        className="flex items-center text-slate-500 hover:text-slate-800 transition-colors p-1 -ml-1 rounded focus:outline-hidden"
        title="Página Inicial"
      >
        <Home className="w-4 h-4" />
      </button>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 mx-1.5 shrink-0" />
          {item.onClick || item.href ? (
            <button
              type="button"
              onClick={item.onClick}
              className={`hover:text-slate-900 transition-colors font-medium ${
                item.active ? 'text-slate-800 font-semibold cursor-default' : 'text-slate-500'
              }`}
            >
              {item.label}
            </button>
          ) : (
            <span className={`font-medium ${item.active ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
