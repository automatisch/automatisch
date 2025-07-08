import PropTypes from 'prop-types';
import NoResultFound from 'components/NotFound';
import useIsCurrentUserAdmin from 'hooks/useIsCurrentUserAdmin';

function AdminGuard(props) {
  const isCurrentUserAdmin = useIsCurrentUserAdmin();

  if (isCurrentUserAdmin === false) {
    return <NoResultFound />;
  }

  if (isCurrentUserAdmin === undefined) {
    // If the data is still loading, we can return null or a loading indicator.
    return null;
  }

  // If the user is an admin, we render the children components.
  return props.children;
}

AdminGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminGuard;
