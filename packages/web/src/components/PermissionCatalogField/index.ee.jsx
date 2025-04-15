import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import * as React from 'react';

import usePermissionCatalog from 'hooks/usePermissionCatalog.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import AllEntitiesPermissions from './AllEntitiesPermissions';
import ConditionField from './OwnEntitiesPermission';
import PermissionCatalogFieldLoader from './PermissionCatalogFieldLoader';

const PermissionCatalogField = ({
  name = 'permissions',
  disabled = false,
  syncIsCreator = false,
  loading = false,
}) => {
  const formatMessage = useFormatMessage();
  const { data, isLoading: isPermissionCatalogLoading } =
    usePermissionCatalog();
  const permissionCatalog = data?.data;

  if (isPermissionCatalogLoading || loading)
    return <PermissionCatalogFieldLoader />;

  return (
    <TableContainer data-test="permissions-catalog" component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell component="th" />

            {permissionCatalog?.actions.map((action) => (
              <React.Fragment key={action.key}>
                <TableCell component="th" key={action.key}>
                  <Typography
                    component="div"
                    variant="subtitle2"
                    align="center"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 700,
                    }}
                  >
                    {action.label}{' '}
                    {formatMessage('permissionCatalogField.ownEntitiesLabel')}
                  </Typography>
                </TableCell>

                <TableCell
                  component="th"
                  key={`${action.key}-isCreator-condition`}
                >
                  <Typography
                    component="div"
                    variant="subtitle2"
                    align="center"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 700,
                    }}
                  >
                    {action.label}{' '}
                    {formatMessage('permissionCatalogField.allEntitiesLabel')}
                  </Typography>
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {permissionCatalog?.subjects.map((subject) => (
            <TableRow
              key={subject.key}
              sx={{ '&:last-child td': { border: 0 } }}
              data-test={`${subject.key}-permission-row`}
            >
              <TableCell scope="row">
                <Typography variant="subtitle2" component="div">
                  {subject.label}
                </Typography>
              </TableCell>

              {permissionCatalog?.actions.map((action) => (
                <React.Fragment key={`${subject.key}.${action.key}`}>
                  <TableCell
                    key={`${subject.key}.${action.key}-isCreator-condition`}
                    align="center"
                  >
                    <Typography variant="subtitle2" component="div">
                      {action.subjects.includes(subject.key) && (
                        <ConditionField
                          action={action}
                          subject={subject}
                          disabled={disabled}
                          name={name}
                        />
                      )}
                      {!action.subjects.includes(subject.key) && '-'}
                    </Typography>
                  </TableCell>

                  <TableCell
                    key={`${subject.key}.${action.key}`}
                    align="center"
                  >
                    <Typography variant="subtitle2" component="div">
                      {action.subjects.includes(subject.key) && (
                        <AllEntitiesPermissions
                          action={action}
                          subject={subject}
                          disabled={disabled}
                          name={name}
                          syncIsCreator={syncIsCreator}
                        />
                      )}
                      {!action.subjects.includes(subject.key) && '-'}
                    </Typography>
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

PermissionCatalogField.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  syncIsCreator: PropTypes.bool,
  loading: PropTypes.bool,
};

export default PermissionCatalogField;
