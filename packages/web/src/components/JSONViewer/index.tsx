import * as React from 'react';
import '@alenaksu/json-viewer';

import type { IJSONObject } from '@automatisch/types';
import { jsonViewerStyles } from './style';

type JSONViewerProps = {
  data: IJSONObject;
}
function JSONViewer(props: JSONViewerProps) {
  const { data } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewerRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (viewerRef.current){
      viewerRef.current.data = data;
    }
  }, [data]);

  return (
    <div>
      {jsonViewerStyles}

      <json-viewer ref={viewerRef} />
    </div>
  );
}


export default JSONViewer;
