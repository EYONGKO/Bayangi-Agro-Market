import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    const baseStyles = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '1rem 1.5rem',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '600',
      fontSize: '0.9rem',
      zIndex: 9999,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      transition: 'all 0.3s ease',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
      maxWidth: '400px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    };

    const typeStyles = {
      success: {
        background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
      },
      error: {
        background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
      },
      info: {
        background: 'linear-gradient(135deg, #3498db, #2980b9)',
      }
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <i className="fas fa-check-circle"></i>;
      case 'error':
        return <i className="fas fa-exclamation-circle"></i>;
      case 'info':
        return <i className="fas fa-info-circle"></i>;
      default:
        return <i className="fas fa-check-circle"></i>;
    }
  };

  return (
    <div style={getToastStyles()}>
      {getIcon()}
      <span>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => {
            if (onClose) onClose();
          }, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          marginLeft: 'auto',
          fontSize: '1.2rem',
          opacity: 0.8,
          transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.opacity = 1}
        onMouseLeave={(e) => e.target.style.opacity = 0.8}
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Toast;
