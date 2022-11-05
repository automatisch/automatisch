import * as React from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { ListItemButton, Typography } from './style';

type FlowSubstepTitleProps = {
  expanded?: boolean;
  onClick: () => void;
  title: string;
  valid?: boolean | null;
};

const validIcon = <CheckCircleIcon color="success" />;
const errorIcon = <ErrorIcon color="error" />;

function FlowSubstepTitle(props: FlowSubstepTitleProps): React.ReactElement {
  const { expanded = false, onClick = () => null, valid = null, title } = props;

  const hasValidation = valid !== null;
  const validationStatusIcon = valid ? validIcon : errorIcon;

  return (
    <ListItemButton onClick={onClick} selected={expanded} divider>
      <Typography variant="body2">
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        {title}
      </Typography>

      {hasValidation && validationStatusIcon}
    </ListItemButton>
  );
}

export default FlowSubstepTitle;
