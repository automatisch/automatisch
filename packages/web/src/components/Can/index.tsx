import { Can as OriginalCan } from '@casl/react';
import * as React from 'react';

import useCurrentUserAbility from 'hooks/useCurrentUserAbility';

type CanProps = {
  I: string;
  a: string;
  passThrough?: boolean;
  children: React.ReactNode | ((isAllowed: boolean) => React.ReactNode);
} | {
  I: string;
  an: string;
  passThrough?: boolean;
  children: React.ReactNode | ((isAllowed: boolean) => React.ReactNode);
};

export default function Can(props: CanProps) {
  const currentUserAbility = useCurrentUserAbility();

  return (<OriginalCan ability={currentUserAbility} {...props} />);
};
