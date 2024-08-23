import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, List, ListItem, ListItemIcon, ListItemText, Checkbox, Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, CircularProgress, Paper, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useForm, Controller } from 'react-hook-form';

type Item = {
  id: bigint;
  name: string;
  category: string;
  icon: string;
  quantity: number;
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

const PredefinedItems: React.FC<{ categories: Category[], onAddItem: (item: PredefinedItem, category: string, quantity: number) => void, loadingItems: { [key: string]: boolean } }> = ({ categories, onAddItem, loadingItems }) => {
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
                <Box display="flex" alignItems="center">
                  <Button
                    variant="outlined"
                    startIcon={<span style={{ fontSize: '1.2rem' }}>{item.icon}</span>}
                    endIcon={loadingItems[`${category.name}-${item.name}`] ? <CircularProgress size={16} /> : <AddIcon />}
                    onClick={() => onAddItem(item, category.name, 1)}
                    disabled={loadingItems[`${category.name}-${item.name}`]}
                    className="item-button"
                    sx={{ justifyContent: 'flex-start', textTransform: 'none', flexGrow: 1, mr: 1, py: 1, fontSize: '0.9rem' }}
                    fullWidth
                  >
                    {item.name}
                  </Button>
                  <TextField
                    type="number"
                    InputProps={{ inputProps: { min: 1, style: { textAlign: 'center', padding: '0.5rem 0' } } }}
                    defaultValue={1}
                    size="small"
                    sx={{ width: '60px' }}
                    onChange={(e) => {
                      const quantity = parseInt(e.target.value, 10);
                      if (quantity > 0) {
                        onAddItem(item, category.name, quantity);
                      }
                    }}
                  />
                </Box>
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
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    const result = await backend.getItems();
    setItems(result);
  };

  const fetchCategories = async () => {
    const result = await backend.getPredefinedCategories();
    setCategories(result);
  };

  const handleAddItem = async (data: any) => {
    setLoadingItems(prev => ({ ...prev, [data.name]: true }));
    try {
      await backend.addItem(data.name, data.category, data.icon, data.quantity);
      await fetchItems();
      setOpenDialog(false);
      reset();
    } finally {
      setLoadingItems(prev => ({ ...prev, [data.name]: false }));
    }
  };

  const handleAddPredefinedItem = async (item: PredefinedItem, category: string, quantity: number) => {
    const key = `${category}-${item.name}`;
    setLoadingItems(prev => ({ ...prev, [key]: true }));
    try {
      await backend.addItem(item.name, category, item.icon, quantity);
      await fetchItems();
    } finally {
      setLoadingItems(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleToggleComplete = async (id: bigint, completed: boolean) => {
    setLoadingItems(prev => ({ ...prev, [id.toString()]: true }));
    try {
      await backend.markItemCompleted(id, !completed);
      await fetchItems();
    } finally {
      setLoadingItems(prev => ({ ...prev, [id.toString()]: false }));
    }
  };

  const handleRemoveItem = async (id: bigint) => {
    setLoadingItems(prev => ({ ...prev, [id.toString()]: true }));
    try {
      await backend.removeItem(id);
      await fetchItems();
    } finally {
      setLoadingItems(prev => ({ ...prev, [id.toString()]: false }));
    }
  };

  const handleUpdateQuantity = async (id: bigint, quantity: number) => {
    setLoadingItems(prev => ({ ...prev, [id.toString()]: true }));
    try {
      await backend.updateItemQuantity(id, quantity);
      await fetchItems();
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
              <TextField
                type="number"
                value={item.quantity}
                onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value, 10))}
                InputProps={{ inputProps: { min: 1, style: { textAlign: 'center', padding: '0.5rem 0' } } }}
                size="small"
                sx={{ width: '70px', mr: 2 }}
              />
              <IconButton
                onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.id); }}
                disabled={loadingItems[item.id.toString()]}
                color="error"
                size="large"
              >
                {loadingItems[item.id.toString()] ? <CircularProgress size={24} /> : <AddIcon />}
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
            <Controller
              name="quantity"
              control={control}
              defaultValue={1}
              rules={{ required: 'Quantity is required', min: 1 }}
              render={({ field }) => <TextField {...field} type="number" label="Quantity" fullWidth margin="normal" InputProps={{ inputProps: { min: 1 } }} />}
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
    </Container>
  );
};

export default App;