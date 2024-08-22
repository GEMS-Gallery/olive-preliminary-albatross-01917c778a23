import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, List, ListItem, ListItemIcon, ListItemText, Checkbox, Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useForm, Controller } from 'react-hook-form';

type Item = {
  id: bigint;
  name: string;
  category: string;
  icon: string;
  completed: boolean;
};

type Category = {
  name: string;
  icon: string;
};

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
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
    const result = await backend.getCategories();
    setCategories(result);
  };

  const handleAddItem = async (data: any) => {
    await backend.addItem(data.name, data.category, data.icon);
    fetchItems();
    setOpenDialog(false);
    reset();
  };

  const handleToggleComplete = async (id: bigint, completed: boolean) => {
    await backend.markItemCompleted(id, !completed);
    fetchItems();
  };

  const handleRemoveItem = async (id: bigint) => {
    await backend.removeItem(id);
    fetchItems();
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
            <ListItemText primary={`${item.icon} ${item.name}`} />
            <Button onClick={() => handleRemoveItem(item.id)}>Remove</Button>
          </ListItem>
        ))}
      </List>
      <Fab color="primary" aria-label="add" onClick={() => setOpenDialog(true)} style={{ position: 'fixed', bottom: 16, right: 16 }}>
        <AddIcon />
      </Fab>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Item</DialogTitle>
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
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select {...field}>
                    {categories.map((category) => (
                      <MenuItem key={category.name} value={category.name}>
                        {category.icon} {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
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
            <Button type="submit" color="primary">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default App;