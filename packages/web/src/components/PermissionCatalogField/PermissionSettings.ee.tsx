import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { IPermissionCatalog } from '@automatisch/types';
import ControlledCheckbox from 'components/ControlledCheckbox';
import useFormatMessage from 'hooks/useFormatMessage';

type PermissionSettingsProps = {
  onClose: () => void;
  fieldPrefix: string;
  subject: string;
  actions: IPermissionCatalog['actions'];
  conditions: IPermissionCatalog['conditions'];
}

export default function PermissionSettings(props: PermissionSettingsProps) {
  const {
    onClose,
    fieldPrefix,
    subject,
    actions,
    conditions,
  } = props;

  const formatMessage = useFormatMessage();
  const { getValues, resetField } = useFormContext();

  const cancel = () => {
    for (const action of actions) {
      for (const condition of conditions) {
        const fieldName = `${fieldPrefix}.${action.key}.conditions.${condition.key}`;
        resetField(fieldName);
      }
    }

    onClose();
  }

  const apply = () => {
    for (const action of actions) {
      for (const condition of conditions) {
        const fieldName = `${fieldPrefix}.${action.key}.conditions.${condition.key}`;
        const value = getValues(fieldName);
        resetField(fieldName, { defaultValue: value });
      }
    }

    onClose();
  }

  return (
    <Dialog open onClose={cancel}>
      <DialogTitle>
        {formatMessage('permissionSettings.title')}
      </DialogTitle>

      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th" />

                {actions.map(action => (
                  <TableCell component="th" key={action.key}>
                    <Typography
                      variant="subtitle1"
                      align="center"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 700
                      }}
                    >
                      {action.label}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {conditions.map((condition) => (
                <TableRow
                  key={condition.key}
                  sx={{ '&:last-child td': { border: 0 } }}
                >
                  <TableCell scope="row">
                    <Typography
                      variant="subtitle2"
                    >
                      {condition.label}
                    </Typography>
                  </TableCell>

                  {actions.map((action) => (
                    <TableCell
                      key={`${action.key}.${condition.key}`}
                      align="center"
                    >
                      <Typography
                        variant="subtitle2"
                      >
                        {action.subjects.includes(subject) && (
                          <ControlledCheckbox
                            name={`${fieldPrefix}.${action.key}.conditions.${condition.key}`}
                            disabled={getValues(`${fieldPrefix}.${action.key}.value`) !== true}
                          />
                        )}

                        {!action.subjects.includes(subject) && '-'}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions>
        <Button onClick={cancel}>{formatMessage('permissionSettings.cancel')}</Button>

        <Button onClick={apply} color="error">
          {formatMessage('permissionSettings.apply')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}