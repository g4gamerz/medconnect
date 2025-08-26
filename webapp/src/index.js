import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Feed from './Views/Feed';
import TagSelection from './Views/TagSelection';
import './index.css';

/// Main entry point for the app
function App() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPubTypes, setSelectedPubTypes] = useState([]);
  const [tagSelectionOpen, setTagSelectionOpen] = useState(true);

  return (
    <>
      <Feed
        selectedTags={selectedTags}
        selectedPubTypes={selectedPubTypes}
        setTagSelectionOpen={setTagSelectionOpen}
      />
      <TagSelection
        open={tagSelectionOpen}
        setOpen={setTagSelectionOpen}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        selectedPubTypes={selectedPubTypes}
        setSelectedPubTypes={setSelectedPubTypes}
      />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);