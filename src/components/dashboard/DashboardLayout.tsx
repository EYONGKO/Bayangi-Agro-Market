import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, Store, PlusSquare, Wallet, User, LogIn, LogOut, Package, ShoppingBag, BarChart3 } from 'lucide-react';
import AnnouncementBar from '../AnnouncementBar';
import EcommerceHeader from '../EcommerceHeader';
import CategoryNavigation from '../CategoryNavigation';
import { useAuth } from '../../context/AuthContext';
import SiteFooter from '../SiteFooter';

const navItems = [
  { to: '/seller', label: 'Dashboard', icon: <Home size={20} /> },
  { to: '/chat', label: 'Chat', icon: <MessageCircle size={20} /> },
  { to: '/global-market', label: 'Marketplace', icon: <Store size={20} /> },
  { to: '/add-product', label: 'Add Product', icon: <PlusSquare size={20} /> },
  { to: '/recent-products', label: 'Recent Products', icon: <Package size={20} /> },
  { to: '/account/orders', label: 'Recent Orders', icon: <ShoppingBag size={20} /> },
  { to: '/performance', label: 'Performance', icon: <BarChart3 size={20} /> },
  { to: '/wallet', label: 'Wallet', icon: <Wallet size={20} /> },
  { to: '/account', label: 'Profile', icon: <User size={20} /> }
];

// Filter out duplicates to ensure only one Dashboard item
const filteredNavItems = navItems.filter((item, index, self) => 
  self.findIndex(i => i.label === item.label) === index
);

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex flex-col">
      <AnnouncementBar />
      <EcommerceHeader />
      <CategoryNavigation />

      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar */}
        <aside className="w-24 lg:w-72 bg-white/85 backdrop-blur border-r border-slate-200 flex-shrink-0">
          <div className="p-4 lg:p-6">
            <div className="hidden lg:block mb-5">
              <div className="text-xs font-extrabold tracking-widest text-slate-500 uppercase">Dashboard</div>
              <div className="text-lg font-extrabold text-slate-900">Center</div>
            </div>
            <nav className="space-y-2" id="main-nav">
              {filteredNavItems.map((item) => {
                const active = location.pathname === item.to || 
                  (item.to === '/dashboard' && location.pathname.startsWith('/dashboard'));
                return (
                  <Link
                    key={`${item.to}-${item.label}`}
                    to={item.to}
                    className={`group flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-start gap-1 lg:gap-3 px-2 lg:px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                      active
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    data-nav-item={item.label}
                  >
                    <span className={`transition-colors ${active ? 'text-emerald-700' : 'text-slate-500 group-hover:text-slate-700'}`}>
                      {item.icon}
                    </span>
                    <span className="text-[11px] font-semibold leading-none text-slate-600 group-hover:text-slate-800 lg:text-sm lg:text-inherit lg:leading-normal">
                      <span className="lg:hidden">{item.label}</span>
                      <span className="hidden lg:inline">{item.label}</span>
                    </span>
                  </Link>
                );
              })}

              {!isAuthenticated ? (
                <Link
                  to="/auth"
                  className="group flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-start gap-1 lg:gap-3 px-2 lg:px-4 py-3 rounded-2xl font-semibold transition-all duration-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  <span className="text-slate-500 group-hover:text-slate-700">
                    <LogIn size={20} />
                  </span>
                  <span className="text-[11px] font-semibold leading-none text-slate-600 group-hover:text-slate-800 lg:text-sm lg:text-inherit lg:leading-normal">
                    <span className="lg:hidden">Login</span>
                    <span className="hidden lg:inline">Login</span>
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    navigate('/');
                  }}
                  className="w-full group flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-start gap-1 lg:gap-3 px-2 lg:px-4 py-3 rounded-2xl font-semibold transition-all duration-200 text-red-600 hover:bg-red-50"
                >
                  <span className="text-red-600">
                    <LogOut size={20} />
                  </span>
                  <span className="text-[11px] font-semibold leading-none lg:text-sm lg:leading-normal">
                    <span className="lg:hidden">Logout</span>
                    <span className="hidden lg:inline">Logout</span>
                  </span>
                </button>
              )}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto min-h-0">
          {children}
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
