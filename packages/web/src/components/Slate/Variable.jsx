import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import { useSelected, useFocused } from 'slate-react';

function Variable({ attributes, children, element, disabled }) {
  const selected = useSelected();
  const focused = useFocused();
  const label = (
    <>
      <span style={{ fontWeight: 500 }}>{element.name}</span>:{' '}
      <span style={{ fontWeight: 300 }}>{element.sampleValue}</span>
      {children}
    </>
  );
  return (
    <Chip
      {...attributes}
      disabled={disabled}
      component="span"
      contentEditable={false}
      style={{
        boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
      }}
      size="small"
      label={label}
    />
  );
}

Variable.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  element: PropTypes.shape({
    name: PropTypes.string.isRequired,
    sampleValue: PropTypes.string.isRequired,
  }),
  disabled: PropTypes.bool,
};

export default Variable;
