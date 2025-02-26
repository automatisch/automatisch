import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import { DateTime } from 'luxon';

import FlowAppIcons from 'components/FlowAppIcons';
import FlowContextMenu from 'components/FlowContextMenu';
import useFormatMessage from 'hooks/useFormatMessage';
import * as URLS from 'config/urls';
import { Apps, CardContent, Title, Typography } from './style';
import { FlowPropType } from 'propTypes/propTypes';

function TemplateItem(props) {
  const formatMessage = useFormatMessage();
  const { template, to, appKey } = props;

  return (
    <>
      <Card sx={{ mb: 1 }} data-test="template-row">
        <CardActionArea component={Link} to={to} data-test="card-action-area">
          <CardContent>
            {/* <Apps direction="row" gap={1} sx={{ gridArea: 'apps' }}>
              <FlowAppIcons steps={template.steps} />
            </Apps> */}

            <Title
              justifyContent="center"
              alignItems="flex-start"
              spacing={1}
              sx={{ gridArea: 'title' }}
            >
              <Typography variant="h6" noWrap>
                {template?.name}
              </Typography>

              <Typography variant="subtitle2" noWrap>
                {template?.flowData.steps.map((x) => x.appKey).join(' - ')}
              </Typography>
            </Title>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}

TemplateItem.propTypes = {
  template: FlowPropType.isRequired,
  onDuplicateFlow: PropTypes.func,
  appKey: PropTypes.string,
};

export default TemplateItem;
