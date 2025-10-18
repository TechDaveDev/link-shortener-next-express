'use client';
import { PaginationInfo } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (newPage: number) => void;
}

export default function PaginationControls({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, total } = pagination;

  const handlePrev = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 text-sm text-slate-400">
      <div>
        Mostrando página <span className="font-bold text-white">{page}</span> de <span className="font-bold text-white">{totalPages}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-3 py-1.5 flex items-center gap-1 bg-slate-800 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-3 py-1.5 flex items-center gap-1 bg-slate-800 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
