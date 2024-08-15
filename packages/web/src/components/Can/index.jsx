import PropTypes from 'prop-types';
import { Can as OriginalCan } from '@casl/react';
import useCurrentUserAbility from 'hooks/useCurrentUserAbility';

function Can(props) {
  const currentUserAbility = useCurrentUserAbility();
  return <OriginalCan ability={currentUserAbility} {...props} />;
}

Can.propTypes = {
  I: PropTypes.string.isRequired,
  a: PropTypes.string,
  an: PropTypes.string,
  passThrough: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

export default Can;
