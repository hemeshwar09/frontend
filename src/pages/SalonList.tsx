import { useState, useEffect } from 'react';
import { Search, MapPin, Star, SlidersHorizontal, Award, Sparkles, X } from 'lucide-react';
import { supabase, Salon } from '../lib/supabase';

type SalonListProps = {
  onNavigate: (page: string, params?: any) => void;
  initialFilters?: {
    search?: string;
    city?: string;
    category?: string;
    sort?: string;
  };
};

export const SalonList = ({ onNavigate, initialFilters = {} }: SalonListProps) => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
  const [city, setCity] = useState(initialFilters.city || '');
  const [category, setCategory] = useState(initialFilters.category || '');
  const [priceRange, setPriceRange] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState(initialFilters.sort || 'rating');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadSalons();
  }, [searchQuery, city, category, priceRange, minRating, sortBy]);

  const loadSalons = async () => {
    setLoading(true);
    try {
      let query = supabase.from('salons').select('*');

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (city) {
        query = query.ilike('city', `%${city}%`);
      }

      if (priceRange) {
        query = query.eq('price_range', priceRange);
      }

      if (minRating) {
        query = query.gte('rating', parseFloat(minRating));
      }

      if (sortBy === 'rating') {
        query = query.order('rating', { ascending: false });
      } else if (sortBy === 'reviews') {
        query = query.order('total_reviews', { ascending: false });
      } else if (sortBy === 'name') {
        query = query.order('name', { ascending: true });
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data || [];

      if (category) {
        const serviceQuery = await supabase
          .from('services')
          .select('salon_id')
          .eq('category', category);

        if (serviceQuery.data) {
          const salonIds = serviceQuery.data.map(s => s.salon_id);
          filteredData = filteredData.filter(salon => salonIds.includes(salon.id));
        }
      }

      setSalons(filteredData);
    } catch (error) {
      console.error('Error loading salons:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCity('');
    setCategory('');
    setPriceRange('');
    setMinRating('');
    setSortBy('rating');
  };

  const hasActiveFilters = searchQuery || city || category || priceRange || minRating;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search salons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="City..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2 font-semibold text-slate-700"
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filters
            {hasActiveFilters && (
              <span className="bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Service Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                >
                  <option value="">All Services</option>
                  <option value="haircut">Haircut</option>
                  <option value="coloring">Hair Coloring</option>
                  <option value="styling">Styling</option>
                  <option value="spa">Spa</option>
                  <option value="facial">Facial</option>
                  <option value="makeup">Makeup</option>
                  <option value="bridal">Bridal</option>
                  <option value="massage">Massage</option>
                  <option value="nails">Nails</option>
                  <option value="waxing">Waxing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                >
                  <option value="">All Prices</option>
                  <option value="budget">Budget</option>
                  <option value="moderate">Moderate</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-slate-600">Loading salons...</p>
        </div>
      ) : salons.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">
              {salons.length} Salon{salons.length !== 1 ? 's' : ''} Found
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} onNavigate={onNavigate} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto">
            <Sparkles className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No Salons Found</h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your filters or search criteria
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all shadow-lg"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
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
        {salon.featured && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">
          {salon.name}
        </h3>
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
          {salon.description || 'Professional salon services'}
        </p>
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
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
