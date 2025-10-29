import { useState, useEffect } from 'react';
import {
  MapPin,
  Star,
  Clock,
  Phone,
  Mail,
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  User
} from 'lucide-react';
import { supabase, Salon, Service, Review, Stylist } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type SalonDetailProps = {
  salonId: string;
  onNavigate: (page: string, params?: any) => void;
};

export const SalonDetail = ({ salonId, onNavigate }: SalonDetailProps) => {
  const { user } = useAuth();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadSalonDetails();
  }, [salonId]);

  const loadSalonDetails = async () => {
    try {
      const [salonResult, servicesResult, reviewsResult, stylistsResult] = await Promise.all([
        supabase.from('salons').select('*').eq('id', salonId).maybeSingle(),
        supabase.from('services').select('*').eq('salon_id', salonId).eq('available', true),
        supabase.from('reviews').select('*').eq('salon_id', salonId).order('created_at', { ascending: false }).limit(10),
        supabase.from('stylists').select('*').eq('salon_id', salonId).eq('available', true),
      ]);

      if (salonResult.data) setSalon(salonResult.data);
      if (servicesResult.data) setServices(servicesResult.data);
      if (reviewsResult.data) setReviews(reviewsResult.data);
      if (stylistsResult.data) setStylists(stylistsResult.data);

      if (user && salonResult.data) {
        const { data: favoriteData } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('salon_id', salonId)
          .maybeSingle();
        setIsFavorite(!!favoriteData);
      }
    } catch (error) {
      console.error('Error loading salon details:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      onNavigate('signin');
      return;
    }

    try {
      if (isFavorite) {
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('salon_id', salonId);
        setIsFavorite(false);
      } else {
        await supabase.from('favorites').insert({ user_id: user.id, salon_id: salonId });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Salon Not Found</h2>
        <button
          onClick={() => onNavigate('salons')}
          className="text-teal-600 hover:text-teal-700 font-semibold"
        >
          Browse All Salons
        </button>
      </div>
    );
  }

  const images = salon.cover_image ? [salon.cover_image, ...salon.images] : salon.images;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="space-y-8">
      <button
        onClick={() => onNavigate('salons')}
        className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
        Back to Salons
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {images.length > 0 ? (
          <div className="relative h-96 bg-gradient-to-br from-teal-100 to-blue-100">
            <img
              src={images[currentImageIndex]}
              alt={salon.name}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                >
                  <ChevronLeft className="h-6 w-6 text-slate-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                >
                  <ChevronRight className="h-6 w-6 text-slate-800" />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="h-96 bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
            <Award className="h-32 w-32 text-teal-300" />
          </div>
        )}

        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold text-slate-800">{salon.name}</h1>
                {salon.verified && (
                  <div className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    Verified
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <div className="flex items-center gap-1">
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold text-slate-800">{salon.rating.toFixed(1)}</span>
                  <span>({salon.total_reviews} reviews)</span>
                </div>
                <div className="px-3 py-1 bg-slate-100 rounded-full font-medium capitalize">
                  {salon.price_range}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={toggleFavorite}
                className={`p-3 rounded-full transition-all ${
                  isFavorite
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full transition-all">
                <Share2 className="h-6 w-6" />
              </button>
            </div>
          </div>

          {salon.description && (
            <p className="text-lg text-slate-600 mb-6">{salon.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold text-slate-800 mb-1">Address</div>
                <div className="text-slate-600">
                  {salon.address}
                  {salon.area && `, ${salon.area}`}, {salon.city}
                </div>
              </div>
            </div>
            {salon.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-slate-800 mb-1">Phone</div>
                  <a href={`tel:${salon.phone}`} className="text-teal-600 hover:text-teal-700">
                    {salon.phone}
                  </a>
                </div>
              </div>
            )}
            {salon.email && (
              <div className="flex items-start gap-3">
                <Mail className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-slate-800 mb-1">Email</div>
                  <a href={`mailto:${salon.email}`} className="text-teal-600 hover:text-teal-700">
                    {salon.email}
                  </a>
                </div>
              </div>
            )}
            {salon.working_hours && Object.keys(salon.working_hours).length > 0 && (
              <div className="flex items-start gap-3">
                <Clock className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-slate-800 mb-1">Working Hours</div>
                  <div className="text-slate-600 text-sm">
                    {Object.entries(salon.working_hours).map(([day, hours]) => (
                      <div key={day}>{`${day}: ${hours}`}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {services.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Services</h2>
          <div className="space-y-6">
            {Object.entries(groupedServices).map(([category, categoryServices]) => (
              <div key={category}>
                <h3 className="text-xl font-bold text-slate-700 mb-4 capitalize">
                  {category.replace('_', ' ')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryServices.map((service) => (
                    <div
                      key={service.id}
                      className="border-2 border-slate-200 rounded-xl p-4 hover:border-teal-500 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-slate-800">{service.name}</h4>
                        <span className="text-lg font-bold text-teal-600">₹{service.price}</span>
                      </div>
                      {service.description && (
                        <p className="text-sm text-slate-600 mb-2">{service.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration_minutes} min</span>
                      </div>
                      <button
                        onClick={() => onNavigate('booking', { salonId, serviceId: service.id })}
                        className="mt-3 w-full py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all font-semibold"
                      >
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stylists.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stylists.map((stylist) => (
              <div key={stylist.id} className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center overflow-hidden">
                  {stylist.photo_url ? (
                    <img src={stylist.photo_url} alt={stylist.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-teal-600" />
                  )}
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{stylist.name}</h3>
                {stylist.bio && <p className="text-sm text-slate-600 mb-2">{stylist.bio}</p>}
                {stylist.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {stylist.specialties.map((specialty, idx) => (
                      <span key={idx} className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-slate-200 pb-6 last:border-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && <p className="text-slate-700">{review.comment}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
