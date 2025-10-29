import { useState, useEffect } from 'react';
import { Search, MapPin, Star, TrendingUp, Award, Sparkles } from 'lucide-react';
import { supabase, Salon } from '../lib/supabase';

type HomeProps = {
  onNavigate: (page: string, params?: any) => void;
};

export const Home = ({ onNavigate }: HomeProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [featuredSalons, setFeaturedSalons] = useState<Salon[]>([]);
  const [topRatedSalons, setTopRatedSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSalons();
  }, []);

  const loadSalons = async () => {
    try {
      const [featuredResult, topRatedResult] = await Promise.all([
        supabase
          .from('salons')
          .select('*')
          .eq('featured', true)
          .limit(6),
        supabase
          .from('salons')
          .select('*')
          .order('rating', { ascending: false })
          .limit(6)
      ]);

      if (featuredResult.data) setFeaturedSalons(featuredResult.data);
      if (topRatedResult.data) setTopRatedSalons(topRatedResult.data);
    } catch (error) {
      console.error('Error loading salons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    onNavigate('salons', { search: searchQuery, city: searchCity });
  };

  const serviceCategories = [
    { name: "Men's Haircut", icon: '✂️', category: 'haircut' },
    { name: 'Spa & Wellness', icon: '💆', category: 'spa' },
    { name: 'Bridal Services', icon: '👰', category: 'bridal' },
    { name: 'Hair Coloring', icon: '🎨', category: 'coloring' },
    { name: 'Facial Treatments', icon: '✨', category: 'facial' },
    { name: 'Makeup', icon: '💄', category: 'makeup' },
  ];

  return (
    <div className="space-y-16">
      <section className="relative py-20 px-4 rounded-3xl overflow-hidden bg-gradient-to-br from-teal-500 via-blue-500 to-teal-600 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-12 w-12 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Discover the Best Salons Near You
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-50">
            Style Starts Here — Book your next appointment with ease
          </p>

          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by salon name or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none text-slate-800 text-lg"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="City or area..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none text-slate-800 text-lg"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                Search
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="text-blue-100 text-sm">Popular:</span>
            {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune'].map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSearchCity(city);
                  onNavigate('salons', { city });
                }}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm hover:bg-white/30 transition-all"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Browse by Service</h2>
          <p className="text-lg text-slate-600">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {serviceCategories.map((service) => (
            <button
              key={service.category}
              onClick={() => onNavigate('salons', { category: service.category })}
              className="group p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-teal-500"
            >
              <div className="text-4xl mb-3">{service.icon}</div>
              <h3 className="font-semibold text-slate-800 group-hover:text-teal-600 transition-colors">
                {service.name}
              </h3>
            </button>
          ))}
        </div>
      </section>

      {featuredSalons.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-teal-600" />
              <h2 className="text-4xl font-bold text-slate-800">Featured Salons</h2>
            </div>
            <button
              onClick={() => onNavigate('salons')}
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}

      {topRatedSalons.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <h2 className="text-4xl font-bold text-slate-800">Top Rated Salons</h2>
            </div>
            <button
              onClick={() => onNavigate('salons', { sort: 'rating' })}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRatedSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}

      {!loading && featuredSalons.length === 0 && topRatedSalons.length === 0 && (
        <section className="text-center py-16">
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto">
            <Sparkles className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No Salons Available Yet</h3>
            <p className="text-slate-600 mb-6">
              Be the first to add your salon to our platform!
            </p>
            <button
              onClick={() => onNavigate('signup')}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all shadow-lg"
            >
              Register Your Salon
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

const SalonCard = ({ salon, onNavigate }: { salon: Salon; onNavigate: (page: string, params?: any) => void }) => {
  return (
    <div
      onClick={() => onNavigate('salon-detail', { id: salon.id })}
      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all cursor-pointer overflow-hidden border-2 border-transparent hover:border-teal-500 hover:-translate-y-2"
    >
      <div className="relative h-48 bg-gradient-to-br from-teal-100 to-blue-100 overflow-hidden">
        {salon.cover_image ? (
          <img
            src={salon.cover_image}
            alt={salon.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sparkles className="h-16 w-16 text-teal-300" />
          </div>
        )}
        {salon.verified && (
          <div className="absolute top-3 right-3 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Award className="h-3 w-3" />
            Verified
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">
          {salon.name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
          <MapPin className="h-4 w-4" />
          <span>{salon.area ? `${salon.area}, ${salon.city}` : salon.city}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-slate-800">{salon.rating.toFixed(1)}</span>
            <span className="text-sm text-slate-500">({salon.total_reviews})</span>
          </div>
          <div className="px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-700 capitalize">
            {salon.price_range}
          </div>
        </div>
      </div>
    </div>
  );
};
