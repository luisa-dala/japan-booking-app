'use client';

import { useState, useEffect, useRef } from 'react';

type Listing = {
  id: number;
  name: string;
  description: string;
  location: string;
  prefecture: string;
  type: string;
  price_per_night: number;
  rating: number;
};

const TYPE_LABELS: Record<string, string> = {
  hotel: 'Hotel',
  ryokan: 'Ryokan',
  hostel: 'Hostel',
  minshuku: 'Minshuku',
};

const TYPE_GRADIENTS: Record<string, string> = {
  hotel: 'from-blue-500 to-cyan-600',
  ryokan: 'from-amber-500 to-red-700',
  hostel: 'from-emerald-500 to-teal-700',
  minshuku: 'from-purple-500 to-indigo-700',
};

const PRICE_RANGES = [
  { label: 'All prices', min: 0, max: 999999 },
  { label: 'Under ¥10,000', min: 0, max: 9999 },
  { label: '¥10,000–¥30,000', min: 10000, max: 30000 },
  { label: 'Over ¥30,000', min: 30001, max: 999999 },
];

function formatYen(n: number) {
  return '¥' + n.toLocaleString('en-US');
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    priceRange: 0,
    sort: 'price_asc',
  });
  const listingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const range = PRICE_RANGES[filters.priceRange];
    const params = new URLSearchParams();
    if (filters.location) params.set('location', filters.location);
    if (filters.type) params.set('type', filters.type);
    params.set('minPrice', String(range.min));
    params.set('maxPrice', String(range.max));
    params.set('sort', filters.sort);

    setLoading(true);
    fetch(`/api/listings?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setListings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters]);

  const handleSearch = () => {
    setFilters((f) => ({ ...f, location: searchInput }));
    listingsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-red-600">Japan</span>Stay
          </span>
          <nav className="hidden sm:flex gap-6 text-sm text-stone-600">
            <span className="hover:text-stone-900 cursor-pointer">Home</span>
            <span className="hover:text-stone-900 cursor-pointer">Listings</span>
            <span className="hover:text-stone-900 cursor-pointer">About</span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-red-800 to-amber-700 text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Find your perfect stay in Japan
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-10">
            Discover hotels, ryokans, and guesthouses across all 47 prefectures
          </p>
          <div className="flex gap-2 max-w-lg mx-auto bg-white rounded-xl p-2 shadow-2xl">
            <input
              type="text"
              placeholder="Search by city or prefecture (e.g. Kyoto, Tokyo, Hakone)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-3 text-stone-900 rounded-lg outline-none placeholder:text-stone-400"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Listings + Filters */}
      <main ref={listingsRef} className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <select
            value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
            className="px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-sm font-medium outline-none focus:border-red-500"
          >
            <option value="">All types</option>
            <option value="hotel">Hotel</option>
            <option value="ryokan">Ryokan</option>
            <option value="hostel">Hostel</option>
            <option value="minshuku">Minshuku</option>
          </select>

          <select
            value={filters.priceRange}
            onChange={(e) => setFilters((f) => ({ ...f, priceRange: Number(e.target.value) }))}
            className="px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-sm font-medium outline-none focus:border-red-500"
          >
            {PRICE_RANGES.map((r, i) => (
              <option key={i} value={i}>{r.label}</option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
            className="px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-sm font-medium outline-none focus:border-red-500"
          >
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Top Rated</option>
          </select>

          {filters.location && (
            <button
              onClick={() => { setFilters((f) => ({ ...f, location: '' })); setSearchInput(''); }}
              className="px-3 py-2.5 rounded-lg bg-stone-100 text-sm font-medium hover:bg-stone-200 transition-colors"
            >
              Location: {filters.location} ✕
            </button>
          )}
        </div>

        <p className="text-stone-500 text-sm mb-6">
          {loading ? 'Loading…' : `${listings.length} stay${listings.length !== 1 ? 's' : ''} found`}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden animate-pulse">
                <div className="h-44 bg-stone-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-stone-200 rounded w-3/4" />
                  <div className="h-4 bg-stone-200 rounded w-1/2" />
                  <div className="h-4 bg-stone-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-stone-500">
            No stays found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <div key={l.id} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-44 bg-gradient-to-br ${TYPE_GRADIENTS[l.type] || 'from-stone-400 to-stone-600'} flex items-end p-4`}>
                  <span className="px-3 py-1 bg-white/90 text-stone-800 text-xs font-semibold rounded-full">
                    {TYPE_LABELS[l.type] || l.type}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-lg leading-tight">{l.name}</h3>
                    <span className="flex items-center gap-1 text-sm font-medium text-amber-600 whitespace-nowrap">
                      ★ {Number(l.rating).toFixed(1)}
                    </span>
                  </div>
                  <p className="text-stone-500 text-sm mb-3">📍 {l.location}</p>
                  <p className="text-stone-600 text-sm mb-4 line-clamp-2">{l.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <span className="text-lg font-bold text-red-600">{formatYen(l.price_per_night)}</span>
                    <span className="text-stone-400 text-sm">per night</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>JapanStay — Your gateway to authentic Japanese accommodations</p>
        </div>
      </footer>
    </div>
  );
}
