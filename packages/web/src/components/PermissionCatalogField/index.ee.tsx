import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import ControlledCheckbox from 'components/ControlledCheckbox';
import usePermissionCatalog from 'hooks/usePermissionCatalog.ee';
import PermissionSettings from './PermissionSettings.ee';
import PermissionCatalogFieldLoader from './PermissionCatalogFieldLoader';

type PermissionCatalogFieldProps = {
  name?: string;
  disabled?: boolean;
  defaultChecked?: boolean;
};

const PermissionCatalogField = ({
  name = 'permissions',
  disabled = false,
  defaultChecked = false,
}: PermissionCatalogFieldProps) => {
  const { permissionCatalog, loading } = usePermissionCatalog();
  const [dialogName, setDialogName] = React.useState<string>();

  if (loading) return <PermissionCatalogFieldLoader />;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell component="th" />

            {permissionCatalog.actions.map((action) => (
              <TableCell component="th" key={action.key}>
                <Typography
                  variant="subtitle1"
                  align="center"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 700,
                  }}
                >
                  {action.label}
                </Typography>
              </TableCell>
            ))}

            <TableCell component="th" />
          </TableRow>
        </TableHead>
        <TableBody>
          {permissionCatalog.subjects.map((subject) => (
            <TableRow
              key={subject.key}
              sx={{ '&:last-child td': { border: 0 } }}
              data-test={`${subject.key}-permission-row`}
            >
              <TableCell scope="row">
                <Typography variant="subtitle2">{subject.label}</Typography>
              </TableCell>

              {permissionCatalog.actions.map((action) => (
                <TableCell key={`${subject.key}.${action.key}`} align="center">
                  <Typography variant="subtitle2">
                    {action.subjects.includes(subject.key) && (
                      <ControlledCheckbox
                        disabled={disabled}
                        name={`${name}.${subject.key}.${action.key}.value`}
                        dataTest={`${action.key.toLowerCase()}-checkbox`}
                      />
                    )}

                    {!action.subjects.includes(subject.key) && '-'}
                  </Typography>
                </TableCell>
              ))}

              <TableCell>
                <Stack direction="row" gap={1} justifyContent="right">
                  <IconButton
                    color="info"
                    size="small"
                    onClick={() => setDialogName(subject.key)}
                    disabled={disabled}
                    data-test="permission-settings-button"
                  >
                    <SettingsIcon />
                  </IconButton>

                  <PermissionSettings
                    open={dialogName === subject.key}
                    onClose={() => setDialogName('')}
                    fieldPrefix={`${name}.${subject.key}`}
                    subject={subject.key}
                    actions={permissionCatalog.actions}
                    conditions={permissionCatalog.conditions}
                    defaultChecked={defaultChecked}
                  />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PermissionCatalogField;
