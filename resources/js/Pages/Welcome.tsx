import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { PageProps } from '@/types';

interface WelcomeProps extends PageProps {
  auth: { user: any };
}

const Welcome: React.FC<WelcomeProps> = ({ auth }) => (
  <>
    <Head title="Welcome" />

    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-10xl mx-auto px-6 sm:px-8 lg:px-10 flex justify-between items-center h-16">
          <div className="font-extrabold text-2xl text-indigo-700 select-none cursor-default">
            WorkNesk
          </div>

          <div className="flex items-center space-x-4">
            {auth.user ? (
              <Link
                href={route('dashboard')}
                className="text-indigo-700 hover:text-indigo-900 font-semibold transition-colors duration-200"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href={route('login')}
                  className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition"
                >
                  Masuk
                </Link>
                <Link
                  href={route('register')}
                  className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Welcome Content */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <h1 className="text-5xl font-extrabold text-indigo-900 mb-4 tracking-wide">
          Selamat Datang Di WorkNesk
        </h1>
        <p className="max-w-2xl text-center text-indigo-700 text-lg leading-relaxed">
          Tempat terbaik untuk mengatur, merencanakan, dan berkolaborasi bersama tim. Kelola tugas, pantau progres, dan capai target proyek dengan papan Kanban yang sederhana, fleksibel, dan intuitif. Mulai produktif sekarang!
        </p>
      </main>
    </div>
  </>
);

export default Welcome;
