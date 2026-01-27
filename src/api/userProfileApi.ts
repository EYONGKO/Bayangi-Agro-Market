/**
 * API client for user profile operations.
 * Used for profile photo uploads and profile updates.
 */

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? '';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
}

export async function fetchUserProfile(token: string): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/api/user/profile`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to load user profile');
  }
  const data = await res.json();
  return data;
}

export async function updateUserProfile(token: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/api/user/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string })?.error || 'Failed to update profile');
  }
  const data = await res.json();
  return data;
}

export async function uploadProfilePhoto(token: string, file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('photo', file);

  const res = await fetch(`${API_BASE}/api/user/profile/photo`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string })?.error || 'Failed to upload photo');
  }
  const data = await res.json();
  return data;
}
