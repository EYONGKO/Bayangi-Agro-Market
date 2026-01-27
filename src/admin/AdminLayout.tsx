import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, Button, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { useAdminAuth } from './AdminAuthContext';
import SiteFooter from '../components/SiteFooter';
import EcommerceHeader from '../components/EcommerceHeader';
import { useEffect } from 'react';
import {
  Package,
  ShoppingCart,
  Users,
  MapPin,
  FileText,
  Tags,
  Settings,
  LayoutDashboard,
  LogOut,
  Eye,
  DollarSign,
  Award,
  Grid3X3,
} from 'lucide-react';

const drawerWidth = 280;

type NavItem = { label: string; to: string; icon: React.ReactNode };

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Visitors', to: '/admin/visitors', icon: <Eye size={18} /> },
  { label: 'Prices', to: '/admin/prices', icon: <DollarSign size={18} /> },
  { label: 'Products', to: '/admin/products', icon: <Package size={18} /> },
  { label: 'Collections', to: '/admin/collections', icon: <Grid3X3 size={18} /> },
  { label: 'Orders', to: '/admin/orders', icon: <ShoppingCart size={18} /> },
  { label: 'Users', to: '/admin/users', icon: <Users size={18} /> },
  { label: 'Top Artisans', to: '/admin/artisans', icon: <Award size={18} /> },
  { label: 'Communities', to: '/admin/communities', icon: <MapPin size={18} /> },
  { label: 'News / Posts', to: '/admin/posts', icon: <FileText size={18} /> },
  { label: 'Categories', to: '/admin/categories', icon: <Tags size={18} /> },
  { label: 'Site Settings', to: '/admin/site-settings', icon: <Settings size={18} /> },
];

export default function AdminLayout() {
  const { isAuthenticated, signOut } = useAdminAuth();
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ redirectTo: location.pathname }} replace />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Top Navigation */}
      <EcommerceHeader />
      
      <Box sx={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Admin Toolbar Completely Removed - As per drawing */}
        
        {/* Sidebar starts right after top navigation - no gaps */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: '1px solid rgba(15,23,42,0.08)',
              background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
              top: 64, // Only account for top navigation (64px)
              height: 'calc(100vh - 64px)', // Height adjusted for only top nav
              boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
              zIndex: 999
            }
          }}
        >
        <Toolbar />
        {/* Professional Admin Info Section */}
        <Box sx={{ 
          px: 2.5, 
          py: 3, 
          background: 'linear-gradient(135deg, #2d5016 0%, #1a3009 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.1
          }
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box 
                sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.15)', 
                  backdropFilter: 'blur(10px)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}
              >
                <LayoutDashboard size={24} color="#fff" />
              </Box>
              <Box>
                <Typography sx={{ 
                  fontWeight: 900, 
                  fontSize: 16, 
                  color: '#ffffff', 
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em'
                }}>
                  Admin Panel
                </Typography>
                <Typography sx={{ 
                  fontWeight: 500, 
                  fontSize: 11, 
                  color: 'rgba(255,255,255,0.8)', 
                  mt: 0.5
                }}>
                  Bayangi Agro Market
                </Typography>
              </Box>
            </Box>
            <Button
              startIcon={<LogOut size={14} />}
              onClick={signOut}
              sx={{ 
                fontWeight: 600, 
                color: '#2d5016', 
                borderRadius: '8px', 
                textTransform: 'none',
                px: 2,
                py: 1,
                fontSize: 12,
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                '&:hover': {
                  background: '#ffffff',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.3)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Sign Out
            </Button>
          </Box>
        </Box>
        {/* Modern Navigation Section */}
        <Box sx={{ 
          px: 2.5, 
          py: 2.5,
          background: '#ffffff',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Typography sx={{ 
            fontSize: 11, 
            fontWeight: 800, 
            color: '#64748b', 
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            mb: 3,
            px: 1
          }}>
            Navigation
          </Typography>
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <List disablePadding sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
              {navItems.map((item) => (
                <ListItemButton
                  key={item.to}
                  component={Link}
                  to={item.to}
                  selected={location.pathname === item.to}
                  onClick={() => window.scrollTo(0, 0)}
                  sx={{
                    borderRadius: '12px',
                    py: 2,
                    px: 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    background: location.pathname === item.to 
                      ? 'linear-gradient(135deg, #2d5016 0%, #1a3009 100%)'
                      : 'transparent',
                    color: location.pathname === item.to ? '#ffffff' : '#475569',
                    boxShadow: location.pathname === item.to 
                      ? '0 4px 20px rgba(45,80,22,0.3)' 
                      : 'none',
                    border: location.pathname === item.to 
                      ? '1px solid rgba(45,80,22,0.2)'
                      : '1px solid transparent',
                    minHeight: '52px',
                    '&:hover': {
                      background: location.pathname === item.to
                        ? 'linear-gradient(135deg, #1a3009 0%, #0f1805 100%)'
                        : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      boxShadow: location.pathname === item.to
                        ? '0 6px 24px rgba(45,80,22,0.4)'
                        : '0 2px 12px rgba(0,0,0,0.08)',
                      transform: 'translateX(4px)',
                      color: location.pathname === item.to ? '#ffffff' : '#2d5016',
                      borderColor: location.pathname === item.to ? 'rgba(45,80,22,0.3)' : 'rgba(0,0,0,0.1)'
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '12px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: location.pathname === item.to ? '#ffffff' : 'transparent',
                      transform: 'translateY(-50%)',
                      transition: 'all 0.3s ease',
                      boxShadow: location.pathname === item.to ? '0 0 8px rgba(255,255,255,0.5)' : 'none'
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 44, 
                    color: 'inherit',
                    '& svg': {
                      strokeWidth: 2,
                      transition: 'all 0.3s ease',
                      filter: location.pathname === item.to ? 'drop-shadow(0 0 4px rgba(255,255,255,0.3))' : 'none'
                    }
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ 
                      fontWeight: location.pathname === item.to ? 700 : 600, 
                      fontSize: 14,
                      letterSpacing: '0.01em'
                    }} 
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Box>
      </Drawer>

      <Box component="main" sx={{ 
        flex: 1, 
        px: 2, 
        py: 2, 
        mt: 4, // Start right below top navigation (64px = 4rem = 64px)
        mb: 0,
        minHeight: 'calc(100vh - 64px)',
        position: 'relative',
        zIndex: 1,
        background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
      }}>
        <Outlet />
      </Box>
      </Box>
      
      {/* Footer positioned after sidebar - natural flow */}
      <Box sx={{ 
        position: 'relative',
        zIndex: 10,
        background: 'transparent',
        marginLeft: `${drawerWidth}px` // Align with content area
      }}>
        <SiteFooter />
      </Box>
    </Box>
  );
}
