import { useMemo, useState, useEffect } from 'react';
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Smile, User, Clock, Check, CheckCheck, ChevronDown, Trash2, AlertTriangle } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { useAuth } from '../context/AuthContext';
import { getThreadMessages, loadThreads, sendSellerMessage, getThreadsForUser, markMessagesAsRead, clearChat, clearAllChats, sendBuyerMessage, chatEventManager } from '../utils/chatStore';
import { theme } from '../theme/colors';

export default function ChatPage() {
  const { currentUser } = useAuth();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [draft, setDraft] = useState('');
  const [version, setVersion] = useState(0);
  const [showConversationDropdown, setShowConversationDropdown] = useState(false);
  const [showClearConfirmDialog, setShowClearConfirmDialog] = useState(false);
  const [showClearAllConfirmDialog, setShowClearAllConfirmDialog] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Get threads for current user based on their role
  const threads = useMemo(() => {
    if (!currentUser) return [];
    
    const allThreads = getThreadsForUser(currentUser.id, currentUser.role === 'seller' ? 'seller' : 'buyer');
    const qq = q.trim().toLowerCase();
    if (!qq) return allThreads;
    
    return allThreads.filter((t) => {
      const searchableText = currentUser.role === 'seller' 
        ? (t.buyerName || 'Buyer') + ' ' + (t.productName ?? '')
        : (t.sellerName || 'Seller') + ' ' + (t.productName ?? '');
      return searchableText.toLowerCase().includes(qq);
    });
  }, [q, version, currentUser]);

  const activeThread = useMemo(() => threads.find((t) => t.id === selectedThreadId) ?? null, [threads, selectedThreadId]);
  const messages = useMemo(() => (activeThread ? getThreadMessages(activeThread.id) : []), [activeThread, version]);

  const selectFirstIfNeeded = () => {
    if (!selectedThreadId && threads.length > 0) setSelectedThreadId(threads[0].id);
  };
  selectFirstIfNeeded();

  const handleSend = () => {
    if (!activeThread || !currentUser) return;
    const body = draft.trim();
    if (!body) return;
    
    setDraft('');
    
    if (currentUser.role === 'seller') {
      sendSellerMessage({
        threadId: activeThread.id,
        sellerId: currentUser.id,
        sellerName: currentUser.name || 'Seller',
        buyerId: activeThread.buyerId,
        buyerName: activeThread.buyerName || 'Buyer',
        productId: activeThread.productId,
        productName: activeThread.productName,
        body
      });
    } else {
      // Buyer sending message - use sendBuyerMessage
      sendBuyerMessage({
        threadId: activeThread.id,
        sellerId: activeThread.sellerId,
        sellerName: activeThread.sellerName || 'Seller',
        buyerId: currentUser.id,
        buyerName: currentUser.name || 'Buyer',
        productId: activeThread.productId,
        productName: activeThread.productName,
        body
      });
    }
    
    setVersion((v) => v + 1);
  };

  const handleClearChat = async () => {
    if (!activeThread || !currentUser) return;
    
    setClearLoading(true);
    try {
      const success = clearChat(activeThread.id);
      if (success) {
        setSelectedThreadId(null);
        setVersion((v) => v + 1);
        setShowClearConfirmDialog(false);
      }
    } catch (error) {
      console.error('Failed to clear chat:', error);
    } finally {
      setClearLoading(false);
    }
  };

  const handleClearAllChats = async () => {
    if (!currentUser) return;
    
    setClearLoading(true);
    try {
      const success = clearAllChats(currentUser.id, currentUser.role === 'seller' ? 'seller' : 'buyer');
      if (success) {
        setSelectedThreadId(null);
        setVersion((v) => v + 1);
        setShowClearAllConfirmDialog(false);
        setShowMoreOptions(false);
      }
    } catch (error) {
      console.error('Failed to clear all chats:', error);
    } finally {
      setClearLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Mark messages as read when thread is selected
  useEffect(() => {
    if (activeThread && currentUser) {
      markMessagesAsRead(activeThread.id, currentUser.role === 'seller' ? 'seller' : 'buyer');
    }
  }, [activeThread, currentUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMoreOptions) {
        const target = event.target as Element;
        if (!target.closest('.relative')) {
          setShowMoreOptions(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreOptions]);

  // Real-time chat updates using event system
  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to message events
    const unsubscribeMessageSent = chatEventManager.subscribe('message_sent', (event) => {
      console.log('Real-time message received:', event.data);
      setVersion((v) => v + 1);
    });

    // Subscribe to custom chat update events (for cross-tab sync)
    const handleChatUpdate = (event: CustomEvent) => {
      console.log('Chat update event:', event.detail);
      setVersion((v) => v + 1);
    };

    window.addEventListener('chat-update', handleChatUpdate as EventListener);

    // Cleanup
    return () => {
      unsubscribeMessageSent();
      window.removeEventListener('chat-update', handleChatUpdate as EventListener);
    };
  }, [currentUser]);

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Mobile View */}
      <div className="lg:hidden">
        {activeThread ? (
          /* Mobile Chat View */
          <div className="w-full h-full flex flex-col bg-white">
            {/* Mobile Chat Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-3">
              <button 
                onClick={() => setSelectedThreadId(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronDown size={20} style={{ color: theme.colors.neutral[600] }} />
              </button>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`
                }}
              >
                {activeThread.sellerAvatarText}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-sm truncate" style={{ color: theme.colors.neutral[900] }}>
                  {activeThread.sellerName}
                </h2>
                <p className="text-xs truncate" style={{ color: theme.colors.neutral[600] }}>
                  {activeThread.productName || 'General conversation'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <Phone size={16} style={{ color: theme.colors.neutral[600] }} />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <MoreVertical size={16} style={{ color: theme.colors.neutral[600] }} />
                </button>
              </div>
            </div>

            {/* Mobile Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                    <User size={20} style={{ color: theme.colors.neutral[400] }} />
                  </div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: theme.colors.neutral[900] }}>Start the conversation</h3>
                  <p className="text-xs" style={{ color: theme.colors.neutral[600] }}>
                    Send a message to {activeThread.sellerName}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => {
                    const mine = m.sender === 'buyer';
                    return (
                      <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs ${mine ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`px-3 py-2 rounded-2xl ${
                              mine 
                                ? 'bg-green-500 text-white rounded-br-none' 
                                : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                            }`}
                          >
                            <p className="text-xs leading-relaxed">{m.body}</p>
                          </div>
                          <div className={`flex items-center gap-1 mt-1 ${mine ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-xs" style={{ color: theme.colors.neutral[500] }}>
                              {formatTime(new Date())}
                            </span>
                            {mine && (
                              <CheckCheck size={10} style={{ color: theme.colors.primary.main }} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Message Input */}
            <div className="px-4 py-3 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <Paperclip size={16} style={{ color: theme.colors.neutral[600] }} />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
                    style={{ backgroundColor: theme.colors.neutral[100], color: theme.colors.neutral[900] }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSend();
                    }}
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-200 transition-colors">
                    <Smile size={14} style={{ color: theme.colors.neutral[600] }} />
                  </button>
                </div>
                
                <button
                  onClick={handleSend}
                  className="p-2 rounded-lg transition-all transform hover:scale-105"
                  style={{ 
                    background: draft.trim() 
                      ? `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`
                      : theme.colors.neutral[300],
                    color: draft.trim() ? 'white' : theme.colors.neutral[500]
                  }}
                  disabled={!draft.trim()}
                >
                  <Send size={14} />
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs" style={{ color: theme.colors.neutral[500] }}>
                  Press Enter to send
                </p>
                <div className="flex items-center gap-1">
                  <Clock size={10} style={{ color: theme.colors.neutral[400] }} />
                  <span className="text-xs" style={{ color: theme.colors.neutral[500] }}>
                    Quick to respond
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Mobile Conversation List View */
          <div className="w-full h-full bg-white flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold" style={{ color: theme.colors.neutral[900] }}>Messages</h1>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <MoreVertical size={20} style={{ color: theme.colors.neutral[600] }} />
                </button>
              </div>
              
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: theme.colors.neutral[400] }} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
                  style={{ backgroundColor: theme.colors.neutral[100], color: theme.colors.neutral[900] }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {threads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <User size={24} style={{ color: theme.colors.neutral[400] }} />
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: theme.colors.neutral[900] }}>No conversations yet</h3>
                  <p className="text-sm" style={{ color: theme.colors.neutral[600] }}>
                    Start a conversation by visiting a product and clicking the chat button
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {threads.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedThreadId(t.id)}
                      className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                        style={{ 
                          background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`
                        }}
                      >
                        {t.sellerAvatarText}
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-sm truncate" style={{ color: theme.colors.neutral[900] }}>
                          {t.sellerName}
                        </h3>
                        <p className="text-xs truncate" style={{ color: theme.colors.neutral[600] }}>
                          {t.productName || 'General chat'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex h-screen">
        {/* Desktop Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold" style={{ color: theme.colors.neutral[900] }}>Messages</h1>
              <div className="relative">
                <button 
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setShowConversationDropdown(!showConversationDropdown)}
                >
                  <MoreVertical size={20} style={{ color: theme.colors.neutral[600] }} />
                </button>
                
                {showConversationDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-100">
                      <h3 className="font-semibold text-sm" style={{ color: theme.colors.neutral[900] }}>
                        Select Conversation
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {threads.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setSelectedThreadId(t.id);
                            setShowConversationDropdown(false);
                          }}
                          className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs"
                            style={{ 
                              background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`
                            }}
                          >
                            {t.sellerAvatarText}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate" style={{ color: theme.colors.neutral[900] }}>
                              {t.sellerName}
                            </div>
                            <div className="text-xs truncate" style={{ color: theme.colors.neutral[600] }}>
                              {t.productName || 'General chat'}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: theme.colors.neutral[400] }} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                style={{ backgroundColor: theme.colors.neutral[100], color: theme.colors.neutral[900] }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {threads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <User size={24} style={{ color: theme.colors.neutral[400] }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: theme.colors.neutral[900] }}>No conversations yet</h3>
                <p className="text-sm" style={{ color: theme.colors.neutral[600] }}>
                  Start a conversation by visiting a product and clicking the chat button
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {threads.map((t) => {
                  const active = t.id === selectedThreadId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedThreadId(t.id)}
                      className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                        active ? 'bg-green-50 border-l-4 border-green-500' : ''
                      }`}
                    >
                      <div className="relative">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                          style={{ 
                            background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`
                          }}
                        >
                          {t.sellerAvatarText}
                        </div>
                        {active && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold ${active ? 'text-green-600' : ''}`} style={{ color: theme.colors.neutral[900] }}>
                            {t.sellerName}
                          </h3>
                          <span className="text-xs" style={{ color: theme.colors.neutral[500] }}>
                            {formatTime(new Date())}
                          </span>
                        </div>
                        <p className="text-sm truncate" style={{ color: theme.colors.neutral[600] }}>
                          {t.productName ? `About: ${t.productName}` : 'General chat'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeThread ? (
            <>
              <div className="px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`
                      }}
                    >
                      {activeThread.sellerAvatarText}
                    </div>
                    <div>
                      <h2 className="font-semibold" style={{ color: theme.colors.neutral[900] }}>
                        {activeThread.sellerName}
                      </h2>
                      <p className="text-sm" style={{ color: theme.colors.neutral[600] }}>
                        {activeThread.productName || 'General conversation'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <Phone size={20} style={{ color: theme.colors.neutral[600] }} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <Video size={20} style={{ color: theme.colors.neutral[600] }} />
                    </button>
                    <div className="relative">
                      <button 
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setShowMoreOptions(!showMoreOptions)}
                      >
                        <MoreVertical size={20} style={{ color: theme.colors.neutral[600] }} />
                      </button>
                      
                      {showMoreOptions && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button
                            onClick={() => {
                              setShowClearConfirmDialog(true);
                              setShowMoreOptions(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 rounded-t-lg transition-colors"
                          >
                            <Trash2 size={16} style={{ color: '#dc2626' }} />
                            <span className="text-sm" style={{ color: '#dc2626' }}>Clear Chat</span>
                          </button>
                          <button
                            onClick={() => {
                              setShowClearAllConfirmDialog(true);
                              setShowMoreOptions(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 rounded-b-lg transition-colors"
                          >
                            <Trash2 size={16} style={{ color: '#dc2626' }} />
                            <span className="text-sm" style={{ color: '#dc2626' }}>Clear All Chats</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <User size={24} style={{ color: theme.colors.neutral[400] }} />
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: theme.colors.neutral[900] }}>Start the conversation</h3>
                    <p className="text-sm" style={{ color: theme.colors.neutral[600] }}>
                      Send a message to {activeThread.sellerName}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((m) => {
                      // Debug: Log the message data
                      console.log('Message:', m);
                      
                      const isBuyerMessage = m.sender === 'buyer';
                      const isMyMessage = currentUser?.role === 'buyer' ? isBuyerMessage : !isBuyerMessage;
                      
                      console.log('isBuyerMessage:', isBuyerMessage, 'sender:', m.sender);
                      
                      return (
                        <div key={m.id} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md ${isMyMessage ? 'order-2' : 'order-1'}`}>
                            {/* Sender name label */}
                            {!isMyMessage && (
                              <div className={`mb-1 px-2 ${isMyMessage ? 'text-right' : 'text-left'}`}>
                                <span className="text-xs font-medium" style={{ 
                                  color: isBuyerMessage ? '#1e40af' : '#c2410c' 
                                }}>
                                  {isBuyerMessage ? '👤 Buyer' : '🏪 Seller'}: {m.senderName}
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
                            
                            {/* Timestamp and read status */}
                            <div className={`flex items-center gap-2 mt-1 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-xs" style={{ color: theme.colors.neutral[500] }}>
                                {formatTime(new Date(m.createdAt))}
                              </span>
                              {isMyMessage && (
                                <div className="flex items-center gap-1">
                                  {m.read ? (
                                    <CheckCheck size={14} style={{ color: theme.colors.primary.main }} />
                                  ) : (
                                    <Check size={14} style={{ color: theme.colors.neutral[400] }} />
                                  )}
                                </div>
                              )}
                              {!isMyMessage && (
                                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ 
                                  backgroundColor: m.sender === 'buyer' ? '#dbeafe' : '#fed7aa',
                                  color: m.sender === 'buyer' ? '#1e40af' : '#c2410c' 
                                }}>
                                  {m.sender === 'buyer' ? '👤 Buyer' : '🏪 Seller'}
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

              <div className="px-6 py-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Paperclip size={20} style={{ color: theme.colors.neutral[600] }} />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                      style={{ backgroundColor: theme.colors.neutral[100], color: theme.colors.neutral[900] }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSend();
                      }}
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-200 transition-colors">
                      <Smile size={18} style={{ color: theme.colors.neutral[600] }} />
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
                    <Send size={18} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs" style={{ color: theme.colors.neutral[500] }}>
                    Press Enter to send • Messages are saved locally
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock size={12} style={{ color: theme.colors.neutral[400] }} />
                    <span className="text-xs" style={{ color: theme.colors.neutral[500] }}>
                      {activeThread.sellerName} is typically quick to respond
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User size={36} style={{ color: theme.colors.neutral[400] }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.neutral[900] }}>
                  Select a conversation
                </h3>
                <p className="text-sm" style={{ color: theme.colors.neutral[600] }}>
                  Choose a conversation from the sidebar or click the three dots to see available conversations
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clear Chat Confirmation Dialog */}
      {showClearConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} style={{ color: '#dc2626' }} />
              <h3 className="text-lg font-semibold" style={{ color: theme.colors.neutral[900] }}>
                Clear Chat
              </h3>
            </div>
            <p className="text-sm mb-6" style={{ color: theme.colors.neutral[600] }}>
              Are you sure you want to clear this chat? This action cannot be undone and all messages will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirmDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ color: theme.colors.neutral[700] }}
              >
                Cancel
              </button>
              <button
                onClick={handleClearChat}
                disabled={clearLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {clearLoading ? 'Clearing...' : 'Clear Chat'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Chats Confirmation Dialog */}
      {showClearAllConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} style={{ color: '#dc2626' }} />
              <h3 className="text-lg font-semibold" style={{ color: theme.colors.neutral[900] }}>
                Clear All Chats
              </h3>
            </div>
            <p className="text-sm mb-6" style={{ color: theme.colors.neutral[600] }}>
              Are you sure you want to clear all your chats? This action cannot be undone and all conversations will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearAllConfirmDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ color: theme.colors.neutral[700] }}
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllChats}
                disabled={clearLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {clearLoading ? 'Clearing...' : 'Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

