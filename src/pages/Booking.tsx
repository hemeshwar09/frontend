import { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone
} from 'lucide-react';
import { supabase, Salon, Service, Stylist } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type BookingProps = {
  salonId: string;
  serviceId?: string;
  onNavigate: (page: string, params?: any) => void;
};

export const Booking = ({ salonId, serviceId, onNavigate }: BookingProps) => {
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [selectedService, setSelectedService] = useState<string>(serviceId || '');
  const [selectedStylist, setSelectedStylist] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState(profile?.full_name || '');
  const [customerEmail, setCustomerEmail] = useState(profile?.email || '');
  const [customerPhone, setCustomerPhone] = useState(profile?.phone || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  useEffect(() => {
    if (!user) {
      onNavigate('signin');
      return;
    }
    loadBookingData();
  }, [salonId, user]);

  const loadBookingData = async () => {
    try {
      const [salonResult, servicesResult, stylistsResult] = await Promise.all([
        supabase.from('salons').select('*').eq('id', salonId).maybeSingle(),
        supabase.from('services').select('*').eq('salon_id', salonId).eq('available', true),
        supabase.from('stylists').select('*').eq('salon_id', salonId).eq('available', true),
      ]);

      if (salonResult.data) setSalon(salonResult.data);
      if (servicesResult.data) setServices(servicesResult.data);
      if (stylistsResult.data) setStylists(stylistsResult.data);
    } catch (error) {
      console.error('Error loading booking data:', error);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }
    return slots;
  };

  const handleSubmit = async () => {
    if (!user || !selectedService || !selectedDate || !selectedTime) return;

    setLoading(true);
    try {
      const service = services.find(s => s.id === selectedService);
      if (!service) return;

      const { error } = await supabase.from('bookings').insert({
        customer_id: user.id,
        salon_id: salonId,
        service_id: selectedService,
        stylist_id: selectedStylist || null,
        booking_date: selectedDate,
        booking_time: selectedTime,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        notes,
        total_price: service.price,
        status: 'pending',
      });

      if (error) throw error;

      setBookingComplete(true);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceedToNextStep = () => {
    if (step === 1) return selectedService !== '';
    if (step === 2) return selectedDate !== '' && selectedTime !== '';
    if (step === 3) return customerName && customerEmail && customerPhone;
    return false;
  };

  if (!salon) {
    return <div className="text-center py-16">Loading...</div>;
  }

  if (bookingComplete) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-12 text-center border border-slate-200">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Booking Confirmed!</h2>
          <p className="text-lg text-slate-600 mb-8">
            Your appointment at <span className="font-semibold">{salon.name}</span> has been successfully booked.
            <br />
            Confirmation details have been sent to {customerEmail}.
          </p>
          <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-slate-800 mb-4">Booking Details</h3>
            <div className="space-y-2 text-slate-600">
              <div><span className="font-medium">Service:</span> {services.find(s => s.id === selectedService)?.name}</div>
              <div><span className="font-medium">Date:</span> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div><span className="font-medium">Time:</span> {selectedTime}</div>
              {selectedStylist && <div><span className="font-medium">Stylist:</span> {stylists.find(s => s.id === selectedStylist)?.name}</div>}
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onNavigate('account')}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all shadow-lg font-semibold"
            >
              View My Bookings
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => onNavigate('salon-detail', { id: salonId })}
        className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Salon
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Book Appointment</h1>
        <p className="text-slate-600 mb-8">at {salon.name}</p>

        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s
                    ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    step > s ? 'bg-gradient-to-r from-teal-600 to-blue-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Select Service</h2>
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedService === service.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-800">{service.name}</h3>
                      {service.description && (
                        <p className="text-sm text-slate-600 mt-1">{service.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {service.duration_minutes} min
                        </span>
                        <span className="px-2 py-1 bg-slate-100 rounded-full capitalize">
                          {service.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-teal-600">₹{service.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {stylists.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Choose Stylist (Optional)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div
                    onClick={() => setSelectedStylist('')}
                    className={`p-4 border-2 rounded-xl cursor-pointer text-center transition-all ${
                      selectedStylist === ''
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <User className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                    <div className="font-semibold text-slate-800">No Preference</div>
                  </div>
                  {stylists.map((stylist) => (
                    <div
                      key={stylist.id}
                      onClick={() => setSelectedStylist(stylist.id)}
                      className={`p-4 border-2 rounded-xl cursor-pointer text-center transition-all ${
                        selectedStylist === stylist.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
                        {stylist.photo_url ? (
                          <img src={stylist.photo_url} alt={stylist.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <User className="h-6 w-6 text-teal-600" />
                        )}
                      </div>
                      <div className="font-semibold text-slate-800">{stylist.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Select Date & Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  <CalendarIcon className="inline h-5 w-5 mr-2" />
                  Choose Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={minDate}
                  max={maxDate}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  <Clock className="inline h-5 w-5 mr-2" />
                  Choose Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                >
                  <option value="">Select time</option>
                  {generateTimeSlots().map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Confirm Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <User className="inline h-5 w-5 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Mail className="inline h-5 w-5 mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Phone className="inline h-5 w-5 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  placeholder="Any special requirements..."
                />
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-bold text-slate-800 mb-4">Booking Summary</h3>
                <div className="space-y-2 text-slate-600">
                  <div><span className="font-medium">Service:</span> {services.find(s => s.id === selectedService)?.name}</div>
                  <div><span className="font-medium">Date:</span> {new Date(selectedDate).toLocaleDateString()}</div>
                  <div><span className="font-medium">Time:</span> {selectedTime}</div>
                  {selectedStylist && <div><span className="font-medium">Stylist:</span> {stylists.find(s => s.id === selectedStylist)?.name}</div>}
                  <div className="pt-2 border-t border-slate-200">
                    <span className="font-medium">Total:</span>{' '}
                    <span className="text-xl font-bold text-teal-600">
                      ₹{services.find(s => s.id === selectedService)?.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-semibold flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceedToNextStep()}
              className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all shadow-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !canProceedToNextStep()}
              className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
