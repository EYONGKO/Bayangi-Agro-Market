export type ChatMessage = {
  id: string;
  threadId: string;
  productId?: number;
  sellerId: string;
  buyerId?: string;
  sender: 'buyer' | 'seller';
  senderName: string;
  body: string;
  createdAt: string; // ISO
  timestamp?: number; // For easier date handling
  read?: boolean; // Read status for messages
};

export type ChatThread = {
  id: string;
  sellerId: string;
  buyerId?: string;
  sellerName: string;
  buyerName?: string;
  sellerAvatarText: string;
  buyerAvatarText?: string;
  productId?: number;
  productName?: string;
  updatedAt: string; // ISO
  lastMessageAt?: number; // For easier date handling
  unreadCount?: {
    seller: number;
    buyer: number;
  };
};

const THREADS_KEY = 'local-roots-chat-threads-v2';
const MESSAGES_KEY = 'local-roots-chat-messages-v2';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function makeThreadId(sellerId: string, buyerId?: string, productId?: number) {
  if (buyerId && productId) {
    return `${sellerId}::${buyerId}::product::${productId}`;
  } else if (buyerId) {
    return `${sellerId}::${buyerId}::inbox`;
  } else if (productId) {
    return `${sellerId}::product::${productId}`;
  }
  return `${sellerId}::inbox`;
}

export function loadThreads(): ChatThread[] {
  const parsed = canUseStorage() ? safeParse<ChatThread[]>(window.localStorage.getItem(THREADS_KEY)) : null;
  return Array.isArray(parsed) ? parsed : [];
}

export function saveThreads(threads: ChatThread[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
}

export function loadMessages(): ChatMessage[] {
  const parsed = canUseStorage() ? safeParse<ChatMessage[]>(window.localStorage.getItem(MESSAGES_KEY)) : null;
  return Array.isArray(parsed) ? parsed : [];
}

export function saveMessages(messages: ChatMessage[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function upsertThread(input: Omit<ChatThread, 'id' | 'updatedAt'> & { id: string }): ChatThread {
  const threads = loadThreads();
  const existingIdx = threads.findIndex((t) => t.id === input.id);
  const updated: ChatThread = { 
    ...input, 
    updatedAt: nowIso(),
    lastMessageAt: Date.now()
  };

  const next =
    existingIdx >= 0
      ? [updated, ...threads.filter((t) => t.id !== input.id)]
      : [updated, ...threads];

  saveThreads(next);
  return updated;
}

export function getThreadMessages(threadId: string): ChatMessage[] {
  return loadMessages()
    .filter((m) => m.threadId === threadId)
    .map((m) => ({
      ...m,
      timestamp: m.timestamp || new Date(m.createdAt).getTime()
    }))
    .sort((a, b) => {
      const timeA = a.timestamp || new Date(a.createdAt).getTime();
      const timeB = b.timestamp || new Date(b.createdAt).getTime();
      return timeA - timeB;
    });
}

// Real-time chat event system
type ChatEvent = {
  type: 'message_sent' | 'message_read' | 'thread_updated';
  data: any;
  timestamp: number;
};

class ChatEventManager {
  private listeners: Map<string, ((event: ChatEvent) => void)[]> = new Map();
  
  subscribe(eventType: string, callback: (event: ChatEvent) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }
  
  emit(eventType: string, data: any) {
    const event: ChatEvent = {
      type: eventType as ChatEvent['type'],
      data,
      timestamp: Date.now()
    };
    
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => callback(event));
    }
    
    // Also trigger storage event for cross-tab sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chat-update', { detail: event }));
    }
  }
}

export const chatEventManager = new ChatEventManager();

// Enhanced sendMessage with real-time events
export function sendMessage(params: {
  threadId: string;
  sender: 'buyer' | 'seller';
  senderId: string;
  senderName: string;
  sellerId: string;
  buyerId?: string;
  productId?: number;
  productName?: string;
  body: string;
}): ChatMessage {
  // Get existing thread to preserve buyerName if it exists
  const existingThread = loadThreads().find(t => t.id === params.threadId);
  
  // Update thread
  const thread = upsertThread({
    id: params.threadId,
    sellerId: params.sellerId,
    buyerId: params.buyerId,
    sellerName: params.sender === 'seller' ? params.senderName : (params.productName ? 'Product Seller' : 'Seller'),
    buyerName: params.sender === 'buyer' ? params.senderName : (existingThread?.buyerName || 'Buyer'),
    sellerAvatarText: params.sender === 'seller' ? params.senderName.trim().slice(0, 1).toUpperCase() : 'S',
    buyerAvatarText: params.sender === 'buyer' ? params.senderName.trim().slice(0, 1).toUpperCase() : (existingThread?.buyerAvatarText || 'B'),
    productId: params.productId,
    productName: params.productName
  });

  // Create message
  const msg: ChatMessage = {
    id: uid(),
    threadId: thread.id,
    sellerId: params.sellerId,
    buyerId: params.buyerId,
    productId: params.productId,
    sender: params.sender,
    senderName: params.senderName,
    body: params.body.trim(),
    createdAt: nowIso(),
    timestamp: Date.now(),
    read: false
  };

  // Save message
  const messages = loadMessages();
  const next = [...messages, msg];
  saveMessages(next);

  // Update unread count
  updateUnreadCount(thread.id, params.sender);

  // Emit real-time event
  chatEventManager.emit('message_sent', {
    message: msg,
    thread: thread,
    sender: params.sender,
    recipient: params.sender === 'buyer' ? 'seller' : 'buyer'
  });

  return msg;
}

export function sendBuyerMessage(params: {
  threadId: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  productId?: number;
  productName?: string;
  body: string;
}): ChatMessage {
  return sendMessage({
    threadId: params.threadId,
    sender: 'buyer',
    senderId: params.buyerId,
    senderName: params.buyerName,
    sellerId: params.sellerId,
    buyerId: params.buyerId,
    productId: params.productId,
    productName: params.productName,
    body: params.body
  });
}

export function sendSellerMessage(params: {
  threadId: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  productId?: number;
  productName?: string;
  body: string;
}): ChatMessage {
  return sendMessage({
    threadId: params.threadId,
    sender: 'seller',
    senderId: params.sellerId,
    senderName: params.sellerName,
    sellerId: params.sellerId,
    buyerId: params.buyerId,
    productId: params.productId,
    productName: params.productName,
    body: params.body
  });
}

export function markMessagesAsRead(threadId: string, reader: 'buyer' | 'seller') {
  const messages = loadMessages();
  const updatedMessages = messages.map(msg => {
    if (msg.threadId === threadId && msg.sender !== reader) {
      return { ...msg, read: true };
    }
    return msg;
  });
  saveMessages(updatedMessages);

  // Update unread count
  updateUnreadCount(threadId, reader);
}

function updateUnreadCount(threadId: string, reader: 'buyer' | 'seller') {
  const messages = loadMessages();
  const threadMessages = messages.filter(m => m.threadId === threadId);
  
  const unreadForSeller = threadMessages.filter(m => m.sender === 'buyer' && !m.read).length;
  const unreadForBuyer = threadMessages.filter(m => m.sender === 'seller' && !m.read).length;

  const threads = loadThreads();
  const threadIndex = threads.findIndex(t => t.id === threadId);
  
  if (threadIndex >= 0) {
    threads[threadIndex].unreadCount = {
      seller: unreadForSeller,
      buyer: unreadForBuyer
    };
    saveThreads(threads);
  }
}

export function getUnreadCount(userId: string, userType: 'buyer' | 'seller'): number {
  const threads = loadThreads();
  let total = 0;

  threads.forEach(thread => {
    if (userType === 'seller' && thread.sellerId === userId) {
      total += thread.unreadCount?.seller || 0;
    } else if (userType === 'buyer' && thread.buyerId === userId) {
      total += thread.unreadCount?.buyer || 0;
    }
  });

  return total;
}

export function getThreadsForUser(userId: string, userType: 'buyer' | 'seller'): ChatThread[] {
  const threads = loadThreads();
  
  if (userType === 'seller') {
    return threads.filter(thread => thread.sellerId === userId);
  } else {
    return threads.filter(thread => thread.buyerId === userId);
  }
}

export function clearChat(threadId: string): boolean {
  try {
    // Remove all messages for this thread
    const messages = loadMessages();
    const filteredMessages = messages.filter(m => m.threadId !== threadId);
    saveMessages(filteredMessages);

    // Remove the thread itself
    const threads = loadThreads();
    const filteredThreads = threads.filter(t => t.id !== threadId);
    saveThreads(filteredThreads);

    return true;
  } catch (error) {
    console.error('Failed to clear chat:', error);
    return false;
  }
}

export function clearAllChats(userId: string, userType: 'buyer' | 'seller'): boolean {
  try {
    // Get all threads for this user
    const threads = loadThreads();
    const userThreads = userType === 'seller' 
      ? threads.filter(thread => thread.sellerId === userId)
      : threads.filter(thread => thread.buyerId === userId);

    // Get all thread IDs to clear
    const threadIds = userThreads.map(t => t.id);

    // Remove all messages for these threads
    const messages = loadMessages();
    const filteredMessages = messages.filter(m => !threadIds.includes(m.threadId));
    saveMessages(filteredMessages);

    // Remove the threads
    const filteredThreads = threads.filter(t => !threadIds.includes(t.id));
    saveThreads(filteredThreads);

    return true;
  } catch (error) {
    console.error('Failed to clear all chats:', error);
    return false;
  }
}

// Remove the mock auto-reply function - no more simulated responses
export function getThreadsForSeller(sellerId: string): ChatThread[] {
  return getThreadsForUser(sellerId, 'seller');
}

export function getThreadsForBuyer(buyerId: string): ChatThread[] {
  return getThreadsForUser(buyerId, 'buyer');
}

