import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, List, ListItem, ListItemIcon, ListItemText, Checkbox, Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';
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

const PredefinedItems: React.FC<{ items: PredefinedItem[], onAddItem: (item: PredefinedItem) => void }> = ({ items, onAddItem }) => {
  return (
    <Grid container spacing={2}>
      {items.map((item, index) => (
        <Grid item xs={6} sm={4} md={3} key={index}>
          <Button
            variant="outlined"
            startIcon={<span>{item.icon}</span>}
            endIcon={<AddIcon />}
            onClick={() => onAddItem(item)}
            fullWidth
          >
            {item.name}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [predefinedSupplies, setPredefinedSupplies] = useState<PredefinedItem[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchItems();
    fetchPredefinedSupplies();
  }, []);

  const fetchItems = async () => {
    const result = await backend.getItems();
    setItems(result);
  };

  const fetchPredefinedSupplies = async () => {
    const result = await backend.getPredefinedSupplies();
    setPredefinedSupplies(result);
  };

  const handleAddItem = async (data: any) => {
    await backend.addItem(data.name, "Supplies", data.icon);
    fetchItems();
    setOpenDialog(false);
    reset();
  };

  const handleAddPredefinedItem = async (item: PredefinedItem) => {
    await backend.addItem(item.name, "Supplies", item.icon);
    fetchItems();
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
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Supplies List
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom>
        Predefined Supplies
      </Typography>
      <PredefinedItems items={predefinedSupplies} onAddItem={handleAddPredefinedItem} />
      <Typography variant="h6" component="h2" gutterBottom style={{ marginTop: '2rem' }}>
        Your List
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