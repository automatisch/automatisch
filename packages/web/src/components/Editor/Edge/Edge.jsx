import PropTypes from 'prop-types';
import { DIMENSIONS } from '../constants';

export default function Edge({ sourceX, sourceY, targetX, targetY }) {
  // Check if nodes are vertically aligned
  const isVerticallyAligned = Math.abs(sourceX - targetX) < 1;

  // Use straight line for vertical connections, stepped path for horizontal offset
  const path = isVerticallyAligned
    ? `M ${sourceX} ${sourceY} L ${sourceX} ${targetY}` // Straight vertical line
    : `M ${sourceX} ${sourceY} L ${sourceX} ${targetY - DIMENSIONS.EDGE_STEP_OFFSET} L ${targetX} ${targetY - DIMENSIONS.EDGE_STEP_OFFSET} L ${targetX} ${targetY}`; // Stepped path

  return (
    <path
      d={path}
      fill="none"
      stroke="#b1b1b7"
      strokeWidth={DIMENSIONS.EDGE_STROKE_WIDTH}
      className="react-flow__edge-path"
    />
  );
}

Edge.propTypes = {
  sourceX: PropTypes.number.isRequired,
  sourceY: PropTypes.number.isRequired,
  targetX: PropTypes.number.isRequired,
  targetY: PropTypes.number.isRequired,
};
