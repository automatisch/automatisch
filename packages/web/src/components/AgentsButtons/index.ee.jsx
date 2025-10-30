import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import useCurrentUserAbility from 'hooks/useCurrentUserAbility';
import useFormatMessage from 'hooks/useFormatMessage';
import useCreateAgent from 'hooks/useCreateAgent.ee';
import * as URLS from 'config/urls';

export default function AgentsButtons() {
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();
  const currentUserAbility = useCurrentUserAbility();
  const { mutateAsync: createAgent } = useCreateAgent();
  const canManageAgent = currentUserAbility.can('manage', 'Agent');

  async function handleCreatingAgent() {
    const { data: agent } = await createAgent({
      name: formatMessage('agent.untitled'),
    });

    navigate(URLS.AGENT(agent.id));
  }

  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      size="large"
      disabled={!canManageAgent}
      startIcon={<AddIcon />}
      onClick={handleCreatingAgent}
      data-test="create-agent-button"
    >
      {formatMessage('agentsPage.createAgent')}
    </Button>
  );
}
