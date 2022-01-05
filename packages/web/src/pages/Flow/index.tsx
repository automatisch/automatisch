import * as React from 'react';
import { useQuery } from '@apollo/client';
import { Link, Route, Navigate, Routes, useParams, useMatch, useNavigate } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddIcon from '@mui/icons-material/Add';

import useFormatMessage from 'hooks/useFormatMessage';
import { GET_APP } from 'graphql/queries/get-app';
import * as URLS from 'config/urls';

import ConditionalIconButton from 'components/ConditionalIconButton';
import AppConnections from 'components/AppConnections';
import AppFlows from 'components/AppFlows';
import AddAppConnection from 'components/AddAppConnection';
import AppIcon from 'components/AppIcon';
import Container from 'components/Container';
import PageTitle from 'components/PageTitle';

type ApplicationParams = {
  flowId: string;
};

export default function Flow() {
  const { flowId } = useParams() as ApplicationParams;

  return (
    <>
      <Box sx={{ py: 3 }}>
        <Container>
          <Grid container>
            <Grid item xs>
              {flowId}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
