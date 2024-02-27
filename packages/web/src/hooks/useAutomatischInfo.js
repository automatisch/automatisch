import * as React from 'react';
import { AutomatischInfoContext } from 'contexts/AutomatischInfo';
export default function useAutomatischInfo() {
  const automatischInfoContext = React.useContext(AutomatischInfoContext);
  return {
    isCloud: automatischInfoContext.isCloud,
    isMation: automatischInfoContext.isMation,
    loading: automatischInfoContext.loading,
  };
}
