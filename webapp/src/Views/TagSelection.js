import React, { useEffect, useState } from 'react';
import { Backdrop, Fade, Paper, Stack, Typography, IconButton, Button, Box, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { fetchTags, fetchPublicationTypes } from '../Api.js';

function FilterSection({ title, items, selectedItems, onToggle }) {
  if (!items || items.length === 0) return null;

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{title}</Typography>
      <Divider sx={{ my: 1 }} />
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {items.map((item, i) => (
          <Button
            key={i}
            variant={selectedItems.includes(item) ? 'contained' : 'outlined'}
            size="small"
            onClick={() => onToggle(item)}
          >
            {item}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}

export default function TagSelection({ 
  open, setOpen, 
  selectedTags, setSelectedTags,
  selectedPubTypes, setSelectedPubTypes
}) {
  const [tags, setTags] = useState([]);
  const [pubTypes, setPubTypes] = useState([]);

  useEffect(() => {
    fetchTags().then(setTags);
    fetchPublicationTypes().then(setPubTypes);
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags(selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag]);
  };

  const togglePubType = (pubType) => {
    setSelectedPubTypes(selectedPubTypes.includes(pubType) ? selectedPubTypes.filter(pt => pt !== pubType) : [...selectedPubTypes, pubType]);
  };

  return (
    <Backdrop open={open} onClick={() => setOpen(false)} sx={{ zIndex: theme => theme.zIndex.drawer + 1, bgcolor: 'rgba(0,0,0,0.5)' }}>
      <Fade in={open}>
        <Paper
          onClick={e => e.stopPropagation()}
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '70vh', p: 3, borderTopLeftRadius: 2, borderTopRightRadius: 2, overflowY: 'auto' }}
          elevation={8}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h5" sx={{fontWeight: 'bold'}}>Filter</Typography>
            <IconButton onClick={() => setOpen(false)} size="small"><CloseIcon /></IconButton>
          </Stack>

          <FilterSection title="Krankheit" items={tags} selectedItems={selectedTags} onToggle={toggleTag} />
          <FilterSection title="Publikationsart" items={pubTypes} selectedItems={selectedPubTypes} onToggle={togglePubType} />

        </Paper>
      </Fade>
    </Backdrop>
  );
}