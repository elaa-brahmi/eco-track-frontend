'use client';

import { Home, FileText, Menu, X, CarIcon, Trash2Icon, PersonStandingIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Notify other components, like the map
    window.dispatchEvent(new Event("sidebar-toggle"));
  }, [isMenuOpen]);

  const menu = [
    { label: 'Dashboard', icon: Home, href: '/admin/dashboard' },
    { label: 'Bins', icon: Trash2Icon, href: '/admin/bins' },
    { label: 'Reports', icon: FileText, href: '/admin/reports' },
    { label: 'Employees', icon: PersonStandingIcon, href: '/admin/employees' },
    { label: 'Vehicles', icon: CarIcon, href: '/admin/vehicles' },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0d1224] text-white min-h-screen p-4 flex-col">
        <h1 className="text-2xl font-bold mb-8 text-green-700">EcoTrack</h1>
        <nav className="space-y-2">
          {menu.map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/20">
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile hamburger */}
      <div className="lg:hidden flex items-start p-4">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#0d1224]">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <div className="lg:hidden fixed top-0 left-0 w-64 h-full bg-[#0d1224] text-white p-6 shadow-lg  z-[4000]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-green-700">EcoTrack</h1>
            <button onClick={() => setIsMenuOpen(false)}>
              <X size={26} />
            </button>
          </div>

          <nav className="space-y-4">
            {menu.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-600/20"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
