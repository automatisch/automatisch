import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  Collapse,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useTheme } from '@mui/material/styles';

import Can from 'components/Can';
import useCurrentUserRuleConditions from 'hooks/useCurrentUserRuleConditions';
import useFlowFilters from 'hooks/useFlowFilters';
import useFormatMessage from 'hooks/useFormatMessage';

export default function FlowFilters({ onFilterChange }) {
  const theme = useTheme();
  const formatMessage = useFormatMessage();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentUserRuleConditions = useCurrentUserRuleConditions();

  const { filters, filterByStatus, filterByOwnership } = useFlowFilters();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const currentUserReadFlowsConditions = currentUserRuleConditions(
    'read',
    'Flow',
  );

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
            ? formatMessage('flowFilters.hideFilters')
            : formatMessage('flowFilters.showFilters')}
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
          {/* User Flows Filter */}
          {currentUserReadFlowsConditions &&
            !currentUserReadFlowsConditions?.isCreator && (
              <FormControl
                fullWidth
                sx={{ maxWidth: { md: 200 } }}
                variant="outlined"
              >
                <InputLabel shrink>
                  {formatMessage('flowFilters.flowsFilterLabel')}
                </InputLabel>

                <Select
                  label={formatMessage('flowFilters.flowsFilterLabel')}
                  value={filters.onlyOwnedFlows}
                  displayEmpty
                  onChange={(e) => filterByOwnership(e.target.value)}
                >
                  <MenuItem value={undefined}>
                    {formatMessage('flowFilters.flowsFilterAllOption')}
                  </MenuItem>
                  <MenuItem value={true}>
                    {formatMessage('flowFilters.flowsFilterOnlyMineOption')}
                  </MenuItem>
                </Select>
              </FormControl>
            )}

          {/* Status Filter */}
          <FormControl fullWidth sx={{ maxWidth: { md: 200 } }}>
            <InputLabel shrink>
              {formatMessage('flowFilters.statusFilterLabel')}
            </InputLabel>

            <Select
              label={formatMessage('flowFilters.statusFilterLabel')}
              value={filters.status}
              displayEmpty
              onChange={(e) => filterByStatus(e.target.value)}
            >
              <MenuItem value={undefined}>
                {formatMessage('flowFilters.statusFilterAnyOption')}
              </MenuItem>
              <MenuItem value="published">
                {formatMessage('flowFilters.statusFilterPublishedOption')}
              </MenuItem>
              <MenuItem value="draft">
                {formatMessage('flowFilters.statusFilterDraftOption')}
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Collapse>
    </Box>
  );
}
