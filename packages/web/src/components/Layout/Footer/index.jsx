import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import useAutomatischConfig from 'hooks/useAutomatischConfig';
import useFormatMessage from 'hooks/useFormatMessage';

const LogoImage = styled('img')(() => ({
  maxWidth: 'auto',
  height: 22,
}));

const LayoutFooter = () => {
  const { data: config } = useAutomatischConfig();
  const formatMessage = useFormatMessage();

  if (config?.data.enableFooter !== true) return null;

  const links = [
    {
      key: 'docs',
      show: !!config.data.footerDocsUrl,
      href: config.data.footerDocsUrl,
      text: formatMessage('footer.docsLinkText'),
    },
    {
      key: 'terms-of-services',
      show: !!config.data.footerTosUrl,
      href: config.data.footerTosUrl,
      text: formatMessage('footer.tosLinkText'),
    },
    {
      key: 'privacy-policy',
      show: !!config.data.footerPrivacyPolicyUrl,
      href: config.data.footerPrivacyPolicyUrl,
      text: formatMessage('footer.privacyPolicyLinkText'),
    },
    {
      key: 'imprint',
      show: !!config.data.footerImprintUrl,
      href: config.data.footerImprintUrl,
      text: formatMessage('footer.imprintLinkText'),
    },
  ];

  return (
    <Box mt="auto" position="sticky" bottom={0}>
      <Box bgcolor="common.white" mt={4}>
        <Divider />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            bgcolor: (theme) => theme.palette.footer.main,
            color: (theme) => theme.palette.footer.text,
          }}
        >
          <div>
            {config.data.footerLogoSvgData && (
              <>
                <LogoImage
                  data-test="footer-logo"
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(config.data.footerLogoSvgData)}`}
                />
              </>
            )}
          </div>

          <div>
            {config.data.footerCopyrightText && (
              <Typography
                variant="body1"
                sx={{ flexGrow: 1, textAlign: 'center' }}
              >
                {config.data.footerCopyrightText}
              </Typography>
            )}
          </div>

          <Box
            sx={{
              display: 'flex',
              gap: '15px',
              flexWrap: { xs: 'wrap', sm: 'unset' },
              justifyContent: 'center',
            }}
          >
            {links
              .filter((link) => link.show)
              .map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  color="inherit"
                  variant="body1"
                  target="_blank"
                  rel="noreferrer noopener"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {link.text}
                </Link>
              ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LayoutFooter;
