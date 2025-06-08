import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  user: any;  
}

export default function AuthenticatedLayoutWithSidebar({ children, title, user }: LayoutProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <Head title={title || 'WorkNest'} />

      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white border-b p-4 shadow-sm relative">
        <div className="text-2xl font-bold text-indigo-600">
          WorkNest
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="font-medium text-gray-700 hover:text-indigo-600"
            >
              {user.name}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
                <Link
                  href={route('profile.edit')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profil
                </Link>
                <Link
                  href={route('logout')}
                  method="post"
                  as="button"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Keluar
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r flex flex-col">
          <nav className="flex-1 p-4 space-y-2">
            <Link href={route('dashboard')} className="block py-2 px-3 rounded hover:bg-indigo-50">
              📊 Dashboard
            </Link>
            <Link href="/projects" className="block py-2 px-3 rounded hover:bg-indigo-50">
              📁 Proyek
            </Link>
            <Link href="/tasks" className="block py-2 px-3 rounded hover:bg-indigo-50">
              📋 Tugas Saya
            </Link>
            {user.roles.includes('admin') && (
              <Link href="/admin/users" className="block py-2 px-3 rounded hover:bg-indigo-50">
                ⚙️ Manajemen User
              </Link>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-gray-100 p-6">
          <h1 className="text-2xl font-semibold mb-4">{title}</h1>
          {children}
        </div>
      </div>
    </>
  );
}
