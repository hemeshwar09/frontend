import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { SalonList } from './pages/SalonList';
import { SalonDetail } from './pages/SalonDetail';
import { Booking } from './pages/Booking';
import { Account } from './pages/Account';
import { Dashboard } from './pages/Dashboard';

type Page = 'home' | 'signin' | 'signup' | 'salons' | 'salon-detail' | 'booking' | 'account' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageParams, setPageParams] = useState<any>({});

  const navigate = (page: Page, params?: any) => {
    setCurrentPage(page);
    setPageParams(params || {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'signin':
        return <SignIn onNavigate={navigate} />;
      case 'signup':
        return <SignUp onNavigate={navigate} />;
      case 'salons':
        return <SalonList onNavigate={navigate} initialFilters={pageParams} />;
      case 'salon-detail':
        return <SalonDetail salonId={pageParams.id} onNavigate={navigate} />;
      case 'booking':
        return <Booking salonId={pageParams.salonId} serviceId={pageParams.serviceId} onNavigate={navigate} />;
      case 'account':
        return <Account onNavigate={navigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <Layout currentPage={currentPage} onNavigate={navigate}>
        {renderPage()}
      </Layout>
    </AuthProvider>
  );
}

export default App;
