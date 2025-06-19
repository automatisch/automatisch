import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
  Box,
  Button,
  Collapse,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

import DatePickerInput from 'components/DatePickerInput';
import useExecutionFilters from 'hooks/useExecutionFilters';
import useFormatMessage from 'hooks/useFormatMessage';

export default function ExecutionFilters() {
  const theme = useTheme();
  const formatMessage = useFormatMessage();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    filters,
    filterByStartDateTime,
    filterByEndDateTime,
    filterByStatus,
  } = useExecutionFilters();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <Box>
      {/* Mobile: Toggle Button for Filters */}
      {isMobile && (
        <Button
          variant="contained"
          startIcon={<FilterAltIcon />}
          onClick={() => setMobileFiltersOpen((prev) => !prev)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {mobileFiltersOpen
            ? formatMessage('executionFilters.hideFilters')
            : formatMessage('executionFilters.showFilters')}
        </Button>
      )}

      {/* Filters Box (Always Visible on Large Screens) */}
      <Collapse in={!isMobile || mobileFiltersOpen}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            mb: 2,
            alignItems: { md: 'center' },
          }}
        >
          {/* Status Filter */}
          <FormControl fullWidth sx={{ maxWidth: { md: 300 } }}>
            <InputLabel shrink>
              {formatMessage('executionFilters.statusFilterLabel')}
            </InputLabel>

            <Select
              label={formatMessage('executionFilters.statusFilterLabel')}
              value={filters.status}
              displayEmpty
              onChange={(e) => filterByStatus(e.target.value)}
              key={filters.status}
            >
              <MenuItem value={undefined}>
                {formatMessage('executionFilters.statusFilterAnyOption')}
              </MenuItem>
              <MenuItem value="success">
                {formatMessage('executionFilters.statusFilterSuccessfulOption')}
              </MenuItem>
              <MenuItem value="failure">
                {formatMessage('executionFilters.statusFilterFailedOption')}
              </MenuItem>
            </Select>
          </FormControl>

          {/* Date Filters */}
          <DatePickerInput
            label={formatMessage('executionFilters.startDateLabel')}
            key={`start-${filters.startDateTime}`}
            defaultValue={filters.startDateTime}
            disableFuture={true}
            onChange={filterByStartDateTime}
            maxDate={filters.endDateTime}
          />

          <DatePickerInput
            label={formatMessage('executionFilters.endDateLabel')}
            key={`end-${filters.endDateTime}`}
            defaultValue={filters.endDateTime}
            disableFuture={true}
            onChange={filterByEndDateTime}
            minDate={filters.startDateTime}
          />
        </Box>
      </Collapse>
    </Box>
  );
}
