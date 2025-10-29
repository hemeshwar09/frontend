import { useState, useEffect } from 'react';
import {
  Store,
  Calendar,
  DollarSign,
  Star,
  Plus,
  Edit2,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { supabase, Salon, Service, Booking, Stylist } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type DashboardProps = {
  onNavigate: (page: string, params?: any) => void;
};

type BookingWithDetails = Booking & {
  service: { name: string };
};

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'salon' | 'services' | 'bookings' | 'stylists'>('overview');
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateSalon, setShowCreateSalon] = useState(false);

  useEffect(() => {
    if (!user || profile?.role !== 'salon_owner') {
      onNavigate('home');
      return;
    }
    loadDashboardData();
  }, [user, profile]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const { data: salonData } = await supabase
        .from('salons')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (salonData) {
        setSalon(salonData);

        const [servicesResult, bookingsResult, stylistsResult] = await Promise.all([
          supabase.from('services').select('*').eq('salon_id', salonData.id),
          supabase
            .from('bookings')
            .select('*, service:services(name)')
            .eq('salon_id', salonData.id)
            .order('booking_date', { ascending: false }),
          supabase.from('stylists').select('*').eq('salon_id', salonData.id),
        ]);

        if (servicesResult.data) setServices(servicesResult.data);
        if (bookingsResult.data) setBookings(bookingsResult.data as any);
        if (stylistsResult.data) setStylists(stylistsResult.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = salon ? {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    totalRevenue: bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.total_price, 0),
    avgRating: salon.rating,
  } : null;

  if (loading) {
    return <div className="text-center py-16">Loading dashboard...</div>;
  }

  if (!salon) {
    return <CreateSalonForm onSuccess={loadDashboardData} />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-600">{salon.name}</p>
        </div>
        <button
          onClick={() => onNavigate('salon-detail', { id: salon.id })}
          className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-semibold"
        >
          View Public Page
        </button>
      </div>

      <div className="flex gap-4 mb-8 border-b border-slate-200 overflow-x-auto">
        <TabButton
          active={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
          icon={<DollarSign className="h-5 w-5" />}
          label="Overview"
        />
        <TabButton
          active={activeTab === 'salon'}
          onClick={() => setActiveTab('salon')}
          icon={<Store className="h-5 w-5" />}
          label="Salon Info"
        />
        <TabButton
          active={activeTab === 'services'}
          onClick={() => setActiveTab('services')}
          icon={<Star className="h-5 w-5" />}
          label="Services"
        />
        <TabButton
          active={activeTab === 'bookings'}
          onClick={() => setActiveTab('bookings')}
          icon={<Calendar className="h-5 w-5" />}
          label="Bookings"
        />
        <TabButton
          active={activeTab === 'stylists'}
          onClick={() => setActiveTab('stylists')}
          icon={<Edit2 className="h-5 w-5" />}
          label="Stylists"
        />
      </div>

      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Total Bookings"
              value={stats.totalBookings}
              icon={<Calendar className="h-8 w-8 text-blue-600" />}
              color="blue"
            />
            <StatCard
              title="Pending"
              value={stats.pendingBookings}
              icon={<Calendar className="h-8 w-8 text-yellow-600" />}
              color="yellow"
            />
            <StatCard
              title="Total Revenue"
              value={`₹${stats.totalRevenue}`}
              icon={<DollarSign className="h-8 w-8 text-green-600" />}
              color="green"
            />
            <StatCard
              title="Average Rating"
              value={stats.avgRating.toFixed(1)}
              icon={<Star className="h-8 w-8 text-yellow-500" />}
              color="yellow"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Bookings</h2>
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between py-4 border-b border-slate-200 last:border-0"
              >
                <div>
                  <p className="font-semibold text-slate-800">{booking.customer_name}</p>
                  <p className="text-sm text-slate-600">{booking.service.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">
                    {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                  </p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'salon' && <SalonInfoTab salon={salon} onUpdate={loadDashboardData} />}
      {activeTab === 'services' && <ServicesTab salonId={salon.id} services={services} onUpdate={loadDashboardData} />}
      {activeTab === 'bookings' && <BookingsTab bookings={bookings} onUpdate={loadDashboardData} />}
      {activeTab === 'stylists' && <StylistsTab salonId={salon.id} stylists={stylists} onUpdate={loadDashboardData} />}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`pb-4 px-6 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
      active ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-600 hover:text-teal-600'
    }`}
  >
    {icon}
    {label}
  </button>
);

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
    <div className={`inline-flex p-3 rounded-xl bg-${color}-50 mb-4`}>{icon}</div>
    <p className="text-sm text-slate-600 mb-1">{title}</p>
    <p className="text-3xl font-bold text-slate-800">{value}</p>
  </div>
);

const CreateSalonForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    area: '',
    phone: '',
    email: '',
    price_range: 'moderate' as 'budget' | 'moderate' | 'premium' | 'luxury',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('salons').insert({
        ...formData,
        owner_id: user?.id,
      });

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error creating salon:', error);
      alert('Failed to create salon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Create Your Salon</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Salon Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Area</label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Price Range</label>
              <select
                value={formData.price_range}
                onChange={(e) => setFormData({ ...formData, price_range: e.target.value as any })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
              >
                <option value="budget">Budget</option>
                <option value="moderate">Moderate</option>
                <option value="premium">Premium</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all shadow-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Salon'}
          </button>
        </form>
      </div>
    </div>
  );
};

const SalonInfoTab = ({ salon, onUpdate }: { salon: Salon; onUpdate: () => void }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(salon);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('salons')
        .update(formData)
        .eq('id', salon.id);

      if (!error) {
        setEditing(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating salon:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Salon Information</h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-100"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setFormData(salon);
              }}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <FormField
          label="Salon Name"
          value={formData.name}
          editing={editing}
          onChange={(value) => setFormData({ ...formData, name: value })}
        />
        <FormField
          label="Description"
          value={formData.description || ''}
          editing={editing}
          onChange={(value) => setFormData({ ...formData, description: value })}
          textarea
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Address"
            value={formData.address}
            editing={editing}
            onChange={(value) => setFormData({ ...formData, address: value })}
          />
          <FormField
            label="City"
            value={formData.city}
            editing={editing}
            onChange={(value) => setFormData({ ...formData, city: value })}
          />
          <FormField
            label="Area"
            value={formData.area || ''}
            editing={editing}
            onChange={(value) => setFormData({ ...formData, area: value })}
          />
          <FormField
            label="Phone"
            value={formData.phone || ''}
            editing={editing}
            onChange={(value) => setFormData({ ...formData, phone: value })}
          />
        </div>
      </div>
    </div>
  );
};

const FormField = ({ label, value, editing, onChange, textarea = false }: any) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
    {editing ? (
      textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
        />
      )
    ) : (
      <p className="text-lg text-slate-800">{value || 'Not set'}</p>
    )}
  </div>
);

const ServicesTab = ({ salonId, services, onUpdate }: any) => {
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await supabase.from('services').delete().eq('id', serviceId);
      onUpdate();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Services</h2>
        <button
          onClick={() => {
            setEditingService(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 font-semibold"
        >
          <Plus className="h-5 w-5" />
          Add Service
        </button>
      </div>

      {showForm && (
        <ServiceForm
          salonId={salonId}
          service={editingService}
          onClose={() => {
            setShowForm(false);
            setEditingService(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingService(null);
            onUpdate();
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service: Service) => (
          <div key={service.id} className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{service.name}</h3>
                <p className="text-sm text-slate-600 capitalize">{service.category}</p>
              </div>
              <span className="text-xl font-bold text-teal-600">₹{service.price}</span>
            </div>
            {service.description && <p className="text-slate-600 text-sm mb-4">{service.description}</p>}
            <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
              <span>{service.duration_minutes} min</span>
              <span className={`px-3 py-1 rounded-full ${service.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {service.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingService(service);
                  setShowForm(true);
                }}
                className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ServiceForm = ({ salonId, service, onClose, onSuccess }: any) => {
  const [formData, setFormData] = useState(
    service || {
      name: '',
      description: '',
      category: 'haircut',
      price: 0,
      duration_minutes: 30,
      available: true,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (service) {
        await supabase.from('services').update(formData).eq('id', service.id);
      } else {
        await supabase.from('services').insert({ ...formData, salon_id: salonId });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <h3 className="text-xl font-bold text-slate-800 mb-6">{service ? 'Edit Service' : 'Add New Service'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Service Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
            >
              <option value="haircut">Haircut</option>
              <option value="coloring">Coloring</option>
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
            <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹)</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (minutes)</label>
            <input
              type="number"
              required
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="available"
            checked={formData.available}
            onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
            className="w-5 h-5 text-teal-600"
          />
          <label htmlFor="available" className="text-sm font-semibold text-slate-700">Available</label>
        </div>
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            className="flex-1 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold"
          >
            {service ? 'Update' : 'Create'} Service
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const BookingsTab = ({ bookings, onUpdate }: any) => {
  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      await supabase.from('bookings').update({ status }).eq('id', bookingId);
      onUpdate();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Bookings</h2>
      {bookings.length > 0 ? (
        bookings.map((booking: BookingWithDetails) => (
          <div key={booking.id} className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{booking.customer_name}</h3>
                <div className="space-y-1 text-sm text-slate-600">
                  <p>Service: {booking.service.name}</p>
                  <p>Phone: {booking.customer_phone}</p>
                  <p>Email: {booking.customer_email}</p>
                  {booking.notes && <p>Notes: {booking.notes}</p>}
                </div>
              </div>
              <div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Date:</span> {new Date(booking.booking_date).toLocaleDateString()}</p>
                  <p><span className="font-semibold">Time:</span> {booking.booking_time}</p>
                  <p><span className="font-semibold">Price:</span> ₹{booking.total_price}</p>
                  <div>
                    <label className="block font-semibold mb-1">Status:</label>
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                      className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
          <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">No bookings yet</p>
        </div>
      )}
    </div>
  );
};

const StylistsTab = ({ salonId, stylists, onUpdate }: any) => {
  const [showForm, setShowForm] = useState(false);
  const [editingStylist, setEditingStylist] = useState<Stylist | null>(null);

  const handleDelete = async (stylistId: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await supabase.from('stylists').delete().eq('id', stylistId);
      onUpdate();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Team Members</h2>
        <button
          onClick={() => {
            setEditingStylist(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold"
        >
          <Plus className="h-5 w-5" />
          Add Stylist
        </button>
      </div>

      {showForm && (
        <StylistForm
          salonId={salonId}
          stylist={editingStylist}
          onClose={() => {
            setShowForm(false);
            setEditingStylist(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingStylist(null);
            onUpdate();
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stylists.map((stylist: Stylist) => (
          <div key={stylist.id} className="bg-white rounded-2xl shadow-lg p-6 text-center border border-slate-200">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
              {stylist.photo_url ? (
                <img src={stylist.photo_url} alt={stylist.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <Edit2 className="h-8 w-8 text-teal-600" />
              )}
            </div>
            <h3 className="font-bold text-slate-800 mb-1">{stylist.name}</h3>
            {stylist.bio && <p className="text-sm text-slate-600 mb-3">{stylist.bio}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingStylist(stylist);
                  setShowForm(true);
                }}
                className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(stylist.id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StylistForm = ({ salonId, stylist, onClose, onSuccess }: any) => {
  const [formData, setFormData] = useState(
    stylist || { name: '', bio: '', specialties: [], available: true }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (stylist) {
        await supabase.from('stylists').update(formData).eq('id', stylist.id);
      } else {
        await supabase.from('stylists').insert({ ...formData, salon_id: salonId });
      }
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <h3 className="text-xl font-bold text-slate-800 mb-6">{stylist ? 'Edit' : 'Add'} Stylist</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            className="flex-1 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold"
          >
            {stylist ? 'Update' : 'Add'} Stylist
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
