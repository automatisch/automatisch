import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import ConditionalIconButton from 'components/ConditionalIconButton';
import SearchIcon from '@mui/icons-material/Search';

export default function ExecutionFilters() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker label="From" />
        <DatePicker label="Until" />
        <TextField
          label="By data in/out"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />

        <Grid
          container
          item
          xs="auto"
          sm="auto"
          alignItems="center"
          order={{ xs: 1, sm: 2 }}
        >
          <ConditionalIconButton
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            icon={<SearchIcon />}
            data-test="create-flow-button"
          >
            Search
          </ConditionalIconButton>
        </Grid>
      </DemoContainer>
    </LocalizationProvider>
  );
}
