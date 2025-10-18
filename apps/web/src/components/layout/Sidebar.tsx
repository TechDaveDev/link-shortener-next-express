'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, Link2 } from 'lucide-react';

const navItems = [
  { name: 'Acortador', href: '/', icon: Home },
  { name: 'Enlaces', href: '/links', icon: Link2 },
  { name: 'Estadísticas', href: '/stats', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-800 p-6 hidden md:block">
      <div className="text-white text-2xl font-bold mb-10">Shorty</div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive
                  ? 'bg-cyan-500 text-white'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
