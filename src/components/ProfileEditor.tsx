import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  IconButton,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Camera, Save, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/colors';

interface ProfileEditorProps {
  onClose?: () => void;
  compact?: boolean;
}

export default function ProfileEditor({ onClose, compact = false }: ProfileEditorProps) {
  const { currentUser, updateProfile, uploadProfilePhoto, refreshUserProfile } = useAuth();
  const [name, setName] = useState(currentUser?.name || '');
  const [profilePhoto, setProfilePhoto] = useState(currentUser?.profilePhoto || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update state when currentUser changes (for page refresh/login scenarios)
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setProfilePhoto(currentUser.profilePhoto || '');
    }
  }, [currentUser]);

  // Refresh profile from backend on mount
  useEffect(() => {
    refreshUserProfile();
  }, [refreshUserProfile]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Upload photo to backend
        const photoUrl = await uploadProfilePhoto(file);
        setProfilePhoto(photoUrl);
        setEditing(true);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } catch (err: any) {
        setError(err.message || 'Failed to upload photo');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateProfile({ 
        name: name.trim()
      });
      
      setSuccess(true);
      setEditing(false);
      setTimeout(() => {
        setSuccess(false);
        if (onClose) onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(currentUser?.name || '');
    setProfilePhoto(currentUser?.profilePhoto || '');
    setEditing(false);
    setError(null);
  };

  const handleRemovePhoto = () => {
    setProfilePhoto('');
    setEditing(true);
  };

  if (compact) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={profilePhoto || undefined}
              alt={name}
              sx={{ 
                width: 80, 
                height: 80,
                background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
                fontSize: '32px',
                fontWeight: 800,
                border: `2px solid ${theme.colors.ui.white}`,
                boxShadow: `0 2px 8px ${theme.colors.ui.shadow}`
              }}
            >
              {!profilePhoto && <User size={32} />}
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <IconButton
              size="small"
              onClick={() => fileInputRef.current?.click()}
              sx={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                background: theme.colors.primary.main,
                color: 'white',
                '&:hover': {
                  background: theme.colors.primary.dark,
                }
              }}
            >
              <Camera size={16} />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setEditing(true);
              }}
              size="small"
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {editing && (
                <>
                  <Button
                    size="small"
                    onClick={handleSave}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} /> : <Save size={16} />}
                    variant="contained"
                  >
                    Save
                  </Button>
                  <Button
                    size="small"
                    onClick={handleCancel}
                    startIcon={<X size={16} />}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                </>
              )}
              {profilePhoto && (
                <Button
                  size="small"
                  onClick={handleRemovePhoto}
                  color="error"
                  variant="outlined"
                >
                  Remove Photo
                </Button>
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Profile updated successfully!
              </Alert>
            )}
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 500, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: theme.colors.neutral[900] }}>
          Edit Profile
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Avatar
            src={profilePhoto || undefined}
            alt={name}
            sx={{ 
              width: 120, 
              height: 120,
              background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
              fontSize: '48px',
              fontWeight: 800,
              border: `4px solid ${theme.colors.ui.white}`,
              boxShadow: `0 4px 20px ${theme.colors.ui.shadow}`
            }}
          >
            {!profilePhoto && <User size={48} />}
          </Avatar>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: theme.colors.primary.main,
              color: 'white',
              '&:hover': {
                background: theme.colors.primary.dark,
              },
              boxShadow: `0 2px 8px ${theme.colors.ui.shadow}`
            }}
          >
            <Camera size={20} />
          </IconButton>
        </Box>
        
        {profilePhoto && (
          <Button
            size="small"
            onClick={handleRemovePhoto}
            color="error"
            variant="outlined"
            sx={{ mb: 2 }}
          >
            Remove Photo
          </Button>
        )}
      </Box>

      <TextField
        fullWidth
        label="Full Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setEditing(true);
        }}
        sx={{ mb: 3 }}
        error={!name.trim()}
        helperText={!name.trim() ? 'Name is required' : ''}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Profile updated successfully!
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          fullWidth
          onClick={handleSave}
          disabled={loading || !name.trim() || !editing}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <Save size={20} />}
          sx={{ 
            borderRadius: 2, 
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.colors.primary.dark} 0%, ${theme.colors.primary.dark}dd 100%)`,
            }
          }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
        
        {onClose && (
          <Button
            fullWidth
            onClick={onClose}
            variant="outlined"
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Paper>
  );
}
