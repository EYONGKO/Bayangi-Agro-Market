import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';
import { createProduct, deleteProduct, listProducts, updateProduct, uploadImage, type ProductRecord } from '../../api/adminApi';
import { notifyProductsChanged } from '../../api/productsApi';
import { useAdminAuth } from '../AdminAuthContext';

export default function ProductsAdminPage() {
  const { token } = useAdminAuth();

  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRecord | null>(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    community: 'global',
    category: '',
    vendor: '',
    stock: '',
    description: '',
    images: [] as string[]
  });
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const categories = [
    'Agriculture',
    'Community Success',
    'Platform Updates',
    'Marketplace',
    'Resources',
    'Art',
    'Crafts',
    'Food',
    'Textiles',
    'Electronics',
    'Health & Wellness',
    'Education',
    'Technology',
    'Fashion',
    'Home & Garden',
    'Sports & Fitness',
    'Beauty & Personal Care',
    'Toys & Games',
    'Books & Media',
    'Automotive',
    'Business & Services',
    'Entertainment',
    'Travel & Tourism',
    'Pet Supplies',
    'Office Supplies',
    'Industrial'
  ];
  const communities = ['Kendem', 'Mamfe', 'Membe', 'Widikum', 'Fonjo', 'Moshie/Kekpoti'];

  const normalizeCommunityId = (value: string) => {
    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/\//g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  const handleImageUpload = async (files: FileList) => {
    if (!token) {
      setError('Authentication required for image upload');
      return;
    }

    for (const file of Array.from(files)) {
      try {
        console.log('Uploading image:', file.name, 'Size:', file.size);
        
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(String(r.result));
          r.onerror = () => reject(new Error('Failed to read file'));
          r.readAsDataURL(file);
        });
        
        console.log('Image converted to data URL, length:', dataUrl.length);
        
        const { url } = await uploadImage(token, { dataUrl, filename: file.name });
        console.log('Upload successful, URL:', url);
        
        // Verify the URL is valid
        if (!url || url.startsWith('data:')) {
          throw new Error('Invalid upload response: ' + url);
        }
        
        setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
        setImagePreview((prev) => [...prev, url]);
        
      } catch (e: any) {
        console.error('Image upload failed:', e);
        setError(`Failed to upload ${file.name}: ${e?.message || 'Unknown error'}`);
        break;
      }
    }
  };

  const removeImage = (index: number) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      setProducts(await listProducts());
    } catch (e: any) {
      setError(e?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setError(null);
    setForm({ name: '', price: '', community: 'global', category: '', vendor: '', stock: '', description: '', images: [] });
    setImagePreview([]);
    setEditorOpen(true);
  };

  const openEdit = (p: ProductRecord) => {
    setEditing(p);
    setError(null);
    const imgs = (p.images && p.images.length ? p.images : p.image ? [p.image] : []) as string[];
    setForm({
      name: p.name || '',
      price: String(p.price ?? ''),
      community: p.community || 'global',
      category: p.category || '',
      vendor: p.vendor || '',
      stock: p.stock != null ? String(p.stock) : '',
      description: p.description || '',
      images: imgs
    });
    setImagePreview(imgs);
    setEditorOpen(true);
  };

  const save = async () => {
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      const priceNum = Number(form.price);
      if (!Number.isFinite(priceNum)) throw new Error('Price must be a number');

      const stockNum = form.stock ? Number(form.stock) : undefined;
      if (form.stock && !Number.isFinite(stockNum)) throw new Error('Stock must be a number');

      const communityId = form.community ? normalizeCommunityId(form.community) : 'global';
      
      // Handle images properly - ensure we have valid URLs for mobile compatibility
      // Use Railway backend for images to avoid network restrictions
      const railwayBaseUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:8080' 
        : 'https://bayangi-agro-market-backend-production.up.railway.app';
      
      let image = `${railwayBaseUrl}/uploads/placeholder-${form.name || 'product'}.jpg`;
      let images: string[] = [];
      
      if (form.images.length > 0) {
        // Filter out base64 data URLs and only keep proper URLs
        const validUrls = form.images.filter(img => 
          !img.startsWith('data:') && (img.startsWith('http') || img.startsWith('/'))
        );
        
        if (validUrls.length > 0) {
          // Use the first valid image, but ensure it's a full URL for mobile
          const firstImage = validUrls[0];
          if (firstImage.startsWith('/')) {
            // Convert relative URLs to absolute Railway URLs
            image = `${railwayBaseUrl}${firstImage}`;
          } else {
            image = firstImage;
          }
          images = [image];
        } else {
          // If no valid URLs, use Railway-hosted placeholder
          console.warn('No valid image URLs found, using Railway placeholder');
          images = [image];
        }
      } else {
        images = [image];
      }

      const payload = {
        name: form.name,
        price: priceNum,
        community: communityId,
        category: form.category || undefined,
        vendor: form.vendor || undefined,
        stock: Number.isFinite(stockNum as any) ? (stockNum as number) : undefined,
        description: form.description || undefined,
        image,
        images
      };

      if (editing) {
        const updated = await updateProduct(token, editing._id, payload as any);
        setProducts((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
      } else {
        const created = await createProduct(token, payload as any);
        setProducts((prev) => [created, ...prev]);
      }

      notifyProductsChanged();
      setEditorOpen(false);
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const removeOne = async (p: ProductRecord) => {
    if (!token) return;
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      await deleteProduct(token, p._id);
      setProducts((prev) => prev.filter((x) => x._id !== p._id));
      notifyProductsChanged();
    } catch (e: any) {
      setError(e?.message || 'Delete failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontWeight: 950, fontSize: 24, color: '#0f172a' }}>Products</Typography>
          <Typography sx={{ mt: 0.25, fontSize: 13, fontWeight: 700, color: '#64748b' }}>Manage product listings</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={load} disabled={loading} sx={{ borderRadius: 3, fontWeight: 900 }}>
            Refresh
          </Button>
          <Button variant="contained" onClick={openCreate} sx={{ borderRadius: 3, fontWeight: 950 }}>
            New Product
          </Button>
        </Box>
      </Box>

      {error && <Box sx={{ mt: 2, color: '#991b1b', fontWeight: 800, fontSize: 13 }}>{error}</Box>}

      <Box sx={{ mt: 2, border: '1px solid rgba(15,23,42,0.10)', borderRadius: 3, background: '#fff' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 200px',
            gap: 2,
            px: 2,
            py: 1.5,
            borderBottom: '1px solid rgba(15,23,42,0.08)'
          }}
        >
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Name</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Community</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b', textAlign: 'right' }}>Price</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b', textAlign: 'right' }}>Actions</Box>
        </Box>
        {products.map((p) => (
          <Box
            key={p._id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 200px',
              gap: 2,
              px: 2,
              py: 1.5,
              borderBottom: '1px solid rgba(15,23,42,0.06)'
            }}
          >
            <Box sx={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>{p.name}</Box>
            <Box sx={{ fontWeight: 800, fontSize: 13, color: '#334155' }}>{p.community || 'global'}</Box>
            <Box sx={{ fontWeight: 900, fontSize: 13, color: '#0f172a', textAlign: 'right' }}>{p.price} FCFA</Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button size="small" variant="outlined" onClick={() => openEdit(p)} sx={{ borderRadius: 2, fontWeight: 900 }}>
                Edit
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => removeOne(p)}
                sx={{ borderRadius: 2, fontWeight: 900 }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        ))}
        {products.length === 0 && <Box sx={{ px: 2, py: 3, color: '#64748b', fontWeight: 800, fontSize: 13 }}>No products yet.</Box>}
      </Box>

      <Dialog open={editorOpen} onClose={() => setEditorOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 950 }}>{editing ? 'Edit Product' : 'New Product'}</DialogTitle>
        <DialogContent sx={{ pt: 1, display: 'grid', gap: 1.5 }}>
          <TextField label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} fullWidth />
          <TextField label="Price" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} fullWidth />
          <TextField
            label="Community"
            value={form.community}
            onChange={(e) => setForm((f) => ({ ...f, community: e.target.value }))}
            fullWidth
            select
            SelectProps={{ native: true }}
          >
            <option value="">Select community</option>
            <option value="global">Global</option>
            {communities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </TextField>
          <TextField
            label="Category"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            fullWidth
            select
            SelectProps={{ native: true }}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </TextField>
          <TextField label="Vendor" value={form.vendor} onChange={(e) => setForm((f) => ({ ...f, vendor: e.target.value }))} fullWidth />
          <TextField label="Stock" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} fullWidth />

          <Box sx={{ display: 'grid', gap: 1 }}>
            <Button variant="outlined" component="label" sx={{ borderRadius: 3, fontWeight: 900 }}>
              Upload images (max 5)
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  addImagesFromFiles(files);
                  e.currentTarget.value = '';
                }}
              />
            </Button>
            {imagePreview.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {imagePreview.map((src, idx) => (
                  <Box
                    key={`${idx}-${src.slice(0, 24)}`}
                    sx={{
                      width: 84,
                      height: 84,
                      borderRadius: 2,
                      border: '1px solid rgba(15,23,42,0.12)',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    <Box component="img" src={src} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <Button
                      size="small"
                      color="error"
                      variant="contained"
                      onClick={() => removeImage(idx)}
                      sx={{
                        minWidth: 0,
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 2,
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        fontWeight: 950
                      }}
                    >
                      X
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            fullWidth
            multiline
            minRows={3}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => setEditorOpen(false)} disabled={saving} sx={{ borderRadius: 3, fontWeight: 900 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={save} disabled={saving} sx={{ borderRadius: 3, fontWeight: 950 }}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
