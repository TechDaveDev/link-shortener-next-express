'use client';

import { useState, FormEvent } from 'react';

// Interfaz para tipar la respuesta de la API
interface ShortLinkResponse {
  id: number;
  url: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
  shortUrl: string;
}

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [shortLink, setShortLink] = useState<ShortLinkResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortLink(null);

    if (!url) {
      setError('Por favor, ingresa una URL.');
      setLoading(false);
      return;
    }

    try {
      // Hacemos la petición a nuestro backend.
      // Asegúrate de que el puerto (3001) coincida con el de tu API.
      const response = await fetch('http://localhost:3001/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('No se pudo acortar el enlace. Inténtalo de nuevo.');
      }

      const data: ShortLinkResponse = await response.json();
      setShortLink(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shortLink) {
      navigator.clipboard.writeText(shortLink.shortUrl);
      // Usamos un modal custom en lugar de alert
      const modal = document.getElementById('copy-modal');
      if (modal) {
        modal.classList.remove('hidden');
        setTimeout(() => {
          modal.classList.add('hidden');
        }, 2000);
      }
    }
  }

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 relative">
        <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Acortador de Links
        </h1>
        <p className="text-gray-400 mb-8">
          Pega tu URL larga abajo para obtener una versión corta.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <div className="flex items-center border-b-2 border-purple-500 py-2">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-300 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="url"
              placeholder="https://ejemplo-url-muy-larga.com/..."
              aria-label="URL a acortar"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              className={`flex-shrink-0 bg-purple-600 hover:bg-purple-700 border-purple-600 hover:border-purple-700 text-sm border-4 text-white py-1 px-2 rounded-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Acortando...' : 'Acortar'}
            </button>
          </div>
        </form>

        {error && <p className="mt-4 text-red-400">{error}</p>}

        {shortLink && (
          <div className="mt-8 p-6 bg-gray-800 rounded-lg w-full max-w-lg shadow-lg">
            <p className="text-gray-300">¡Tu enlace corto está listo!</p>
            <div className="mt-2 flex items-center justify-between bg-gray-700 p-3 rounded-md">
              <a
                href={shortLink.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 font-mono break-all hover:underline"
              >
                {shortLink.shortUrl}
              </a>
              <button
                onClick={copyToClipboard}
                className="ml-4 p-2 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors"
                title="Copiar al portapapeles"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal para la confirmación de copiado */}
      <div id="copy-modal" className="hidden fixed top-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-300">
        ¡Copiado al portapapeles!
      </div>
    </>
  );
}

