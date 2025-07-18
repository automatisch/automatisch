import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/joy/Divider';
import PropTypes from 'prop-types';

import ArrayFieldEntry from './ArrayFieldEntry';

function ArrayField(props) {
  const {
    name,
    fields,
    minItems = 0,
    maxItems,
    searchParamsObject = {},
    dateFormat,
    timeFormat,
  } = props;

  const [items, setItems] = React.useState(() => {
    // Check if there's existing array data
    const existingData = searchParamsObject[name];
    if (existingData && Array.isArray(existingData)) {
      return existingData.map((item) => ({ ...item, __id: uuidv4() }));
    }

    // Parse URL params to find array field items
    const itemsFromParams = {};
    Object.entries(searchParamsObject).forEach(([key, value]) => {
      if (key.startsWith(`${name}.`)) {
        const [, index, subfieldKey] = key.split('.');
        const itemIndex = parseInt(index, 10);
        if (!isNaN(itemIndex) && subfieldKey) {
          itemsFromParams[itemIndex] = itemsFromParams[itemIndex] || {};
          itemsFromParams[itemIndex][subfieldKey] = value;
        }
      }
    });

    // Convert to array and ensure we have items for all indices
    const maxIndex = Math.max(...Object.keys(itemsFromParams).map(Number), -1);
    if (maxIndex >= 0) {
      const itemsArray = [];
      for (let i = 0; i <= maxIndex; i++) {
        itemsArray.push({
          ...createEmptyItem(),
          ...(itemsFromParams[i] || {}),
        });
      }
      return itemsArray;
    }

    // Default to minItems number of items (or 1 if minItems is not set)
    const itemCount = minItems !== undefined ? minItems : 1;
    return Array.from({ length: itemCount }, () => createEmptyItem());
  });

  function createEmptyItem() {
    return fields.reduce(
      (acc, field) => {
        acc[field.key] = '';
        return acc;
      },
      { __id: uuidv4() },
    );
  }

  const addItem = () => {
    if (maxItems && items.length >= maxItems) return;
    setItems([...items, createEmptyItem()]);
  };

  const removeItem = (index) => {
    if (items.length <= minItems) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const canRemove = items.length > minItems;
  const canAdd = !maxItems || items.length < maxItems;

  return (
    <Stack spacing={2}>
      {items.map((item, index) => (
        <React.Fragment key={item.__id}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box sx={{ flex: 1 }}>
              <ArrayFieldEntry
                fields={fields}
                namePrefix={`${name}.${index}`}
                searchParamsObject={searchParamsObject}
                dateFormat={dateFormat}
                timeFormat={timeFormat}
              />
            </Box>
            {canRemove && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  pt: 2.5,
                }}
              >
                <IconButton
                  size="sm"
                  variant="plain"
                  color="danger"
                  onClick={() => removeItem(index)}
                >
                  <RemoveIcon />
                </IconButton>
              </Box>
            )}
          </Stack>
          {index < items.length - 1 && <Divider />}
        </React.Fragment>
      ))}

      {canAdd && (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
          <IconButton size="sm" variant="soft" onClick={addItem}>
            <AddIcon />
          </IconButton>
          <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
            Add item
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}

ArrayField.propTypes = {
  name: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      required: PropTypes.bool,
      readonly: PropTypes.bool,
      options: PropTypes.array,
      validationFormat: PropTypes.string,
      validationPattern: PropTypes.string,
      validationHelperText: PropTypes.string,
    }),
  ).isRequired,
  minItems: PropTypes.number,
  maxItems: PropTypes.number,
  searchParamsObject: PropTypes.object,
  dateFormat: PropTypes.string,
  timeFormat: PropTypes.string,
};

export default ArrayField;
