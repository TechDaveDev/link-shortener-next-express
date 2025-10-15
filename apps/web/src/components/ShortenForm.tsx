'use client';

import { useState, FormEvent } from 'react';
import { ShortLink } from '../types';

interface ShortenFormProps {
  onSuccess: (data: ShortLink) => void;
}

export default function ShortenForm({ onSuccess }: ShortenFormProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) throw new Error('No se pudo acortar. Revisa la URL.');
      const data: ShortLink = await response.json();
      onSuccess(data);
      setUrl('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 p-6 sm:p-8 rounded-lg border border-slate-700 w-full">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            className="flex-grow bg-slate-800 border border-slate-600 rounded-md py-3 px-4 w-full text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="url"
            placeholder="Pega tu enlace aquí..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Acortando...' : 'Acortar'}
          </button>
        </div>
        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
      </form>
    </div>
  );
}
