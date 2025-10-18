'use client';

import { useState, FormEvent } from 'react';
import { ShortLink } from '../types';
import { Link, Loader2 } from 'lucide-react';

interface ShortenFormProps {
  onNewLink: (link: ShortLink) => void;
}

export default function ShortenForm({ onNewLink }: ShortenFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Algo salió mal');
      }

      onNewLink(data as ShortLink);
      setUrl('');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-lg">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="url"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Pega tu enlace largo aquí..."
            required
            className="w-full bg-slate-700/50 pl-10 pr-4 py-3 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-600 transition-colors text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Acortar Enlace'}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
    </form>
  );
}
