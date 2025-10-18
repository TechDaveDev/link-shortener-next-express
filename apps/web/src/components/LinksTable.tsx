'use client';
import { ShortLink } from '@/types';
import { Link2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

// Función para formatear la fecha
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function LinksTable({ links }: { links: ShortLink[] }) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (shortCode: string) => {
    const shortUrl = `${window.location.protocol}//${window.location.host.replace(/:\d+$/, '')}:3001/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    setCopiedCode(shortCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (links.length === 0) {
    return (
      <div className="bg-slate-800 p-8 rounded-lg text-center text-slate-400">
        No se encontraron enlaces. ¡Intenta crear uno!
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      <table className="min-w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900/50 text-xs uppercase text-slate-400">
          <tr>
            <th scope="col" className="px-6 py-3">URL Original</th>
            <th scope="col" className="px-6 py-3">Enlace Corto</th>
            <th scope="col" className="px-6 py-3 text-center">Clicks</th>
            <th scope="col" className="px-6 py-3">Fecha</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {links.map((link) => (
            <tr key={link.id} className="hover:bg-slate-700/50">
              <td className="px-6 py-4 truncate max-w-xs">{link.url}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-cyan-400" />
                  <span>{`${window.location.host.replace(/:\d+$/, '')}:3001/${link.shortCode}`}</span>
                  <button onClick={() => handleCopy(link.shortCode)} className="ml-2 text-slate-400 hover:text-white">
                    {copiedCode === link.shortCode ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 text-center">{link.clicks}</td>
              <td className="px-6 py-4 whitespace-nowrap">{formatDate(link.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
