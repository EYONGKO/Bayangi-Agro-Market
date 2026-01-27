import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast: Toast = {
      id,
      ...toast,
      duration: toast.duration || 5000,
    };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const handleClose = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, clearToasts }}>
      {children}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
        {toasts.map((toast) => (
          <Snackbar
            key={toast.id}
            open={true}
            autoHideDuration={toast.duration}
            onClose={() => handleClose(toast.id)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ mt: 2 }}
          >
            <Alert
              severity={toast.type}
              iconMapping={{
                success: <CheckCircle fontSize="inherit" />,
                error: <AlertTriangle fontSize="inherit" />,
                info: <Info fontSize="inherit" />,
                warning: <AlertTriangle fontSize="inherit" />,
              }}
            >
              <AlertTitle>{toast.title}</AlertTitle>
              {toast.message}
            </Alert>
          </Snackbar>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
