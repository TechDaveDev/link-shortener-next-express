import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export default function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-slate-800 p-6 rounded-lg flex items-center gap-6">
      <div className={`p-4 bg-slate-900/50 rounded-lg ${color}`}>
        <Icon className="h-8 w-8" />
      </div>
      <div>
        <p className="text-sm text-slate-400">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
