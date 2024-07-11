import PropTypes from 'prop-types';
import Variable from './Variable';

export default function Element(props) {
  const { attributes, children, element, disabled } = props;

  switch (element.type) {
    case 'variable':
      return <Variable {...props} disabled={disabled} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
}

Element.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  element: PropTypes.shape({
    type: PropTypes.string,
  }),
  disabled: PropTypes.bool,
};
