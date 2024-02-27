import { Can as OriginalCan } from '@casl/react';
import * as React from 'react';
import useCurrentUserAbility from 'hooks/useCurrentUserAbility';
export default function Can(props) {
  const currentUserAbility = useCurrentUserAbility();
  return <OriginalCan ability={currentUserAbility} {...props} />;
}
