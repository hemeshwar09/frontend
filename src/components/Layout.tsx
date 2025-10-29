import { ReactNode } from 'react';
import { Scissors, User, Heart, Calendar, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

type LayoutProps = {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
};

export const Layout = ({ children, currentPage, onNavigate }: LayoutProps) => {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
              <Scissors className="h-8 w-8 text-teal-600" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                StyleHub
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => onNavigate('home')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'home' ? 'bg-teal-50 text-teal-700 font-medium' : 'text-slate-600 hover:text-teal-600'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('salons')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'salons' ? 'bg-teal-50 text-teal-700 font-medium' : 'text-slate-600 hover:text-teal-600'
                }`}
              >
                Browse Salons
              </button>

              {user ? (
                <>
                  {profile?.role === 'salon_owner' && (
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === 'dashboard' ? 'bg-teal-50 text-teal-700 font-medium' : 'text-slate-600 hover:text-teal-600'
                      }`}
                    >
                      Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => onNavigate('account')}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-600 hover:text-teal-600 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>Account</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('signin')}
                    className="px-4 py-2 rounded-lg text-slate-600 hover:text-teal-600 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onNavigate('signup')}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-slate-200">
              <button
                onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                Home
              </button>
              <button
                onClick={() => { onNavigate('salons'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                Browse Salons
              </button>
              {user ? (
                <>
                  {profile?.role === 'salon_owner' && (
                    <button
                      onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                    >
                      Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => { onNavigate('account'); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                  >
                    Account
                  </button>
                  <button
                    onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { onNavigate('signin'); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { onNavigate('signup'); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 text-white"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-slate-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Scissors className="h-6 w-6 text-teal-400" />
                <span className="ml-2 text-xl font-bold">SalonFinder</span>
              </div>
              <p className="text-slate-400 text-sm">
                Discover the best salons near you. Style starts here.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => onNavigate('home')} className="hover:text-teal-400 transition-colors">Home</button></li>
                <li><button onClick={() => onNavigate('salons')} className="hover:text-teal-400 transition-colors">Browse Salons</button></li>
                <li><button className="hover:text-teal-400 transition-colors">About Us</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Haircuts & Styling</li>
                <li>Spa & Wellness</li>
                <li>Bridal Services</li>
                <li>Beauty Treatments</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>support@salonfinder.com</li>
                <li>1-800-SALON-GO</li>
                <li>FAQs</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2025 SalonFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
