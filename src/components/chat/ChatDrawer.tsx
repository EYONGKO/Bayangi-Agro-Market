import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Send, Smile, Paperclip, Check, CheckCheck, Phone, MessageCircle, MoreVertical, Trash2 } from 'lucide-react';
import type { Product } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getThreadMessages, makeThreadId, sendBuyerMessage, clearChat, chatEventManager } from '../../utils/chatStore';
import { theme } from '../../theme/colors';

type Props = {
  open: boolean;
  onClose: () => void;
  product?: Product;
  sellerId: string;
  sellerName: string;
};

export default function ChatDrawer({ open, onClose, product, sellerId, sellerName }: Props) {
  const { currentUser } = useAuth();
  const threadId = useMemo(() => makeThreadId(sellerId, currentUser?.id, product?.id), [sellerId, currentUser?.id, product?.id]);
  const [draft, setDraft] = useState('');
  const [version, setVersion] = useState(0);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showClearConfirmDialog, setShowClearConfirmDialog] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const messages = useMemo(() => getThreadMessages(threadId), [threadId, version]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }, 0);
    return () => window.clearTimeout(t);
  }, [open, messages.length]);

  // Real-time chat updates using event system
  useEffect(() => {
    if (!open || !currentUser) return;

    // Subscribe to message events
    const unsubscribeMessageSent = chatEventManager.subscribe('message_sent', (event) => {
      console.log('ChatDrawer real-time message received:', event.data);
      setVersion((v) => v + 1);
    });

    // Subscribe to custom chat update events (for cross-tab sync)
    const handleChatUpdate = (event: CustomEvent) => {
      console.log('ChatDrawer chat update event:', event.detail);
      setVersion((v) => v + 1);
    };

    window.addEventListener('chat-update', handleChatUpdate as EventListener);

    // Cleanup
    return () => {
      unsubscribeMessageSent();
      window.removeEventListener('chat-update', handleChatUpdate as EventListener);
    };
  }, [open, currentUser]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  if (!open) return null;

  const handleSend = () => {
    const body = draft.trim();
    if (!body || !currentUser) return;
    
    setDraft('');
    sendBuyerMessage({
      threadId,
      sellerId,
      sellerName,
      buyerId: currentUser.id,
      buyerName: currentUser.name || 'Buyer',
      productId: product?.id,
      productName: product?.name,
      body
    });
    
    setVersion((v) => v + 1);
  };

  const handleClearChat = () => {
    const success = clearChat(threadId);
    if (success) {
      setVersion((v) => v + 1);
      setShowClearConfirmDialog(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 bg-black/35 z-[4000] flex justify-end"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
        style={{ boxShadow: '-20px 0 60px rgba(0,0,0,0.25)' }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between gap-3"
             style={{ borderColor: theme.colors.neutral[200] }}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                 style={{ 
                   background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`
                 }}>
              {sellerName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate" style={{ color: theme.colors.neutral[900] }}>
                Chat with {sellerName}
              </div>
              {product?.name && (
                <div className="text-xs truncate" style={{ color: theme.colors.neutral[600] }}>
                  About: {product.name}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Phone size={16} style={{ color: theme.colors.neutral[600] }} />
            </button>
            <button 
              onClick={() => setShowClearConfirmDialog(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Clear chat"
            >
              <Trash2 size={16} style={{ color: '#dc2626' }} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ borderColor: theme.colors.neutral[200] }}
            >
              <X size={18} style={{ color: theme.colors.neutral[600] }} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-4 bg-gray-50"
          style={{ backgroundColor: theme.colors.neutral[50] }}
        >
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={24} style={{ color: theme.colors.neutral[400] }} />
              </div>
              <h3 className="font-semibold text-sm mb-2" style={{ color: theme.colors.neutral[900] }}>
                Start the conversation
              </h3>
              <p className="text-xs" style={{ color: theme.colors.neutral[600] }}>
                Ask about availability, delivery, or product details. The seller will respond to your message.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => {
                // Debug: Log the message data
                console.log('ChatDrawer Message:', m);
                
                const isBuyerMessage = m.sender === 'buyer';
                const isMyMessage = isBuyerMessage; // In ChatDrawer, user is always buyer
                
                console.log('ChatDrawer isBuyerMessage:', isBuyerMessage, 'sender:', m.sender);
                
                return (
                  <div
                    key={m.id}
                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] ${isMyMessage ? 'order-2' : 'order-1'}`}>
                      {/* Sender name label */}
                      {!isMyMessage && (
                        <div className="mb-1 px-2">
                          <span className="text-xs font-medium flex items-center gap-2" style={{ 
                            color: '#c2410c' 
                          }}>
                            🏪 Seller: {m.senderName}
                            <div className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-white text-xs"
                                 style={{ 
                                   background: `linear-gradient(135deg, #ea580c 0%, #dc2626 100%)`
                                 }}>
                              {m.senderName.charAt(0).toUpperCase()}
                            </div>
                          </span>
                        </div>
                      )}
                      
                      {/* Message bubble - FORCE different colors */}
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-sm ${
                          m.sender === 'buyer'
                            ? 'bg-blue-600 text-white rounded-br-none border-2 border-blue-700' 
                            : 'bg-orange-600 text-white rounded-bl-none border-2 border-orange-700'
                        }`}
                        style={{
                          backgroundColor: m.sender === 'buyer' ? '#2563eb' : '#ea580c',
                          borderColor: m.sender === 'buyer' ? '#1d4ed8' : '#c2410c',
                          color: '#ffffff'
                        }}
                      >
                        <p className="text-sm leading-relaxed font-semibold">
                          {m.body}
                        </p>
                      </div>
                      
                      {/* Timestamp and status */}
                      <div className={`flex items-center gap-2 mt-1 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs" style={{ color: theme.colors.neutral[500] }}>
                          {formatTime(new Date(m.createdAt))}
                        </span>
                        {isMyMessage && (
                          <div className="flex items-center gap-1">
                            {m.read ? (
                              <CheckCheck size={12} style={{ color: theme.colors.primary.main }} />
                            ) : (
                              <Check size={12} style={{ color: theme.colors.neutral[400] }} />
                            )}
                          </div>
                        )}
                        {!isMyMessage && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ 
                            backgroundColor: '#fed7aa',
                            color: '#c2410c' 
                          }}>
                            🏪 Seller
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white"
             style={{ borderColor: theme.colors.neutral[200] }}>
          {!currentUser ? (
            <div className="text-center py-4">
              <p className="text-sm" style={{ color: theme.colors.neutral[600] }}>
                Please sign in to send messages
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Paperclip size={18} style={{ color: theme.colors.neutral[600] }} />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
                    style={{ 
                      backgroundColor: theme.colors.neutral[100], 
                      color: theme.colors.neutral[900],
                      borderColor: theme.colors.neutral[200]
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSend();
                    }}
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-200 transition-colors">
                    <Smile size={16} style={{ color: theme.colors.neutral[600] }} />
                  </button>
                </div>
                
                <button
                  onClick={handleSend}
                  className="p-3 rounded-xl transition-all transform hover:scale-105"
                  style={{ 
                    background: draft.trim() 
                      ? `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`
                      : theme.colors.neutral[300],
                    color: draft.trim() ? 'white' : theme.colors.neutral[500]
                  }}
                  disabled={!draft.trim()}
                >
                  <Send size={16} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-xs" style={{ color: theme.colors.neutral[500] }}>
                  Press Enter to send • Messages saved locally
                </p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs" style={{ color: theme.colors.neutral[500] }}>
                    {sellerName} will respond to your message
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Clear Chat Confirmation Dialog */}
      {showClearConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Clear Chat</h3>
            <p className="text-sm mb-6">Clear this conversation? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowClearConfirmDialog(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleClearChat} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg">Clear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

