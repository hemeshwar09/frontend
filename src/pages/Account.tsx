import { useState, useEffect } from 'react';
import { User, Calendar, Heart, Edit2, Save, X } from 'lucide-react';
import { supabase, Booking, Salon } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type AccountProps = {
  onNavigate: (page: string, params?: any) => void;
};

type BookingWithDetails = Booking & {
  salon: Salon;
  service: { name: string; price: number };
};

export const Account = ({ onNavigate }: AccountProps) => {
  const { user, profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'favorites'>('profile');
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [favorites, setFavorites] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');

  useEffect(() => {
    if (!user) {
      onNavigate('signin');
      return;
    }
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const [bookingsResult, favoritesResult] = await Promise.all([
        supabase
          .from('bookings')
          .select('*, salon:salons(*), service:services(name, price)')
          .eq('customer_id', user.id)
          .order('booking_date', { ascending: false }),
        supabase
          .from('favorites')
          .select('salon:salons(*)')
          .eq('user_id', user.id),
      ]);

      if (bookingsResult.data) {
        setBookings(bookingsResult.data as any);
      }
      if (favoritesResult.data) {
        setFavorites(favoritesResult.data.map(f => f.salon) as any);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    const { error } = await updateProfile({
      full_name: fullName,
      phone,
    });

    if (!error) {
      setEditing(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (!error) {
        loadUserData();
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const handleRemoveFavorite = async (salonId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('salon_id', salonId);

      setFavorites(favorites.filter(f => f.id !== salonId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  if (!profile) {
    return <div className="text-center py-16">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-slate-800 mb-8">My Account</h1>

      <div className="flex gap-4 mb-8 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 px-6 font-semibold transition-colors ${
            activeTab === 'profile'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-slate-600 hover:text-teal-600'
          }`}
        >
          <User className="inline h-5 w-5 mr-2" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-4 px-6 font-semibold transition-colors ${
            activeTab === 'bookings'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-slate-600 hover:text-teal-600'
          }`}
        >
          <Calendar className="inline h-5 w-5 mr-2" />
          My Bookings
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`pb-4 px-6 font-semibold transition-colors ${
            activeTab === 'favorites'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-slate-600 hover:text-teal-600'
          }`}
        >
          <Heart className="inline h-5 w-5 mr-2" />
          Favorites
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Profile Information</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-100 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFullName(profile.full_name || '');
                    setPhone(profile.phone || '');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                />
              ) : (
                <p className="text-lg text-slate-800">{profile.full_name || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <p className="text-lg text-slate-800">{profile.email}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
              {editing ? (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                />
              ) : (
                <p className="text-lg text-slate-800">{profile.phone || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Account Type</label>
              <div className="inline-flex px-4 py-2 bg-teal-100 text-teal-700 rounded-xl font-semibold capitalize">
                {profile.role.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-16">Loading bookings...</div>
          ) : bookings.length > 0 ? (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{booking.salon.name}</h3>
                    <p className="text-slate-600">{booking.service.name}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-500">Date</p>
                    <p className="font-semibold text-slate-800">
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Time</p>
                    <p className="font-semibold text-slate-800">{booking.booking_time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Price</p>
                    <p className="font-semibold text-slate-800">₹{booking.total_price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Booked On</p>
                    <p className="font-semibold text-slate-800">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => onNavigate('salon-detail', { id: booking.salon_id })}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                  >
                    View Salon
                  </button>
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
              <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No Bookings Yet</h3>
              <p className="text-slate-600 mb-6">Start booking appointments with your favorite salons!</p>
              <button
                onClick={() => onNavigate('salons')}
                className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all shadow-lg font-semibold"
              >
                Browse Salons
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.length > 0 ? (
            favorites.map((salon) => (
              <div
                key={salon.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 group"
              >
                <div
                  className="h-48 bg-gradient-to-br from-teal-100 to-blue-100 cursor-pointer"
                  onClick={() => onNavigate('salon-detail', { id: salon.id })}
                >
                  {salon.cover_image ? (
                    <img
                      src={salon.cover_image}
                      alt={salon.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="h-16 w-16 text-teal-300" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{salon.name}</h3>
                  <p className="text-slate-600 mb-4 line-clamp-2">{salon.description}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => onNavigate('salon-detail', { id: salon.id })}
                      className="flex-1 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all font-semibold"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleRemoveFavorite(salon.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Heart className="h-5 w-5 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
              <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No Favorites Yet</h3>
              <p className="text-slate-600 mb-6">Start adding salons to your favorites!</p>
              <button
                onClick={() => onNavigate('salons')}
                className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all shadow-lg font-semibold"
              >
                Browse Salons
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
