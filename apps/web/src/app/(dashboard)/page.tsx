'use client';

import HistoryList from "@/components/HistoryList";
import ShortenForm from "@/components/ShortenForm";
import useLocalStorage from "@/hooks/useLocalStorage";
import { ShortLink } from "@/types";

export default function DashboardPage() {
  const [links, setLinks] = useLocalStorage<ShortLink[]>('short-links-history', []);

  const handleNewLink = (newLink: ShortLink) => {
    setLinks(prevLinks => {
      const linkExists = prevLinks.some(link => link.id === newLink.id);

      if (linkExists) {
        const otherLinks = prevLinks.filter(l => l.id !== newLink.id);
        return [newLink, ...otherLinks];
      }

      return [newLink, ...prevLinks];
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Acortar un nuevo enlace</h1>
      <ShortenForm {...({ onNewLink: handleNewLink } as any)} />

      <div className="mt-12">
        <HistoryList links={links} />
      </div>
    </div>
  );
}

