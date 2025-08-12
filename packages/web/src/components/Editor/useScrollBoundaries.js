import { useEffect, useState } from 'react';
import { useViewport, useReactFlow, useNodes } from '@xyflow/react';
import { DIMENSIONS } from './constants';

export const useScrollBoundaries = (containerHeight) => {
  const { setViewport } = useReactFlow();
  const { x, y, zoom } = useViewport();
  const nodes = useNodes();
  const [maxYScroll, setMaxYScroll] = useState(null);

  useEffect(
    function updateViewportPosition() {
      if (y > 0) {
        setViewport({ x, y: 0, zoom });
      } else if (typeof maxYScroll === 'number' && y < maxYScroll) {
        setViewport({ x, y: maxYScroll, zoom });
      }
    },
    [y, maxYScroll],
  );

  useEffect(
    function updateMaxYScroll() {
      if (nodes?.length && containerHeight) {
        const maxY =
          containerHeight -
          nodes[nodes.length - 1].position.y -
          DIMENSIONS.SCROLL_Y_MARGIN;
        setMaxYScroll(maxY >= 0 ? 0 : maxY);
      }
    },
    [nodes, containerHeight],
  );
};
