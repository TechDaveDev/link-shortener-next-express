'use client';

import ShortenForm from '@/components/ShortenForm';
import HistoryList from '@/components/HistoryList';
import useLocalStorage from '@/hooks/useLocalStorage';
import { ShortLink } from '@/types';

export default function DashboardPage() {
  const [links, setLinks] = useLocalStorage<ShortLink[]>('link-history', []);

  const handleNewLink = (newLink: ShortLink) => {
    setLinks(prevLinks => [newLink, ...prevLinks]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ShortenForm onSuccess={handleNewLink} />
      <HistoryList links={links} />
    </div>
  );
}

