import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { Trash2, Plus, Edit, Eye, EyeOff } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAdminAuth } from '../AdminAuthContext';
import { updateSiteSettings } from '../../api/siteSettingsApi';
import type { Collection } from '../../config/siteSettingsTypes';
import { DEFAULT_COLLECTIONS } from '../../config/siteSettingsTypes';
import AdminImagePicker from '../components/AdminImagePicker';

export default function CollectionsAdminPage() {
  const { token } = useAdminAuth();
  const { settings, loading, error, refetch } = useSiteSettings();
  const [collections, setCollections] = useState<Collection[]>(
    settings.collections || DEFAULT_COLLECTIONS
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<{ index: number; name: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const categories = ['All', 'Crafts', 'Agriculture', 'Textiles', 'Home', 'Fashion', 'Food', 'Gifts'];

  const updateCollection = (index: number, patch: Partial<Collection>) => {
    const next = collections.map((c, i) => (i === index ? { ...c, ...patch } : c));
    setCollections(next);
  };

  const addCollection = () => {
    const newCollection: Collection = {
      id: `collection-${Date.now()}`,
      name: 'New Collection',
      description: 'Description for the new collection',
      category: 'Crafts',
      image: '',
      itemCount: 0,
      featured: false,
    };
    setCollections([...collections, newCollection]);
    setEditingIndex(collections.length);
  };

  const removeCollection = (index: number) => {
    const collection = collections[index];
    setCollectionToDelete({ index, name: collection.name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (collectionToDelete && collections.length > 1) {
      const next = collections.filter((_, i) => i !== collectionToDelete.index);
      setCollections(next);
      setEditingIndex(null);
      setDeleteDialogOpen(false);
      setCollectionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setCollectionToDelete(null);
  };

  const moveCollection = (index: number, direction: 'up' | 'down') => {
    const to = direction === 'up' ? index - 1 : index + 1;
    if (to < 0 || to >= collections.length) return;
    const next = [...collections];
    [next[index], next[to]] = [next[to], next[index]];
    setCollections(next);
    setEditingIndex(to);
  };

  const saveChanges = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await updateSiteSettings(token, { collections });
      await refetch();
      alert('Collections saved successfully!');
    } catch (err) {
      console.error('Error saving collections:', err);
      setSaveError(err instanceof Error ? err.message : 'Failed to save collections');
      alert('Error saving collections');
    } finally {
      setSaving(false);
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>
          Collections Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
            variant="outlined"
            onClick={togglePreview}
            sx={{ borderRadius: 2, fontWeight: 800 }}
          >
            {showPreview ? 'Edit Mode' : 'Preview Mode'}
          </Button>
          <Button
            startIcon={<Plus size={18} />}
            variant="contained"
            onClick={addCollection}
            sx={{ borderRadius: 2, fontWeight: 800 }}
          >
            Add Collection
          </Button>
          <Button
            variant="contained"
            onClick={saveChanges}
            disabled={saving}
            sx={{ 
              borderRadius: 2, 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #2d5016 0%, #1a3009 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1a3009 0%, #0f1805 100%)',
              }
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>

      {saveError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {saveError}
        </Alert>
      )}

      {showPreview ? (
        // Preview Mode - Display collections as they appear on the frontend
        <Grid container spacing={3}>
          {collections.map((collection) => (
            <Grid item key={collection.id} xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: collection.image ? `url(${collection.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#f5f5f5',
                    position: 'relative',
                  }}
                >
                  {collection.featured && (
                    <Chip
                      label="Featured"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        background: 'linear-gradient(135deg, #2d5016 0%, #1a3009 100%)',
                        color: 'white',
                        fontWeight: 700,
                      }}
                    />
                  )}
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    {collection.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                    {collection.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {collection.itemCount} items
                    </Typography>
                    <Chip
                      label={collection.category}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Edit Mode - Display editable collection cards
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {collections.map((collection, index) => (
            <Card key={collection.id} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontWeight: 900, fontSize: 16, color: '#0f172a' }}>
                    {editingIndex === index ? 'Edit Collection' : collection.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {editingIndex === index && (
                      <>
                        <Button
                          size="small"
                          onClick={() => moveCollection(index, 'up')}
                          disabled={index === 0}
                          sx={{ minWidth: 'auto', p: 1 }}
                        >
                          ↑
                        </Button>
                        <Button
                          size="small"
                          onClick={() => moveCollection(index, 'down')}
                          disabled={index === collections.length - 1}
                          sx={{ minWidth: 'auto', p: 1 }}
                        >
                          ↓
                        </Button>
                      </>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                      sx={{ p: 1 }}
                    >
                      {editingIndex === index ? <EyeOff size={18} /> : <Edit size={18} />}
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeCollection(index)}
                      disabled={collections.length <= 1}
                      sx={{ 
                        p: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(220, 38, 38, 0.04)',
                        },
                        '&.Mui-disabled': {
                          opacity: 0.5,
                        }
                      }}
                      title={collections.length <= 1 ? 'Cannot delete the last collection' : 'Delete collection'}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                </Box>

                {editingIndex === index ? (
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    <TextField
                      size="small"
                      label="Collection Name"
                      value={collection.name}
                      onChange={(e) => updateCollection(index, { name: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      size="small"
                      label="Description"
                      value={collection.description}
                      onChange={(e) => updateCollection(index, { description: e.target.value })}
                      fullWidth
                      multiline
                      rows={3}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        size="small"
                        label="Category"
                        value={collection.category}
                        onChange={(e) => updateCollection(index, { category: e.target.value })}
                        select
                        sx={{ flex: 1 }}
                        SelectProps={{ native: true }}
                      >
                        {categories.filter(cat => cat !== 'All').map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </TextField>
                      <TextField
                        size="small"
                        label="Item Count"
                        type="number"
                        value={collection.itemCount}
                        onChange={(e) => updateCollection(index, { itemCount: parseInt(e.target.value) || 0 })}
                        sx={{ width: 120 }}
                      />
                    </Box>
                    <AdminImagePicker
                      token={token}
                      value={collection.image}
                      onChange={(url: string) => updateCollection(index, { image: url })}
                      label="Collection Image"
                      compact
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={collection.featured}
                          onChange={(e) => updateCollection(index, { featured: e.target.checked })}
                        />
                      }
                      label="Featured Collection"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        backgroundImage: collection.image ? `url(${collection.image})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: '#f5f5f5',
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: 14, color: '#64748b', mb: 1 }}>
                        {collection.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={collection.category}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 2 }}
                        />
                        <Chip
                          label={`${collection.itemCount} items`}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 2 }}
                        />
                        {collection.featured && (
                          <Chip
                            label="Featured"
                            size="small"
                            sx={{
                              background: 'linear-gradient(135deg, #2d5016 0%, #1a3009 100%)',
                              color: 'white',
                              fontWeight: 700,
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: 18, 
          fontWeight: 800, 
          color: '#dc2626',
          textAlign: 'center',
          pb: 1
        }}>
          Delete Collection
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone.
          </Alert>
          <Typography sx={{ fontSize: 14, color: '#374151', textAlign: 'center' }}>
            Are you sure you want to delete the collection <strong>"{collectionToDelete?.name}"</strong>?
          </Typography>
          {collections.length <= 1 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              You cannot delete the last collection. At least one collection must remain.
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ gap: 1, pt: 2 }}>
          <Button
            onClick={cancelDelete}
            variant="outlined"
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            disabled={collections.length <= 1}
            sx={{ 
              borderRadius: 2, 
              fontWeight: 600,
              background: collections.length > 1 ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' : undefined,
              '&:hover': collections.length > 1 ? {
                background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
              } : undefined
            }}
          >
            Delete Collection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
