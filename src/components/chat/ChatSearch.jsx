import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function ChatSearch({ searchQuery, setSearchQuery, darkMode }) {
  return (
    <TextField
      fullWidth
      size="small"
      placeholder="Search messages"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
        sx: {
          borderRadius: 20,
          bgcolor: darkMode ? '#262626' : '#fafafa',
          '& fieldset': { border: 'none' },
        },
      }}
    />
  );
}