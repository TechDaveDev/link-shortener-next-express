'use client';

import { useEffect, useState } from 'react';
import { Stats } from '@/types';
import StatCard from '@/components/StatCard';
import { Link2, BarChartBig } from 'lucide-react';

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/stats');
        if (!response.ok) {
          throw new Error('No se pudieron cargar las estadísticas.');
        }
        const data: Stats = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Estadísticas Generales</h1>

      {isLoading ? (
        <div className="bg-slate-800 p-8 rounded-lg text-center text-slate-400">Cargando estadísticas...</div>
      ) : error ? (
        <div className="bg-slate-800 p-8 rounded-lg text-center text-red-400">{error}</div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Total de Enlaces Creados"
            value={stats.totalLinks}
            icon={Link2}
            color="text-cyan-400"
          />
          <StatCard
            title="Total de Clics (Todos los enlaces)"
            value={stats.totalClicks}
            icon={BarChartBig}
            color="text-violet-400"
          />
        </div>
      ) : (
        <div className="bg-slate-800 p-8 rounded-lg text-center text-slate-400">No hay datos disponibles.</div>
      )}
    </div>
  );
}

