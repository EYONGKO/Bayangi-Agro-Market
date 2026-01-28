import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Edit, Trash2, Plus, Star, MapPin, Award, Image as ImageIcon, Upload } from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext';

// Database artisan types
interface ArtisanStats {
  totalProducts: number;
  avgRating: number;
  totalLikes: number;
  reviews: number;
}

interface DatabaseArtisan {
  _id: string; // MongoDB uses _id
  id?: string; // Optional fallback for compatibility
  name: string;
  email: string;
  phone: string;
  community: string;
  specialty: string;
  role: string;
  verifiedSeller: boolean;
  avatar: string;
  bio: string;
  createdAt: string;
  stats?: ArtisanStats; // Optional since it might not exist
}

const specialties = ['Vegetable Farming', 'Poultry Farming', 'Rice Cultivation', 'Fruit Farming', 'Livestock', 'Dairy Products', 'Honey Production', 'Fish Farming', 'Handicrafts'];

// API_BASE for consistent endpoint usage
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:8080' 
  : 'https://bayangi-agro-market-backend-production.up.railway.app';

export default function ArtisansAdminPage() {
  const { token } = useAdminAuth();
  const [artisans, setArtisans] = useState<DatabaseArtisan[]>([]);
  const [communities, setCommunities] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingArtisan, setEditingArtisan] = useState<DatabaseArtisan | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    community: '',
    specialty: '',
    bio: '',
    role: 'seller',
    verifiedSeller: false,
    avatar: '',
    avatarFile: null as File | null
  });

  // Fetch communities from database
  const fetchCommunities = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/communities`);
      if (response.ok) {
        const data = await response.json();
        setCommunities(data.map((c: any) => c.name));
      } else {
        console.error('Failed to fetch communities');
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  // Load artisans and communities from database API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch artisans
        const artisansResponse = await fetch(`${API_BASE}/api/artisans`);
        if (artisansResponse.ok) {
          const artisansData = await artisansResponse.json();
          setArtisans(artisansData);
        } else {
          console.error('Failed to fetch artisans:', artisansResponse.statusText);
        }

        // Fetch communities
        await fetchCommunities();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Database API functions
  const createArtisan = async (artisanData: any) => {
    try {
      const response = await fetch(`${API_BASE}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...artisanData,
          password: 'defaultPassword123', // Default password for artisans
          role: 'seller'
        })
      });
      
      if (response.ok) {
        const newArtisan = await response.json();
        const updatedArtisans = [...artisans, newArtisan];
        setArtisans(updatedArtisans);
        
        // Dispatch event to notify frontend Top Artisans page
        window.dispatchEvent(new CustomEvent('artisansUpdated', { 
          detail: updatedArtisans 
        }));
        
        return newArtisan;
      } else {
        throw new Error('Failed to create artisan');
      }
    } catch (error) {
      console.error('Error creating artisan:', error);
      throw error;
    }
  };

  const updateArtisan = async (id: string, artisanData: any) => {
    try {
      console.log('Updating artisan with data:', artisanData);
      console.log('API URL:', `${API_BASE}/api/users/${id}`);
      
      const response = await fetch(`${API_BASE}/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(artisanData)
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const updatedArtisan = await response.json();
        console.log('Updated artisan response:', updatedArtisan);
        setArtisans(artisans.map(a => a._id === id ? updatedArtisan : a));
        
        // Dispatch event to notify frontend Top Artisans page
        window.dispatchEvent(new CustomEvent('artisansUpdated', { 
          detail: artisans.map(a => a._id === id ? updatedArtisan : a) 
        }));
        
        return updatedArtisan;
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Update failed:', errorData);
        throw new Error(errorData.error || `Failed to update artisan (Status: ${response.status})`);
      }
    } catch (error) {
      console.error('Error updating artisan:', error);
      throw error;
    }
  };

  const deleteArtisan = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const updatedArtisans = artisans.filter(a => a._id !== id);
        setArtisans(updatedArtisans);
        
        // Dispatch event to notify frontend Top Artisans page
        window.dispatchEvent(new CustomEvent('artisansUpdated', { 
          detail: updatedArtisans 
        }));
        
      } else {
        throw new Error('Failed to delete artisan');
      }
    } catch (error) {
      console.error('Error deleting artisan:', error);
      throw error;
    }
  };

  // Debug form data changes
  useEffect(() => {
    console.log('Form data changed:', formData);
  }, [formData]);

  // Listen for artisans updates from other components
  useEffect(() => {
    const handleArtisansUpdate = (event: CustomEvent) => {
      setArtisans(event.detail);
    };

    window.addEventListener('artisansUpdated', handleArtisansUpdate as EventListener);
    
    return () => {
      window.removeEventListener('artisansUpdated', handleArtisansUpdate as EventListener);
    };
  }, []);

  const handleAddArtisan = () => {
    setEditingArtisan(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      community: '',
      specialty: '',
      bio: '',
      role: 'seller',
      verifiedSeller: false,
      avatar: '',
      avatarFile: null
    });
    setOpenDialog(true);
  };

  const handleEditArtisan = (artisan: DatabaseArtisan) => {
    setEditingArtisan(artisan);
    setFormData({
      name: artisan.name,
      email: artisan.email,
      phone: artisan.phone,
      community: artisan.community,
      specialty: artisan.specialty,
      bio: artisan.bio,
      role: artisan.role,
      verifiedSeller: artisan.verifiedSeller,
      avatar: artisan.avatar,
      avatarFile: null // Reset file input
    });
    setOpenDialog(true);
  };

  const handleDeleteArtisan = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this artisan?')) {
      try {
        await deleteArtisan(id);
      } catch (error) {
        console.error('Error deleting artisan:', error);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Processing artisan image:', file.name, 'size:', file.size, 'type:', file.type);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      try {
        console.log('Converting image to base64...');
        
        // Use same base64 approach as products and communities
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
        
        console.log('Artisan image processed as base64:', file.name);
        console.log('DataUrl length:', dataUrl.length);
        
        // Store base64 directly like products and communities (mobile compatible)
        setFormData({ 
          ...formData, 
          avatar: dataUrl, // Store base64 directly
          avatarFile: file 
        });
        
        console.log('Form data after update:', { ...formData, avatar: dataUrl });
        alert('Image processed successfully!');
        
      } catch (error: any) {
        console.error('Error processing image:', error);
        alert(`Failed to process image: ${error.message}`);
      }
    } else {
      console.log('No file selected');
    }
  };

  const handleRemoveImage = () => {
    setFormData({ 
      ...formData, 
      avatar: '',
      avatarFile: null 
    });
  };

  const handleSaveArtisan = async () => {
    setLoading(true);
    
    try {
      console.log('Saving artisan data:', formData);
      console.log('Editing artisan:', editingArtisan);
      
      if (editingArtisan) {
        // Update existing artisan
        console.log('Updating existing artisan...');
        await updateArtisan(editingArtisan._id, formData);
        console.log('Artisan updated successfully');
        
        // Force refresh of artisans from backend to get latest data
        const response = await fetch(`${API_BASE}/api/artisans`);
        if (response.ok) {
          const updatedArtisans = await response.json();
          setArtisans(updatedArtisans);
          
          // Dispatch event to notify frontend Top Artisans page
          window.dispatchEvent(new CustomEvent('artisansUpdated', { 
            detail: updatedArtisans 
          }));
          
          console.log('Dispatched artisansUpdated event with updated data');
        }
      } else {
        // Create new artisan
        console.log('Creating new artisan...');
        await createArtisan(formData);
        console.log('New artisan added successfully');
        
        // Force refresh of artisans from backend to get latest data
        const response = await fetch(`${API_BASE}/api/artisans`);
        if (response.ok) {
          const updatedArtisans = await response.json();
          setArtisans(updatedArtisans);
          
          // Dispatch event to notify frontend Top Artisans page
          window.dispatchEvent(new CustomEvent('artisansUpdated', { 
            detail: updatedArtisans 
          }));
          
          console.log('Dispatched artisansUpdated event with new artisan data');
        }
      }
    } catch (error: any) {
      console.error('Error saving artisan:', error);
      alert(`Failed to save artisan: ${error.message}`);
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const handleToggleVerified = async (id: string) => {
  try {
    const artisan = artisans.find(a => a._id === id);
    if (artisan) {
      await updateArtisan(id, { verifiedSeller: !artisan.verifiedSeller });
      
      // Dispatch event to notify frontend Top Artisans page
      window.dispatchEvent(new CustomEvent('artisansUpdated', { 
        detail: artisans.map(a => a._id === id ? { ...a, verifiedSeller: !a.verifiedSeller } : a) 
      }));
    }
  } catch (error) {
    console.error('Error toggling verification:', error);
  }
};

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
          Top Artisans Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleAddArtisan}
          sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' } }}
        >
          Add Artisan
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f9fafb' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Artisan</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Community</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Specialty</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Sales</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artisans.map((artisan) => (
              <TableRow key={artisan._id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      src={(() => {
                        if (!artisan.avatar) return '';
                        // Handle base64 images (new approach)
                        if (artisan.avatar.startsWith('data:')) return artisan.avatar;
                        // Handle HTTP URLs (old approach)
                        if (artisan.avatar.startsWith('http')) return artisan.avatar;
                        // Handle relative paths (old approach)
                        if (artisan.avatar.startsWith('/')) return `${API_BASE}${artisan.avatar}`;
                        // Handle filenames (old approach)
                        return `${API_BASE}/uploads/${artisan.avatar}`;
                      })()}
                      sx={{ width: 40, height: 40 }}
                    >
                      {artisan.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {artisan.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Joined {new Date(artisan.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{artisan.email}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {artisan.phone}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<MapPin style={{ fontSize: 16 }} />}
                    label={artisan.community}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{artisan.specialty}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star style={{ fontSize: 16, color: '#fbbf24' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {artisan.stats?.avgRating || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({artisan.stats?.reviews || 0})
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {artisan.stats?.totalProducts || 0} Products
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={artisan.verifiedSeller ? 'Verified' : 'Pending'}
                      color={artisan.verifiedSeller ? 'success' : 'warning'}
                      size="small"
                      onClick={() => handleToggleVerified(artisan._id)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditArtisan(artisan)}
                      sx={{ color: '#3b82f6' }}
                    >
                      <Edit fontSize={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteArtisan(artisan._id)}
                      sx={{ color: '#ef4444' }}
                    >
                      <Trash2 fontSize={16} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingArtisan ? 'Edit Artisan' : 'Add New Artisan'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Phone"
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Community</InputLabel>
              <Select
                value={formData.community}
                label="Community"
                onChange={(e) => setFormData({ ...formData, community: e.target.value })}
              >
                {communities.map((community) => (
                  <MenuItem key={community} value={community}>
                    {community}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Specialty</InputLabel>
              <Select
                value={formData.specialty}
                label="Specialty"
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              >
                {specialties.map((specialty) => (
                  <MenuItem key={specialty} value={specialty}>
                    {specialty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Bio"
              multiline
              rows={3}
              fullWidth
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Artisan Image</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={(() => {
                    if (!formData.avatar) return '';
                    // Handle base64 images (new approach)
                    if (formData.avatar.startsWith('data:')) return formData.avatar;
                    // Handle HTTP URLs (old approach)
                    if (formData.avatar.startsWith('http')) return formData.avatar;
                    // Handle relative paths (old approach)
                    if (formData.avatar.startsWith('/')) return `${API_BASE}${formData.avatar}`;
                    // Handle filenames (old approach)
                    return `${API_BASE}/uploads/${formData.avatar}`;
                  })()}
                  sx={{ width: 80, height: 80 }}
                >
                  {formData.name.charAt(0) || 'A'}
                </Avatar>
                <Box>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="artisan-image-upload"
                  />
                  <label htmlFor="artisan-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<Upload size={18} />}
                      sx={{ cursor: 'pointer' }}
                    >
                      Upload Image
                    </Button>
                  </label>
                  {formData.avatar && (
                    <Button
                      variant="text"
                      size="small"
                      onClick={handleRemoveImage}
                      sx={{ color: '#ef4444' }}
                    >
                      Remove
                    </Button>
                  )}
                  {formData.avatar && (
                    <Typography variant="caption" color="text.secondary">
                      {formData.avatarFile?.name || 'Image uploaded'}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveArtisan} variant="contained" sx={{ backgroundColor: '#10b981' }}>
            {editingArtisan ? 'Update' : 'Add'} Artisan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
