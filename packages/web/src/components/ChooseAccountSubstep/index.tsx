import * as React from 'react';
import { useQuery } from '@apollo/client';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import type { App, AppConnection } from 'types/app';
import { GET_APP_CONNECTIONS } from 'graphql/queries/get-app-connections';

type ChooseAccountSubstepProps = {
  appKey: string;
  connectionId: string;
  onChange: (connectionId: string) => void;
};

const optionGenerator = (connection: AppConnection): { label: string; value: string; } => ({
  label: connection?.data?.screenName as string,
  value: connection?.id as string,
});

const getOption = (options: Record<string, unknown>[], connectionId: string) => options.find(connection => connection.value === connectionId) || null;

function ChooseAccountSubstep(props: ChooseAccountSubstepProps): React.ReactElement {
  const { appKey, connectionId, onChange } = props;
  const { data, loading } = useQuery(GET_APP_CONNECTIONS, { variables: { key: appKey }});

  const connectionOptions = React.useMemo(() => (data?.getApp as App)?.connections?.map((connection) => optionGenerator(connection)) || [], [data]);

  const handleChange = React.useCallback((event: React.SyntheticEvent, selectedOption: unknown) => {
    if (typeof selectedOption === 'object') {
      const typedSelectedOption = selectedOption as { value: string };
      const value = typedSelectedOption.value;

      onChange(value);
    }
  }, [onChange]);

  return (
    <Autocomplete
      fullWidth
      disablePortal
      disableClearable
      options={connectionOptions}
      renderInput={(params) => <TextField {...params} label="Choose account" />}
      value={getOption(connectionOptions, connectionId)}
      onChange={handleChange}
      loading={loading}
    />
  );
}

export default ChooseAccountSubstep;
