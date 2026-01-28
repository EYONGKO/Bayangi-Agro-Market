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
  id: string;
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
  stats: ArtisanStats;
}

const communities = ['Kendem', 'Mamfe', 'Membe', 'Widikum', 'Fonjo', 'Moshie/Kekpoti', 'Bamenda', 'Buea', 'Douala', 'Yaoundé', 'Kumba', 'Limbe'];
const specialties = ['Vegetable Farming', 'Poultry Farming', 'Rice Cultivation', 'Fruit Farming', 'Livestock', 'Dairy Products', 'Honey Production', 'Fish Farming'];

export default function ArtisansAdminPage() {
  const { token } = useAdminAuth();
  const [artisans, setArtisans] = useState<DatabaseArtisan[]>([]);
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

  // Load artisans from database API on component mount
  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const response = await fetch('https://bayangi-agro-market-backend-production.up.railway.app/api/artisans');
        if (response.ok) {
          const data = await response.json();
          setArtisans(data);
        } else {
          console.error('Failed to fetch artisans:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching artisans:', error);
      }
    };

    fetchArtisans();
  }, []);

  // Database API functions
  const createArtisan = async (artisanData: any) => {
    try {
      const response = await fetch('https://bayangi-agro-market-backend-production.up.railway.app/api/users', {
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
        setArtisans([...artisans, newArtisan]);
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
      const response = await fetch(`https://bayangi-agro-market-backend-production.up.railway.app/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(artisanData)
      });
      
      if (response.ok) {
        const updatedArtisan = await response.json();
        setArtisans(artisans.map(a => a.id === id ? updatedArtisan : a));
        return updatedArtisan;
      } else {
        throw new Error('Failed to update artisan');
      }
    } catch (error) {
      console.error('Error updating artisan:', error);
      throw error;
    }
  };

  const deleteArtisan = async (id: string) => {
    try {
      const response = await fetch(`https://bayangi-agro-market-backend-production.up.railway.app/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setArtisans(artisans.filter(a => a.id !== id));
      } else {
        throw new Error('Failed to delete artisan');
      }
    } catch (error) {
      console.error('Error deleting artisan:', error);
      throw error;
    }
  };

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
      console.log('Starting image upload for file:', file.name, 'size:', file.size, 'type:', file.type);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size should be less than 5MB');
        return;
      }
      
      try {
        console.log('Saving image to storage...');
        
        // Save image using the real image storage API
        const savedImage = await saveImage(file);
        
        console.log('Image saved successfully with ID:', savedImage.id);
        console.log('Image URL:', savedImage.data.substring(0, 50) + '...');
        
        setFormData({ 
          ...formData, 
          avatar: savedImage.id, // Store the image ID instead of blob URL
          avatarFile: file 
        });
        
        console.log('Form data updated with image ID:', savedImage.id);
        alert('Image uploaded successfully!');
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image. Please try again.');
      }
    } else {
      console.log('No file selected');
    }
  };

  const handleSaveArtisan = async () => {
    setLoading(true);
    
    try {
      if (editingArtisan) {
        // Update existing artisan
        await updateArtisan(editingArtisan.id, formData);
        console.log('Artisan updated successfully');
      } else {
        // Create new artisan
        await createArtisan(formData);
        console.log('New artisan added successfully');
      }
    } catch (error) {
      console.error('Error saving artisan:', error);
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const handleToggleVerified = async (id: string) => {
  try {
    const artisan = artisans.find(a => a.id === id);
    if (artisan) {
      await updateArtisan(id, { verifiedSeller: !artisan.verifiedSeller });
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
              <TableRow key={artisan.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={artisan.avatar} sx={{ width: 40, height: 40 }}>
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
                      {artisan.stats.avgRating}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({artisan.stats.reviews})
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {artisan.stats.totalProducts} Products
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={artisan.verifiedSeller ? 'Verified' : 'Pending'}
                      color={artisan.verifiedSeller ? 'success' : 'warning'}
                      size="small"
                      onClick={() => handleToggleVerified(artisan.id)}
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
                      onClick={() => handleDeleteArtisan(artisan.id)}
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
                  src={formData.avatar}
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
