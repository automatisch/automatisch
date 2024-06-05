import React from 'react';
import PropTypes from 'prop-types';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const SuggestionItem = (props) => {
  const { index, style, data, onSuggestionClick } = props;
  const suboption = data[index];
  return (
    <ListItemButton
      sx={{ pl: 4 }}
      divider
      onClick={() => onSuggestionClick(suboption)}
      data-test="power-input-suggestion-item"
      key={index}
      style={style}
    >
      <ListItemText
        primary={suboption.label}
        primaryTypographyProps={{
          variant: 'subtitle1',
          title: 'Property name',
          sx: { fontWeight: 700 },
        }}
        secondary={suboption.sampleValue || ''}
        secondaryTypographyProps={{
          variant: 'subtitle2',
          title: 'Sample value',
          noWrap: true,
        }}
      />
    </ListItemButton>
  );
};

SuggestionItem.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      sampleValue: PropTypes.string,
    }),
  ).isRequired,
  onSuggestionClick: PropTypes.func.isRequired,
};

export default SuggestionItem;
