'use client';

import { useState, useEffect } from 'react';
import { ShortLink } from '@/types';

interface HistoryListProps {
  links: ShortLink[];
}

export default function HistoryList({ links }: HistoryListProps) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopy = (shortCode: string) => {
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(shortCode);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (links.length === 0) {
    return (
      <div className="mt-12 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Historial</h2>
        <p className="text-slate-400">Aún no has acortado ningún enlace.</p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-white mb-4">Historial</h2>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.shortCode} className="bg-slate-800 p-4 rounded-lg flex items-center justify-between gap-4">
            <div className="flex-grow overflow-hidden">
              <p className="text-white font-medium truncate">{link.url}</p>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/${link.shortCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 text-sm hover:underline"
              >
                {`${process.env.NEXT_PUBLIC_API_URL ? '' : 'http://localhost:3001/'}${link.shortCode}`}
              </a>
            </div>
            <button
              onClick={() => handleCopy(link.shortCode)}
              className="bg-cyan-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-cyan-600 transition-colors"
            >
              {copiedLink === link.shortCode ? '¡Copiado!' : 'Copiar'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

