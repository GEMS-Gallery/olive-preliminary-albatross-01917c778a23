import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, List, ListItem, ListItemIcon, ListItemText, Checkbox, Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, CircularProgress, Paper, Box, IconButton, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useForm, Controller } from 'react-hook-form';

type Item = {
  id: bigint;
  name: string;
  category: string;
  icon: string;
  completed: boolean;
};

type PredefinedItem = {
  name: string;
  icon: string;
};

type Category = {
  name: string;
  items: PredefinedItem[];
};

const PredefinedItems: React.FC<{ categories: Category[], onAddItem: (item: PredefinedItem, category: string) => void, loadingItems: { [key: string]: boolean } }> = ({ categories, onAddItem, loadingItems }) => {
  return (
    <Box sx={{ mb: 4 }}>
      {categories.map((category) => (
        <Paper key={category.name} elevation={0} sx={{ p: 2, mb: 2, backgroundColor: 'background.default' }}>
          <Typography variant="h6" className="category-title" gutterBottom>
            {category.name}
          </Typography>
          <Grid container spacing={2}>
            {category.items.map((item, index) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                <Button
                  variant="outlined"
                  startIcon={<span style={{ fontSize: '1.2rem' }}>{item.icon}</span>}
                  endIcon={loadingItems[`${category.name}-${item.name}`] ? <CircularProgress size={16} /> : <AddIcon />}
                  onClick={() => onAddItem(item, category.name)}
                  disabled={loadingItems[`${category.name}-${item.name}`]}
                  className="item-button"
                  sx={{ justifyContent: 'flex-start', textTransform: 'none', py: 1, fontSize: '0.9rem' }}
                  fullWidth
                >
                  {item.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      const result = await backend.getItems();
      setItems(result);
    } catch (error) {
      console.error('Error fetching items:', error);
      setSnackbar({ open: true, message: 'Failed to fetch items. Please try again.', severity: 'error' });
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await backend.getPredefinedCategories();
      setCategories(result);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setSnackbar({ open: true, message: 'Failed to fetch categories. Please try again.', severity: 'error' });
    }
  };

  const handleAddItem = async (data: any) => {
    setLoadingItems(prev => ({ ...prev, [data.name]: true }));
    try {
      const result = await backend.addItem(data.name, data.category, data.icon);
      if ('ok' in result) {
        await fetchItems();
        setOpenDialog(false);
        reset();
        setSnackbar({ open: true, message: 'Item added successfully!', severity: 'success' });
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      setSnackbar({ open: true, message: 'Failed to add item. Please try again.', severity: 'error' });
    } finally {
      setLoadingItems(prev => ({ ...prev, [data.name]: false }));
    }
  };

  const handleAddPredefinedItem = async (item: PredefinedItem, category: string) => {
    const key = `${category}-${item.name}`;
    setLoadingItems(prev => ({ ...prev, [key]: true }));
    try {
      const result = await backend.addItem(item.name, category, item.icon);
      if ('ok' in result) {
        await fetchItems();
        setSnackbar({ open: true, message: 'Item added successfully!', severity: 'success' });
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error adding predefined item:', error);
      setSnackbar({ open: true, message: 'Failed to add item. Please try again.', severity: 'error' });
    } finally {
      setLoadingItems(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleToggleComplete = async (id: bigint, completed: boolean) => {
    setLoadingItems(prev => ({ ...prev, [id.toString()]: true }));
    try {
      const result = await backend.markItemCompleted(id, !completed);
      if ('ok' in result) {
        await fetchItems();
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error toggling item completion:', error);
      setSnackbar({ open: true, message: 'Failed to update item. Please try again.', severity: 'error' });
    } finally {
      setLoadingItems(prev => ({ ...prev, [id.toString()]: false }));
    }
  };

  const handleRemoveItem = async (id: bigint) => {
    setLoadingItems(prev => ({ ...prev, [id.toString()]: true }));
    try {
      const result = await backend.removeItem(id);
      if ('ok' in result) {
        await fetchItems();
        setSnackbar({ open: true, message: 'Item removed successfully!', severity: 'success' });
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error removing item:', error);
      setSnackbar({ open: true, message: 'Failed to remove item. Please try again.', severity: 'error' });
    } finally {
      setLoadingItems(prev => ({ ...prev, [id.toString()]: false }));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mr: 2 }}>
          Grocery List
        </Typography>
        <ShoppingCartIcon sx={{ fontSize: 40, color: 'primary.main' }} />
      </Box>
      <PredefinedItems categories={categories} onAddItem={handleAddPredefinedItem} loadingItems={loadingItems} />
      <Paper elevation={0} sx={{ p: 2, backgroundColor: 'background.default' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
          Your List
        </Typography>
        <List>
          {items.map((item) => (
            <ListItem
              key={Number(item.id)}
              dense
              button
              onClick={() => handleToggleComplete(item.id, item.completed)}
              disabled={loadingItems[item.id.toString()]}
              className="list-item"
              sx={{ borderRadius: 1, mb: 1, py: 1.5 }}
            >
              <ListItemIcon>
                {loadingItems[item.id.toString()] ? (
                  <CircularProgress size={24} />
                ) : (
                  <Checkbox
                    edge="start"
                    checked={item.completed}
                    tabIndex={-1}
                    disableRipple
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primary={<span style={{ fontSize: '1.1rem' }}>{`${item.icon} ${item.name}`}</span>}
                secondary={<span style={{ fontSize: '0.9rem' }}>{item.category}</span>}
                primaryTypographyProps={{ style: { textDecoration: item.completed ? 'line-through' : 'none' } }}
              />
              <IconButton
                onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.id); }}
                disabled={loadingItems[item.id.toString()]}
                color="error"
                size="large"
              >
                {loadingItems[item.id.toString()] ? <CircularProgress size={24} /> : <DeleteIcon />}
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setOpenDialog(true)}
        sx={{ position: 'fixed', bottom: 24, right: 24, width: 64, height: 64 }}
        className="fab-button"
      >
        <AddIcon sx={{ fontSize: 32 }} />
      </Fab>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Custom Item</DialogTitle>
        <form onSubmit={handleSubmit(handleAddItem)}>
          <DialogContent>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: 'Name is required' }}
              render={({ field }) => <TextField {...field} label="Item Name" fullWidth margin="normal" />}
            />
            <Controller
              name="category"
              control={control}
              defaultValue=""
              rules={{ required: 'Category is required' }}
              render={({ field }) => <TextField {...field} label="Category" fullWidth margin="normal" />}
            />
            <Controller
              name="icon"
              control={control}
              defaultValue=""
              rules={{ required: 'Icon is required' }}
              render={({ field }) => <TextField {...field} label="Icon (emoji)" fullWidth margin="normal" />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} size="large">Cancel</Button>
            <Button type="submit" color="primary" disabled={loadingItems['customItem']} size="large">
              {loadingItems['customItem'] ? <CircularProgress size={24} /> : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;