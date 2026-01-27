import { useEffect, useState } from 'react';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { listUsers, deleteUser, updateUserRole, type AdminUserRecord } from '../../api/adminApi';
import { useAdminAuth } from '../AdminAuthContext';

export default function UsersAdminPage() {
  const { token } = useAdminAuth();

  const [items, setItems] = useState<AdminUserRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUserRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<AdminUserRecord | null>(null);
  const [newRole, setNewRole] = useState<'buyer' | 'seller' | 'both'>('buyer');
  const [roleUpdateLoading, setRoleUpdateLoading] = useState(false);

  const load = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      const users = await listUsers(token);
      setItems(users);
    } catch (e: any) {
      setError(e?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: AdminUserRecord) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete || !token) return;
    
    setDeleteLoading(true);
    setError(null);
    try {
      await deleteUser(token, userToDelete._id);
      setItems(items.filter(u => u._id !== userToDelete._id));
      setSuccessMessage(`User "${userToDelete.name}" has been deleted successfully.`);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to delete user');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleRoleUpdateClick = (user: AdminUserRecord) => {
    setUserToUpdate(user);
    setNewRole(user.role);
    setRoleDialogOpen(true);
  };

  const handleRoleUpdateConfirm = async () => {
    if (!userToUpdate || !token) return;
    
    setRoleUpdateLoading(true);
    setError(null);
    try {
      console.log('Frontend sending:', { 
        userId: userToUpdate._id, 
        newRole, 
        userToUpdate: userToUpdate 
      });
      
      const updatedUser = await updateUserRole(token, userToUpdate._id, newRole);
      console.log('Frontend received:', updatedUser);
      
      setItems(items.map(u => u._id === userToUpdate._id ? updatedUser : u));
      setSuccessMessage(`User "${userToUpdate.name}" role has been updated to "${newRole}" successfully.`);
      setRoleDialogOpen(false);
      setUserToUpdate(null);
    } catch (e: any) {
      console.error('Frontend error:', e);
      setError(e?.message || 'Failed to update user role');
    } finally {
      setRoleUpdateLoading(false);
    }
  };

  const handleRoleUpdateCancel = () => {
    setRoleDialogOpen(false);
    setUserToUpdate(null);
    setNewRole('buyer');
  };

  useEffect(() => {
    if (!token) return;
    load();
  }, [token]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontWeight: 950, fontSize: 24, color: '#0f172a' }}>Users</Typography>
          <Typography sx={{ mt: 0.25, fontSize: 13, fontWeight: 800, color: '#64748b' }}>Total: {items.length}</Typography>
        </Box>
        <Button variant="outlined" onClick={load} disabled={loading} sx={{ borderRadius: 3, fontWeight: 900 }}>
          Refresh
        </Button>
      </Box>

      {error && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Box>
      )}

      {successMessage && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="success" onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        </Box>
      )}

      <Box sx={{ mt: 2, border: '1px solid rgba(15,23,42,0.10)', borderRadius: 3, background: '#fff' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1.6fr 0.8fr 1.2fr 1.2fr',
            gap: 2,
            px: 2,
            py: 1.5,
            borderBottom: '1px solid rgba(15,23,42,0.08)'
          }}
        >
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Name</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Email</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Role</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Created</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Actions</Box>
        </Box>

        {items.map((u) => (
          <Box
            key={u._id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.6fr 0.8fr 1.2fr 1.2fr',
              gap: 2,
              px: 2,
              py: 1.5,
              borderBottom: '1px solid rgba(15,23,42,0.06)',
              alignItems: 'center'
            }}
          >
            <Box sx={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>{u.name}</Box>
            <Box sx={{ fontWeight: 800, fontSize: 13, color: '#334155' }}>{u.email}</Box>
            <Box>
              <Box sx={{
                display: 'inline-block',
                px: 2,
                py: 0.5,
                borderRadius: 1,
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                ...(u.role === 'seller' && {
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  color: '#16a34a'
                }),
                ...(u.role === 'buyer' && {
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  color: '#2563eb'
                }),
                ...(u.role === 'both' && {
                  backgroundColor: 'rgba(168, 85, 247, 0.1)',
                  color: '#9333ea'
                })
              }}>
                {u.role}
              </Box>
            </Box>
            <Box sx={{ fontWeight: 900, fontSize: 13, color: '#0f172a' }}>{new Date(u.createdAt).toLocaleDateString()}</Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleRoleUpdateClick(u)}
                sx={{ 
                  borderRadius: 2, 
                  fontWeight: 800, 
                  fontSize: 12,
                  borderColor: 'rgba(34, 197, 94, 0.5)',
                  color: '#16a34a',
                  '&:hover': {
                    borderColor: '#16a34a',
                    backgroundColor: 'rgba(34, 197, 94, 0.04)'
                  }
                }}
              >
                Update Role
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDeleteClick(u)}
                sx={{ 
                  borderRadius: 2, 
                  fontWeight: 800, 
                  fontSize: 12,
                  borderColor: 'rgba(239,68,68,0.5)',
                  color: '#dc2626',
                  '&:hover': {
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(239,68,68,0.04)'
                  }
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        ))}

        {items.length === 0 && (
          <Box sx={{ px: 2, py: 3, color: '#64748b', fontWeight: 800, fontSize: 13 }}>No users yet.</Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: 18, color: '#0f172a' }}>
          Confirm User Deletion
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, color: '#334155', fontSize: 14 }}>
            Are you sure you want to delete the user "{userToDelete?.name}"? This action cannot be undone.
          </Typography>
          {userToDelete && (
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'rgba(239,68,68,0.04)', 
              borderRadius: 2,
              border: '1px solid rgba(239,68,68,0.2)'
            }}>
              <Typography sx={{ fontWeight: 800, fontSize: 13, color: '#0f172a', mb: 0.5 }}>
                User Details:
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#334155' }}>
                Name: {userToDelete.name}
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#334155' }}>
                Email: {userToDelete.email}
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#334155' }}>
                Member since: {new Date(userToDelete.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{ borderRadius: 2, fontWeight: 800 }}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2, fontWeight: 800 }}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Role Update Dialog */}
      <Dialog
        open={roleDialogOpen}
        onClose={handleRoleUpdateCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: 18, color: '#0f172a' }}>
          Update User Role
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, color: '#334155', fontSize: 14 }}>
            Update the role for user "{userToUpdate?.name}"
          </Typography>
          {userToUpdate && (
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'rgba(34, 197, 94, 0.04)', 
              borderRadius: 2,
              border: '1px solid rgba(34, 197, 94, 0.2)',
              mb: 2
            }}>
              <Typography sx={{ fontWeight: 800, fontSize: 13, color: '#0f172a', mb: 0.5 }}>
                User Details:
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#334155' }}>
                Name: {userToUpdate.name}
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#334155' }}>
                Email: {userToUpdate.email}
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#334155' }}>
                Current Role: {userToUpdate.role}
              </Typography>
            </Box>
          )}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel sx={{ fontSize: 14, fontWeight: 600 }}>New Role</InputLabel>
            <Select
              value={newRole}
              label="New Role"
              onChange={(e) => setNewRole(e.target.value as 'buyer' | 'seller' | 'both')}
              sx={{ fontSize: 14 }}
            >
              <MenuItem value="buyer" sx={{ fontSize: 14 }}>Buyer</MenuItem>
              <MenuItem value="seller" sx={{ fontSize: 14 }}>Seller</MenuItem>
              <MenuItem value="both" sx={{ fontSize: 14 }}>Both</MenuItem>
            </Select>
          </FormControl>
          <Typography sx={{ mt: 2, fontSize: 12, color: '#64748b' }}>
            <strong>Roles:</strong>
            <br />• <strong>Buyer:</strong> Can only purchase products
            <br />• <strong>Seller:</strong> Can add and manage products
            <br />• <strong>Both:</strong> Can buy and sell products
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleRoleUpdateCancel}
            variant="outlined"
            sx={{ borderRadius: 2, fontWeight: 800 }}
            disabled={roleUpdateLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRoleUpdateConfirm}
            variant="contained"
            sx={{ 
              borderRadius: 2, 
              fontWeight: 800,
              backgroundColor: '#16a34a',
              '&:hover': { backgroundColor: '#15803d' }
            }}
            disabled={roleUpdateLoading}
          >
            {roleUpdateLoading ? 'Updating...' : 'Update Role'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
