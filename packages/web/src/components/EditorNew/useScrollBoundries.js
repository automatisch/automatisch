import { useEffect } from 'react';
import { useViewport, useReactFlow } from 'reactflow';

export const useScrollBoundries = () => {
  const { setViewport } = useReactFlow();
  const { x, y, zoom } = useViewport();

  useEffect(() => {
    if (y > 0) {
      setViewport({ x, y: 0, zoom });
    }
  }, [y]);
};
