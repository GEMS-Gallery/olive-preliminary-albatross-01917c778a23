import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, List, ListItem, ListItemIcon, ListItemText, Checkbox, Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useForm, Controller } from 'react-hook-form';

type Item = {
  id: bigint;
  name: string;
  category?: string;
  icon: string;
  completed: boolean;
};

type Category = {
  id: bigint;
  name: string;
  icon: string;
};

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const { control: itemControl, handleSubmit: handleItemSubmit, reset: resetItemForm } = useForm();
  const { control: categoryControl, handleSubmit: handleCategorySubmit, reset: resetCategoryForm } = useForm();

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    const result = await backend.getItems();
    setItems(result);
  };

  const fetchCategories = async () => {
    const result = await backend.getCategories();
    setCategories(result);
  };

  const handleAddItem = async (data: any) => {
    await backend.addItem(data.name, data.category, data.icon);
    fetchItems();
    setOpenItemDialog(false);
    resetItemForm();
  };

  const handleAddCategory = async (data: any) => {
    await backend.addCategory(data.name, data.icon);
    fetchCategories();
    setOpenCategoryDialog(false);
    resetCategoryForm();
  };

  const handleToggleComplete = async (id: bigint, completed: boolean) => {
    await backend.markItemCompleted(id, !completed);
    fetchItems();
  };

  const handleRemoveItem = async (id: bigint) => {
    await backend.removeItem(id);
    fetchItems();
  };

  const handleRemoveCategory = async (id: bigint) => {
    await backend.removeCategory(id);
    fetchCategories();
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Grocery List
      </Typography>
      <List>
        {items.map((item) => (
          <ListItem key={Number(item.id)} dense button onClick={() => handleToggleComplete(item.id, item.completed)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={item.completed}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary={`${item.icon} ${item.name} ${item.category ? `(${item.category})` : ''}`} />
            <Button onClick={() => handleRemoveItem(item.id)}>Remove</Button>
          </ListItem>
        ))}
      </List>
      <Fab color="primary" aria-label="add item" onClick={() => setOpenItemDialog(true)} style={{ position: 'fixed', bottom: 16, right: 16 }}>
        <AddIcon />
      </Fab>
      <Fab color="secondary" aria-label="add category" onClick={() => setOpenCategoryDialog(true)} style={{ position: 'fixed', bottom: 80, right: 16 }}>
        <AddIcon />
      </Fab>
      <Dialog open={openItemDialog} onClose={() => setOpenItemDialog(false)}>
        <DialogTitle>Add New Item</DialogTitle>
        <form onSubmit={handleItemSubmit(handleAddItem)}>
          <DialogContent>
            <Controller
              name="name"
              control={itemControl}
              defaultValue=""
              rules={{ required: 'Name is required' }}
              render={({ field }) => <TextField {...field} label="Item Name" fullWidth margin="normal" />}
            />
            <Controller
              name="category"
              control={itemControl}
              defaultValue=""
              render={({ field }) => <TextField {...field} label="Category" fullWidth margin="normal" />}
            />
            <Controller
              name="icon"
              control={itemControl}
              defaultValue=""
              rules={{ required: 'Icon is required' }}
              render={({ field }) => <TextField {...field} label="Icon (emoji)" fullWidth margin="normal" />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenItemDialog(false)}>Cancel</Button>
            <Button type="submit" color="primary">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <form onSubmit={handleCategorySubmit(handleAddCategory)}>
          <DialogContent>
            <Controller
              name="name"
              control={categoryControl}
              defaultValue=""
              rules={{ required: 'Name is required' }}
              render={({ field }) => <TextField {...field} label="Category Name" fullWidth margin="normal" />}
            />
            <Controller
              name="icon"
              control={categoryControl}
              defaultValue=""
              rules={{ required: 'Icon is required' }}
              render={({ field }) => <TextField {...field} label="Icon (emoji)" fullWidth margin="normal" />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCategoryDialog(false)}>Cancel</Button>
            <Button type="submit" color="primary">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Typography variant="h6" component="h2" gutterBottom style={{ marginTop: '2rem' }}>
        Categories
      </Typography>
      <List>
        {categories.map((category) => (
          <ListItem key={Number(category.id)}>
            <ListItemText primary={`${category.icon} ${category.name}`} />
            <Button onClick={() => handleRemoveCategory(category.id)}>Remove</Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default App;