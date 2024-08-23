import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, List, ListItem, ListItemIcon, ListItemText, Checkbox, Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, CircularProgress, Paper, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
                  startIcon={<span>{item.icon}</span>}
                  endIcon={loadingItems[`${category.name}-${item.name}`] ? <CircularProgress size={20} /> : <AddIcon />}
                  onClick={() => onAddItem(item, category.name)}
                  fullWidth
                  disabled={loadingItems[`${category.name}-${item.name}`]}
                  className="item-button"
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
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
      await backend.addItem(data.name, data.category, data.icon);
      await fetchItems();
      setOpenDialog(false);
      reset();
    } finally {
      setLoadingItems(prev => ({ ...prev, [data.name]: false }));
    }
  };

  const handleAddPredefinedItem = async (item: PredefinedItem, category: string) => {
    const key = `${category}-${item.name}`;
    setLoadingItems(prev => ({ ...prev, [key]: true }));
    try {
      await backend.addItem(item.name, category, item.icon);
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Grocery List
      </Typography>
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
              sx={{ borderRadius: 1, mb: 1 }}
            >
              <ListItemIcon>
                {loadingItems[item.id.toString()] ? (
                  <CircularProgress size={20} />
                ) : (
                  <Checkbox
                    edge="start"
                    checked={item.completed}
                    tabIndex={-1}
                    disableRipple
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primary={`${item.icon} ${item.name}`}
                secondary={item.category}
                primaryTypographyProps={{ style: { textDecoration: item.completed ? 'line-through' : 'none' } }}
              />
              <Button
                onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.id); }}
                disabled={loadingItems[item.id.toString()]}
                color="error"
                size="small"
              >
                {loadingItems[item.id.toString()] ? <CircularProgress size={20} /> : 'Remove'}
              </Button>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setOpenDialog(true)}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        className="fab-button"
      >
        <AddIcon />
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
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" color="primary" disabled={loadingItems['customItem']}>
              {loadingItems['customItem'] ? <CircularProgress size={20} /> : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default App;