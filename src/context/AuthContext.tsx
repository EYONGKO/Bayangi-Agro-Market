import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'buyer' | 'seller' | 'both';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verifiedSeller?: boolean;
  profilePhoto?: string;
};

type AuthContextType = {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  register: (input: { name: string; email: string; password: string; role: UserRole }) => Promise<AuthUser>;
  signIn: (input: { email: string; password: string }) => Promise<AuthUser>;
  signOut: () => void;
  updateProfile: (updates: { name?: string; profilePhoto?: string }) => Promise<void>;
  uploadProfilePhoto: (file: File) => Promise<string>;
  refreshUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'local-roots-auth-session';
const TOKEN_KEY = 'local-roots-auth-token';
const USER_DATA_KEY = 'local-roots-user-data';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function getToken(): string | null {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

function loadUserData(): Record<string, Partial<AuthUser>> {
  if (!canUseStorage()) return {};
  try {
    const raw = window.localStorage.getItem(USER_DATA_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUserData(userData: Record<string, Partial<AuthUser>>) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
}

function loadSession(): AuthUser | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Ensure profilePhoto field is preserved even if undefined
    return {
      ...parsed,
      profilePhoto: parsed.profilePhoto || undefined
    };
  } catch {
    return null;
  }
}

function saveSession(user: AuthUser | null, token?: string) {
  if (!canUseStorage()) return;
  if (user) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
    }
  } else {
    window.localStorage.removeItem(SESSION_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const session = loadSession();
    if (session) setCurrentUser(session);
  }, []);

  const register = async (input: { name: string; email: string; password: string; role: UserRole }) => {
    try {
      // Create consistent user ID based on email
      const userId = `user-${input.email.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;
      
      // Load existing user data
      const userData = loadUserData();
      const existingUserData = userData[userId] || {};
      
      // Create session user with role from backend
      const sessionUser: AuthUser = {
        id: userId,
        name: input.name,
        email: input.email,
        role: input.role,
        verifiedSeller: input.role !== 'buyer',
        profilePhoto: existingUserData.profilePhoto || undefined // Preserve existing photo
      };

      // Save user data to persistent storage
      userData[userId] = {
        name: input.name,
        email: input.email,
        role: input.role,
        verifiedSeller: input.role !== 'buyer',
        profilePhoto: existingUserData.profilePhoto || undefined
      };
      saveUserData(userData);

      // Create a mock token
      const mockToken = `mock-token-${userId}`;

      // Save session
      saveSession(sessionUser, mockToken);
      setCurrentUser(sessionUser);
      return sessionUser;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const signIn = async (input: { email: string; password: string }) => {
    try {
      // Create consistent user ID based on email
      const userId = `user-${input.email.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;
      
      // Load existing user data
      const userData = loadUserData();
      const existingUserData = userData[userId] || {};
      
      // Create session user with role from backend
      const sessionUser: AuthUser = {
        id: userId,
        name: existingUserData.name || input.email.split('@')[0], // Use existing name or email prefix
        email: input.email,
        role: existingUserData.role || 'buyer', // Use existing role or default
        verifiedSeller: (existingUserData.role || 'buyer') !== 'buyer',
        profilePhoto: existingUserData.profilePhoto || undefined // Preserve existing photo
      };

      // Create a mock token
      const mockToken = `mock-token-${userId}`;

      // Save session
      saveSession(sessionUser, mockToken);
      setCurrentUser(sessionUser);
      return sessionUser;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const signOut = () => {
    saveSession(null);
    setCurrentUser(null);
  };

  const updateProfile = async (updates: { name?: string; profilePhoto?: string }) => {
    if (!currentUser) throw new Error('No user logged in');
    
    try {
      // Get token from localStorage
      const token = getToken();
      if (!token) throw new Error('No authentication token found');
      
      // For now, update locally without backend API
      // In production, this would call: await updateUserProfile(token, updates);
      
      // Update local user state immediately
      const updatedUser: AuthUser = {
        ...currentUser,
        ...updates
      };

      // Also update persistent user data
      const userData = loadUserData();
      userData[currentUser.id] = {
        ...userData[currentUser.id],
        ...updates
      };
      saveUserData(userData);

      saveSession(updatedUser, token);
      setCurrentUser(updatedUser);
      
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  };

  const uploadProfilePhoto = async (file: File): Promise<string> => {
    if (!currentUser) throw new Error('No user logged in');
    
    try {
      // Get token from localStorage
      const token = getToken();
      if (!token) throw new Error('No authentication token found');
      
      // For now, handle photo upload locally
      // In production, this would call: await uploadProfilePhotoApi(token, file);
      
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const result = e.target?.result as string;
            
            // Compress large images by resizing
            if (file.size > 500 * 1024) {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxSize = 400;
                let width = img.width;
                let height = img.height;
                
                if (width > height) {
                  if (width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                  }
                } else {
                  if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                  }
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);
                
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                
                // Update profile with new photo URL
                updateProfile({ profilePhoto: compressedDataUrl });
                resolve(compressedDataUrl);
              };
              img.src = result;
            } else {
              // Update profile with new photo URL
              await updateProfile({ profilePhoto: result });
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
      
    } catch (error: any) {
      throw new Error(error.message || 'Photo upload failed');
    }
  };

  const refreshUserProfile = async () => {
    if (!currentUser) return;
    
    try {
      // Get token from localStorage
      const token = getToken();
      if (!token) return;
      
      // For now, no backend refresh needed since we're using local storage
      // In production, this would call: await fetchUserProfile(token);
      
      // Profile is already in local state, no need to refresh
      
    } catch (error: any) {
      console.error('Failed to refresh profile:', error);
      // Don't throw error for refresh failures
    }
  };

  const value: AuthContextType = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      register,
      signIn,
      signOut,
      updateProfile,
      uploadProfilePhoto,
      refreshUserProfile
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

