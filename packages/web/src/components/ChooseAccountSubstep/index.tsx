import * as React from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import Autocomplete from '@mui/material/Autocomplete';

import FlowSubstepTitle from 'components/FlowSubstepTitle';
import type { IApp, IConnection, IStep, ISubstep, IJSONObject } from '@automatisch/types';
import { GET_APP_CONNECTIONS } from 'graphql/queries/get-app-connections';
import { TEST_CONNECTION } from 'graphql/queries/test-connection';

type ChooseAccountSubstepProps = {
  substep: ISubstep,
  expanded?: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onChange: ({ step }: { step: IStep }) => void;
  onSubmit: () => void;
  step: IStep;
};

const optionGenerator = (connection: IConnection): { label: string; value: string; } => ({
  label: connection?.formattedData?.screenName as string ?? 'Unnamed',
  value: connection?.id as string,
});

const getOption = (options: Record<string, unknown>[], connectionId?: string) => options.find(connection => connection.value === connectionId) || null;

function ChooseAccountSubstep(props: ChooseAccountSubstepProps): React.ReactElement {
  const {
    substep,
    expanded = false,
    onExpand,
    onCollapse,
    step,
    onSubmit,
    onChange,
  } = props;
  const {
    connection,
    appKey,
  } = step;
  const { data, loading } = useQuery(GET_APP_CONNECTIONS, { variables: { key: appKey }});
  // TODO: show detailed error when connection test/verification fails
  const [
    testConnection,
    {
      loading: testResultLoading,
      refetch: retestConnection
    }
  ] = useLazyQuery (TEST_CONNECTION, { variables: { id: connection?.id, }});

  React.useEffect(() => {
    if (connection?.id) {
      testConnection({
        variables: { id: connection?.id },
      });
    }
    // intentionally no dependencies for initial test
  }, []);

  const connectionOptions = React.useMemo(() => (data?.getApp as IApp)?.connections?.map((connection) => optionGenerator(connection)) || [], [data]);

  const { name } = substep;

  const handleChange = React.useCallback((event: React.SyntheticEvent, selectedOption: unknown) => {
    if (typeof selectedOption === 'object') {
      // TODO: try to simplify type casting below.
      const typedSelectedOption = selectedOption as { value: string };
      const option: { value: string } = typedSelectedOption;
      const connectionId = option?.value as string;

      if (connectionId !== step.connection?.id) {
        onChange({
          step: {
            ...step,
            connection: {
              id: connectionId,
            },
          },
        });
      }
    }
  }, [step, onChange]);

  React.useEffect(() => {
    if (step.connection?.id) {
      retestConnection({
        id: step.connection.id,
      });
    }
  }, [step.connection?.id, retestConnection])

  const onToggle = expanded ? onCollapse : onExpand;

  return (
    <React.Fragment>
      <FlowSubstepTitle
        expanded={expanded}
        onClick={onToggle}
        title={name}
        valid={testResultLoading ? null : connection?.verified}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <ListItem sx={{ pt: 2, pb: 3, flexDirection: 'column', alignItems: 'flex-start' }}>
          <Autocomplete
            fullWidth
            disablePortal
            disableClearable
            options={connectionOptions}
            renderInput={(params) => <TextField {...params} label="Choose account" />}
            value={getOption(connectionOptions, connection?.id)}
            onChange={handleChange}
            loading={loading}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={onSubmit}
            sx={{ mt: 2 }}
            disabled={testResultLoading || !connection?.verified}
          >
            Continue
          </Button>
        </ListItem>
      </Collapse>
    </React.Fragment>
  );
}

export default ChooseAccountSubstep;
