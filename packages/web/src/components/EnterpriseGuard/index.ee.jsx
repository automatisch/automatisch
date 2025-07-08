import PropTypes from 'prop-types';
import NoResultFound from 'components/NotFound';
import useIsCurrentUserEnterpriseAdmin from 'hooks/useIsCurrentUserEnterpriseAdmin';

function EnterpriseGuard(props) {
  const isCurrentUserEnterpriseAdmin = useIsCurrentUserEnterpriseAdmin();

  if (isCurrentUserEnterpriseAdmin === false) {
    return <NoResultFound />;
  }

  if (isCurrentUserEnterpriseAdmin === undefined) {
    // If the data is still loading, we can return null or a loading indicator.
    return null;
  }

  // If the user is an enterprise admin, we render the children components.
  return props.children;
}

EnterpriseGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default EnterpriseGuard;
