import * as React from 'react';
import { AutomatischInfoContext } from 'contexts/AutomatischInfo';

type UseAutomatischInfoReturn = {
  isCloud: boolean;
};

export default function useAutomatischInfo(): UseAutomatischInfoReturn {
  const automatischInfoContext = React.useContext(AutomatischInfoContext);

  return {
    isCloud: automatischInfoContext.isCloud,
  };
}
