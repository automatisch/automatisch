import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import useFormatMessage from 'hooks/useFormatMessage';
import useVersion from 'hooks/useVersion';

const AdminSettingsLayoutFooter = () => {
  const version = useVersion();
  const formatMessage = useFormatMessage();

  return (
    typeof version?.version === 'string' && (
      <Box mt="auto" position="sticky" bottom={0} zIndex={99}>
        <Box bgcolor="common.white" mt={4}>
          <Divider />
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
            px={3}
            py={2}
            align="right"
          >
            {formatMessage('adminSettingsFooter.version', {
              version: version.version,
            })}
          </Typography>
        </Box>
      </Box>
    )
  );
};

export default AdminSettingsLayoutFooter;
