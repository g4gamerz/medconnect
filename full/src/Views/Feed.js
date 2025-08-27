import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import { fetchItems } from '../Api.js';
import DocumentDetail from './DocumentDetail.js';
import Tags from './Tags.js'

import { formatDateSafe } from '../utils/formatters.js'; // Import the new function

// The old formatDate helper is no longer needed and can be deleted.

function Item({ item, setDetailedDocument }) {
  const { name, tags, description, category } = item;
  const itemDate = item.Datum || item.PublicationDate;

  return (
    <Paper onClick={() => setDetailedDocument(item)} elevation={3} sx={{ p: 3, borderRadius: 2, cursor: 'pointer' }}>
      <Stack spacing={1.5}>
        <Typography variant="h6">{name}</Typography>
        
        {category === 'GUIDELINE' ? (
          <Box>
            <Tags tags={tags} />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                <strong>Start Date:</strong> {formatDateSafe(item.Stand)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                <strong>Expiry Date:</strong> {formatDateSafe(item.Gueltigkeit)}
              </Typography>
            </Box>
          </Box>
        ) : (
          // The Tags component will now handle the safe formatting
          <Tags tags={tags} date={itemDate} />
        )}

        <Typography variant="body2" color="text.secondary" sx={{ maxHeight: 100, overflow: "hidden" }}>
          {description}
        </Typography>
      </Stack>
    </Paper>
  );
}

/// Tab bar at the top
function DocumentSelector({tabs, selectedTab, setSelectedTab}) {
  return <>
    <Tabs value={selectedTab} onChange={(_,newValue)=>setSelectedTab(newValue)} sx={{ flexGrow: 1 }}>
      {tabs.map((tab, index) =><Tab key={index} label={tab.label}/>)}
    </Tabs>
  </>
}

/// The main feed
export default function Feed({ selectedTags, selectedPubTypes, setTagSelectionOpen }) {
  const [items, setItems] = useState({ papers: [], guidelines: [], drugs: [], konsilium: [] });
  const [selectedTab, setSelectedTab] = useState(0);
  const [detailDocument, setDetailedDocument] = useState(undefined);

  useEffect(() => {
    const filters = {
      tags: selectedTags,
      pubTypes: selectedPubTypes,
    };
    fetchItems(filters).then(data => {
      const sortedData = {};
      for (const category in data) {
        sortedData[category] = data[category].sort((a, b) => {
          // --- THIS LOGIC IS NOW UPDATED ---
          const dateA = a.Datum || a.PublicationDate || a.Stand;
          const dateB = b.Datum || b.PublicationDate || b.Stand;
          
          if (!dateB) return -1;
          if (!dateA) return 1;
          
          return new Date(dateB) - new Date(dateA);
        });
      }
      setItems(sortedData);
    });
  }, [selectedTags, selectedPubTypes]);

  const tabs = [
    { label: 'Publikationen', items: items.papers },
    { label: 'Leitlinien', items: items.guidelines },
    { label: 'Therapien', items: items.drugs },
    { label: 'Konsilium', items: items.konsilium }
  ];

  const currentItems = (tabs[selectedTab] && tabs[selectedTab].items) || [];

  if (detailDocument) return <DocumentDetail document={detailDocument} back={()=>setDetailedDocument(undefined)}/>

  return <Box sx={{ mx: 2, my: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, mb: 1, fontSize: 25, fontWeight: 'bold'}}>
      Deine persönlichen Neurologie News
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <DocumentSelector tabs={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
      <IconButton onClick={()=>setTagSelectionOpen(true)}><FilterListIcon /></IconButton>
    </Box>
    <Stack spacing={3}>
      {currentItems.map((item, index)=><Item key={index} setDetailedDocument={setDetailedDocument} item={item} />)}
    </Stack>
  </Box>;
}