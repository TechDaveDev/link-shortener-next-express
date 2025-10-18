'use client';

import { useEffect, useState } from 'react';
import { ShortLink, PaginationInfo } from '@/types';
import LinksTable from '@/components/LinksTable';
import PaginationControls from '@/components/PaginationControls';
import { Search } from 'lucide-react';

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}


export default function AllLinksPage() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchLinks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '10',
          search: debouncedSearchTerm,
        });

        const response = await fetch(`http://localhost:3001/api/links?${params.toString()}`);

        if (!response.ok) {
          throw new Error('No se pudieron cargar los enlaces.');
        }

        const data = await response.json();
        setLinks(data.data);
        setPagination(data.pagination);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, [page, debouncedSearchTerm]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Todos los Enlaces</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por URL o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-800 w-64 pl-10 pr-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        </div>
      </div>

      {isLoading ? (
        <div className="bg-slate-800 p-8 rounded-lg text-center text-slate-400">Cargando enlaces...</div>
      ) : error ? (
        <div className="bg-slate-800 p-8 rounded-lg text-center text-red-400">{error}</div>
      ) : (
        <>
          <LinksTable links={links} />
          {pagination && <PaginationControls pagination={pagination} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}

