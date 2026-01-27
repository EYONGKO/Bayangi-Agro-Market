import { useMemo, useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import type { Product } from '../../context/CartContext';
import ChatDrawer from './ChatDrawer';
import { createPortal } from 'react-dom';
import { theme } from '../../theme/colors';

type Props = {
  product: Product;
  sellerName?: string;
  sellerId?: string;
  sellerPhone?: string;
  sellerWhatsApp?: string;
};

function normalizeE164(input?: string) {
  if (!input) return '';
  const trimmed = input.trim();
  if (trimmed.startsWith('+')) return trimmed;
  const digits = trimmed.replace(/[^\d]/g, '');
  if (!digits) return '';
  return digits.startsWith('237') ? `+${digits}` : `+237${digits}`;
}

export default function SellerContactWidget({
  product,
  sellerName,
  sellerId,
  sellerPhone,
  sellerWhatsApp
}: Props) {
  const [open, setOpen] = useState(false);

  const resolvedSellerName = sellerName || product.vendor || 'Seller';
  const resolvedSellerId = sellerId || product.sellerId || (product.vendor ? product.vendor.toLowerCase().replace(/\s+/g, '-') : 'seller');
  const wa = normalizeE164(sellerWhatsApp || product.sellerWhatsApp || product.sellerPhone);
  const phone = normalizeE164(sellerPhone || product.sellerPhone || product.sellerWhatsApp);

  const waLink = useMemo(() => {
    if (!wa) return '';
    const digits = wa.replace(/[^\d]/g, '');
    const text = encodeURIComponent(
      `Hi ${resolvedSellerName}, I'm interested in "${product.name}". Is it available?`
    );
    return `https://wa.me/${digits}?text=${text}`;
  }, [wa, resolvedSellerName, product.name]);

  const ui = (
    <>
      {/* Floating Chat Button */}
      <div className="fixed right-4 bottom-4 z-50">
        <button
          onClick={() => setOpen(true)}
          className="w-16 h-16 rounded-2xl bg-white shadow-2xl border border-gray-200 flex items-center justify-center hover:scale-110 transition-all duration-300 group"
          style={{ 
            boxShadow: '0 14px 36px rgba(0,0,0,0.18)',
            borderColor: theme.colors.neutral[200]
          }}
          aria-label="Open chat"
        >
          <div className="relative">
            <MessageCircle 
              size={28} 
              style={{ color: theme.colors.primary.main }}
              className="group-hover:scale-110 transition-transform"
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
        </button>
      </div>

      {/* Expanded Actions Panel */}
      {open && (
        <div className="fixed right-4 bottom-24 z-50 space-y-3">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 min-w-[200px]"
               style={{ 
                 boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                 borderColor: theme.colors.neutral[200]
               }}>
            {/* Seller Info */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100"
                 style={{ borderColor: theme.colors.neutral[100] }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                   style={{ 
                     background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`
                   }}>
                {resolvedSellerName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate" style={{ color: theme.colors.neutral[900] }}>
                  {resolvedSellerName}
                </div>
                <div className="text-xs truncate" style={{ color: theme.colors.neutral[600] }}>
                  {product.name}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors shadow-md"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <MessageCircle size={12} color="#25D366" />
                  </div>
                  WhatsApp
                </a>
              )}
              
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors shadow-md"
                  style={{ backgroundColor: theme.colors.neutral[900] }}
                >
                  <Phone size={16} />
                  Call Seller
                </a>
              )}
              
              <button
                onClick={() => setOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
                style={{ backgroundColor: theme.colors.neutral[100], color: theme.colors.neutral[700] }}
              >
                <X size={16} />
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ChatDrawer
        open={open}
        onClose={() => setOpen(false)}
        product={product}
        sellerId={resolvedSellerId}
        sellerName={resolvedSellerName}
      />
    </>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(ui, document.body);
}

