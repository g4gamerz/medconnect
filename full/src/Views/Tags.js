import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { formatDateSafe } from '../utils/formatters.js'; // Import the new function

export default function Tags({ tags, date }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      {/* Container for the chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {tags && tags.map((tag, index) => (
          <Chip size="small" key={index} label={tag} color="default" variant="filled" />
        ))}
      </Box>

      {/* Conditionally render the date if it's provided */}
      {date && (
        <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, ml: 2 }}>
          {/* Use the new safe formatter */}
          {formatDateSafe(date)}
        </Typography>
      )}
    </Box>
  );
}