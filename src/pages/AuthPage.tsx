import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageLayout from '../components/PageLayout';

export default function AuthPage() {
  const { register, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { redirectTo?: string })?.redirectTo || '/account';
  const needSeller = (location.state as { needSeller?: boolean })?.needSeller || false;

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [staySigned, setStaySigned] = useState(true);
  const [role, setRole] = useState<'buyer' | 'seller' | 'both'>(needSeller ? 'seller' : 'buyer');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      if (mode === 'register') {
        await register({ name: name || 'User', email, password, role });
      } else {
        await signIn({ email, password });
      }
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout showCategoryNav={false}>
      <div style={{ 
        background: 'linear-gradient(135deg, #f0f7e6 0%, #e8f5e0 100%)', 
        minHeight: 'calc(100vh - 160px)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '32px 16px'
      }}>
        <div
          style={{
            width: 'min(450px, 100%)',
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #d4e8d4',
            boxShadow: '0 20px 60px rgba(45, 80, 22, 0.15)',
            overflow: 'hidden'
          }}
        >
          {/* Logo */}
          <div style={{ 
            padding: '32px 32px 16px',
            textAlign: 'center',
            borderBottom: '1px solid #f0f7e6'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              margin: '0 auto 16px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(45, 80, 22, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white'
            }}>
              <img 
                src="/Bayangi agro marke logot.png" 
                alt="Bayangi Agro Market Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>

          {/* Header */}
          <div style={{ 
            padding: '24px 32px 24px',
            textAlign: 'center',
            borderBottom: '1px solid #f0f7e6'
          }}>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: 700, 
              color: '#2d5016', 
              marginBottom: '8px',
              letterSpacing: '-0.02em'
            }}>
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: '#6b7280', 
              lineHeight: 1.5
            }}>
              {mode === 'signin' 
                ? 'Sign in to your account to continue' 
                : 'Join our agricultural marketplace today'
              }
            </div>
          </div>

          {/* Form */}
          <div style={{ padding: '32px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {mode === 'register' && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontWeight: 600, 
                    fontSize: '14px', 
                    color: '#374151', 
                    marginBottom: '8px' 
                  }}>
                    Full Name
                  </label>
                  <div style={inputWrapStyle}>
                    <span style={inputIconStyle}>
                      <User2 size={18} />
                    </span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 600, 
                  fontSize: '14px', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  Email Address
                </label>
                <div style={inputWrapStyle}>
                  <span style={inputIconStyle}>
                    <Mail size={18} />
                  </span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    placeholder="Enter your email"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 600, 
                  fontSize: '14px', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  Password
                </label>
                <div style={inputWrapStyle}>
                  <span style={inputIconStyle}>
                    <Lock size={18} />
                  </span>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '4px',
                      borderRadius: '4px',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontWeight: 600, 
                    fontSize: '14px', 
                    color: '#374151', 
                    marginBottom: '8px' 
                  }}>
                    I want to
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {(['buyer', 'seller', 'both'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: role === r ? '2px solid #2d5016' : '1px solid #e5e7eb',
                          background: role === r ? '#2d5016' : '#ffffff',
                          color: role === r ? '#ffffff' : '#374151',
                          fontWeight: 600,
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {r === 'both' ? 'Both' : r === 'seller' ? 'Sell' : 'Buy'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  position: 'relative',
                  width: '18px',
                  height: '18px'
                }}>
                  <input
                    id="stay-signed"
                    type="checkbox"
                    checked={staySigned}
                    onChange={(e) => setStaySigned(e.target.checked)}
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      zIndex: 2
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '18px',
                    height: '18px',
                    border: staySigned ? '2px solid #2d5016' : '2px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: staySigned ? '#2d5016' : '#ffffff',
                    cursor: 'pointer',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: staySigned ? '#ffffff' : 'transparent'
                  }}>
                    {staySigned ? '✓' : ''}
                  </div>
                </div>
                <label htmlFor="stay-signed" style={{ 
                  fontSize: '14px', 
                  color: '#374151',
                  cursor: 'pointer'
                }}>
                  Keep me signed in
                </label>
              </div>

              {error && (
                <div style={errorStyle}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? '#9ca3af' : '#2d5016',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(45, 80, 22, 0.3)'
                }}
              >
                {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>

              {mode === 'signin' && (
                <div style={{ textAlign: 'center' }}>
                  <a 
                    href="#" 
                    style={{ 
                      fontSize: '14px', 
                      color: '#2d5016', 
                      textDecoration: 'none',
                      fontWeight: 500
                    }}
                  >
                    Forgot your password?
                  </a>
                </div>
              )}
            </form>

            {/* Toggle Mode */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid #f0f7e6'
            }}>
              <div style={{ 
                fontSize: '14px', 
                color: '#6b7280',
                marginBottom: '16px'
              }}>
                {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'register' : 'signin');
                  setError(null);
                }}
                style={{
                  background: 'transparent',
                  color: '#2d5016',
                  border: '2px solid #2d5016',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {mode === 'signin' ? 'Create Account' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 50px 14px 48px',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  fontSize: '15px',
  outline: 'none',
  background: '#ffffff',
  color: '#374151',
  transition: 'all 0.2s ease',
  boxSizing: 'border-box'
};

const inputWrapStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
};

const inputIconStyle: React.CSSProperties = {
  position: 'absolute',
  left: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#9ca3af',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
};

const passwordToggleStyle: React.CSSProperties = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  border: '2px solid #e5e7eb',
  background: '#f8fafc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#1f2937',
  transition: 'all 0.2s ease',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  '&:hover': {
    background: '#e5e7eb',
    borderColor: '#d1d5db',
    color: '#111827',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
  }
};

const errorStyle: React.CSSProperties = {
  borderRadius: '12px',
  border: '1px solid #fecaca',
  background: '#fef2f2',
  color: '#991b1b',
  fontWeight: 500,
  fontSize: '14px',
  padding: '12px 16px',
  lineHeight: 1.5
};
