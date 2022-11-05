import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';

import useFormatMessage from 'hooks/useFormatMessage';

type SearchInputProps = {
  onChange?: (event: React.ChangeEvent) => void;
};

export default function SearchInput({
  onChange,
}: SearchInputProps): React.ReactElement {
  const formatMessage = useFormatMessage();

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel htmlFor="search-input">
        {formatMessage('searchPlaceholder')}
      </InputLabel>

      <OutlinedInput
        id="search-input"
        type="text"
        size="medium"
        fullWidth
        onChange={onChange}
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon sx={{ color: (theme) => theme.palette.primary.main }} />
          </InputAdornment>
        }
        label={formatMessage('searchPlaceholder')}
      />
    </FormControl>
  );
}
