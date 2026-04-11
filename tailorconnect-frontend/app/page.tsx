"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { designsService } from '@/services/designs';
import { tailorService } from '@/services/tailors';
import { statsService } from '@/services/stats';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const router = useRouter();
  const languageContext = useLanguage();
  const t = languageContext?.t || ((key: string) => key);
  const [search, setSearch] = useState('');
  const [designs, setDesigns] = useState<any[]>([]);
  const [tailors, setTailors] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_clients: 0, total_tailors: 0, total_designs: 0, completed_orders: 0 });
  const [popularSpecialties, setPopularSpecialties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [d, t, s, specs] = await Promise.all([
          designsService.getAll(),
          tailorService.getAll(),
          statsService.getPlatformStats(),
          tailorService.getSpecialties()
        ]);
        setDesigns(d.slice(0, 3));
        setTailors(t.slice(0, 3));
        setStats(s);
        setPopularSpecialties(specs.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/tailors?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 h-[700px]">
        <div className="absolute inset-0">
          <Image
            src="/hero.png"
            alt="Tailor working on fabric"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-900" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl mb-6 animate-fade-in-up">
            <span className="block">{t('home.hero.title1')}</span>
            <span className="block text-green-400">{t('home.hero.title2')}</span>
          </h1>
          <p className="mt-4 text-xl text-gray-200 max-w-2xl mb-10 animate-fade-in-up delay-100">
            {t('home.hero.subtitle')}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl flex gap-2 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 shadow-2xl animate-fade-in-up delay-200">
            <input
              type="text"
              placeholder={t('home.hero.searchPlaceholder')}
              className="flex-1 bg-transparent border-none text-white placeholder-gray-300 px-6 py-4 rounded-full focus:ring-0 text-lg outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg">
              {t('home.hero.searchButton')}
            </button>
          </form>

          {popularSpecialties.length > 0 && (
            <div className="mt-8 flex gap-4 text-gray-300 text-sm animate-fade-in-up delay-300">
              <span>{t('home.hero.popular')}</span>
              {popularSpecialties.map(spec => (
                <Link
                  key={spec.name}
                  href={`/tailors?specialty=${encodeURIComponent(spec.name)}`}
                  className="hover:text-white underline decoration-green-400"
                >
                  {spec.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-8 bg-gradient-to-r from-green-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            <div className="group">
              <div className="text-5xl font-extrabold text-white mb-2 transition-transform group-hover:scale-110">
                {stats.total_clients}+
              </div>
              <div className="text-green-100 font-medium uppercase tracking-wide text-sm">{t('home.stats.clients')}</div>
            </div>
            <div className="group">
              <div className="text-5xl font-extrabold text-white mb-2 transition-transform group-hover:scale-110">
                {stats.total_tailors}+
              </div>
              <div className="text-green-100 font-medium uppercase tracking-wide text-sm">{t('home.stats.tailors')}</div>
            </div>
            <div className="group">
              <div className="text-5xl font-extrabold text-white mb-2 transition-transform group-hover:scale-110">
                {stats.total_designs}+
              </div>
              <div className="text-green-100 font-medium uppercase tracking-wide text-sm">{t('home.stats.designs')}</div>
            </div>
            <div className="group">
              <div className="text-5xl font-extrabold text-white mb-2 transition-transform group-hover:scale-110">
                {stats.completed_orders}+
              </div>
              <div className="text-green-100 font-medium uppercase tracking-wide text-sm">{t('home.stats.orders')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">{t('home.features.title')}</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {t('home.features.subtitle')}
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              {t('home.features.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="absolute -top-6 left-6 flex items-center justify-center h-12 w-12 rounded-xl bg-green-500 text-white shadow-lg text-2xl">
                📏
              </div>
              <h3 className="mt-8 text-lg font-bold text-gray-900">{t('home.features.measurements.title')}</h3>
              <p className="mt-2 text-base text-gray-500">
                {t('home.features.measurements.description')}
              </p>
            </div>

            <div className="relative p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="absolute -top-6 left-6 flex items-center justify-center h-12 w-12 rounded-xl bg-blue-500 text-white shadow-lg text-2xl">
                💬
              </div>
              <h3 className="mt-8 text-lg font-bold text-gray-900">{t('home.features.chat.title')}</h3>
              <p className="mt-2 text-base text-gray-500">
                {t('home.features.chat.description')}
              </p>
            </div>

            <div className="relative p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="absolute -top-6 left-6 flex items-center justify-center h-12 w-12 rounded-xl bg-purple-500 text-white shadow-lg text-2xl">
                👗
              </div>
              <h3 className="mt-8 text-lg font-bold text-gray-900">{t('home.features.designs.title')}</h3>
              <p className="mt-2 text-base text-gray-500">
                {t('home.features.designs.description')}
              </p>
            </div>

            <div className="relative p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="absolute -top-6 left-6 flex items-center justify-center h-12 w-12 rounded-xl bg-orange-500 text-white shadow-lg text-2xl">
                🛡️
              </div>
              <h3 className="mt-8 text-lg font-bold text-gray-900">{t('home.features.payments.title')}</h3>
              <p className="mt-2 text-base text-gray-500">
                {t('home.features.payments.description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Tailors */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-green-600 font-bold tracking-wide uppercase text-sm mb-2">{t('home.tailors.sectionLabel')}</h2>
              <p className="text-4xl font-bold text-gray-900">{t('home.tailors.title')}</p>
            </div>
            <Link href="/tailors" className="text-green-600 font-bold hover:underline flex items-center gap-1">
              {t('home.tailors.viewAll')}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {tailors.map(tailor => (
              <Link key={tailor.id} href={`/tailors/${tailor.user.id}`} className="group bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                    🧵
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-green-700 transition-colors">{tailor.user.username}</h3>
                    <p className="text-green-600 text-sm font-medium">{tailor.specialty}</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{tailor.bio}</p>
                <div className="flex items-center text-sm text-gray-400 gap-4">
                  <span>📍 {tailor.location}</span>
                  <span>⭐ {tailor.experience} {t('home.tailors.experience')}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Designs */}
      <div className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-green-600 font-bold tracking-wide uppercase text-sm mb-2">{t('home.designs.sectionLabel')}</h2>
              <p className="text-4xl font-bold text-gray-900">{t('home.designs.title')}</p>
            </div>
            <Link href="/designs" className="text-green-600 font-bold hover:underline flex items-center gap-1">
              {t('home.designs.viewAll')}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {designs.map(d => (
              <Link key={d.id} href={`/designs/${d.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all">
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                  {d.image ? (
                    <img src={d.image} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      <span className="text-4xl">👗</span>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-sm font-bold shadow-sm">
                    {d.price} GNF
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{d.title}</h3>
                  <p className="text-gray-500 text-sm">{t('home.designs.by')} {d.tailor_name || 'Expert Tailor'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/fabric-of-squares.png')]"></div>
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">{t('home.cta.title')}</h2>
          <p className="text-green-200 text-xl mb-10">{t('home.cta.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="bg-white text-green-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors">
              {t('home.cta.getStarted')}
            </Link>
            <Link href="/tailors" className="border-2 border-green-400 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-800 transition-colors">
              {t('home.cta.browseTailors')}
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
