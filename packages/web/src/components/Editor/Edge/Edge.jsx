import PropTypes from 'prop-types';

export default function Edge({ sourceX, sourceY, targetX, targetY }) {
  // Check if nodes are vertically aligned
  const isVerticallyAligned = Math.abs(sourceX - targetX) < 1;

  // Use straight line for vertical connections, stepped path for horizontal offset
  const path = isVerticallyAligned
    ? `M ${sourceX} ${sourceY} L ${sourceX} ${targetY}` // Straight vertical line
    : `M ${sourceX} ${sourceY} L ${sourceX} ${targetY - 20} L ${targetX} ${targetY - 20} L ${targetX} ${targetY}`; // Stepped path

  return (
    <path
      d={path}
      fill="none"
      stroke="#b1b1b7"
      strokeWidth={2}
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
