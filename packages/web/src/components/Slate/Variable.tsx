import Chip from '@mui/material/Chip';
import { useSelected, useFocused } from 'slate-react';

export default function Variable({ attributes, children, element, disabled }: any) {
  const selected = useSelected();
  const focused = useFocused();
  const label = (
    <>
      <span style={{ fontWeight: 500 }}>{element.name}</span>: <span style={{ fontWeight: 300 }}>{element.sampleValue}</span>
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
};

