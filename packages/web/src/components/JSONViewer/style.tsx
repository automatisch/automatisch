import GlobalStyles from '@mui/material/GlobalStyles';

export const jsonViewerStyles = (
  <GlobalStyles
    styles={(theme) => ({
      'json-viewer': {
        '--background-color': 'transparent',
        '--font-family': 'monaco, Consolas, Lucida Console, monospace',
        '--font-size': '1rem',
        '--indent-size': '1.5em',
        '--indentguide-size': '1px',
        '--indentguide-style': 'solid',
        '--indentguide-color': theme.palette.text.primary,
        '--indentguide-color-active': '#666',
        '--indentguide':
          'var(--indentguide-size) var(--indentguide-style) var(--indentguide-color)',
        '--indentguide-active':
          'var(--indentguide-size) var(--indentguide-style) var(--indentguide-color-active)',

        /* Types colors */
        '--string-color': theme.palette.text.secondary,
        '--number-color': theme.palette.text.primary,
        '--boolean-color': theme.palette.text.primary,
        '--null-color': theme.palette.text.primary,
        '--property-color': theme.palette.text.primary,

        /* Collapsed node preview */
        '--preview-color': theme.palette.text.primary,

        /* Search highlight color */
        '--highlight-color': '#6fb3d2',
      },
    })}
  />
);
