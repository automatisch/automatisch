import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton from '@mui/material/IconButton';

import { DateTime } from 'luxon';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import FormContextMenu from 'components/FormContextMenu/index.ee';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import { CardContent, ContextMenu, Title, Typography } from './style';
import { FormPropType } from 'propTypes/propTypes';

function FormRow(props) {
  const contextButtonRef = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const formatMessage = useFormatMessage();
  const { form } = props;

  const createdAt = DateTime.fromMillis(parseInt(form.createdAt, 10));
  const updatedAt = DateTime.fromMillis(parseInt(form.updatedAt, 10));
  const isUpdated = updatedAt > createdAt;
  const relativeCreatedAt = createdAt.toRelative();
  const relativeUpdatedAt = updatedAt.toRelative();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onContextMenuClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    setAnchorEl(contextButtonRef.current);
  };

  return (
    <>
      <Card sx={{ mb: 1 }} data-test="form-row">
        <CardActionArea
          component={Link}
          to={URLS.EDIT_FORM(form.id)}
          data-test="card-action-area"
          state={{
            from: `${location.pathname}${location.search}${location.hash}`,
          }}
        >
          <CardContent>
            <Title
              justifyContent="center"
              alignItems="flex-start"
              spacing={1}
              sx={{ gridArea: 'title' }}
            >
              <Typography variant="h6" noWrap>
                {form?.name}
              </Typography>

              <Typography variant="caption">
                {isUpdated &&
                  formatMessage('flow.updatedAt', {
                    datetime: relativeUpdatedAt,
                  })}

                {!isUpdated &&
                  formatMessage('flow.createdAt', {
                    datetime: relativeCreatedAt,
                  })}
              </Typography>
            </Title>

            <ContextMenu>
              <IconButton
                size="large"
                color="inherit"
                aria-label="open context menu"
                ref={contextButtonRef}
                onClick={onContextMenuClick}
              >
                <MoreHorizIcon />
              </IconButton>
            </ContextMenu>
          </CardContent>
        </CardActionArea>
      </Card>
      {anchorEl && (
        <FormContextMenu
          formId={form.id}
          onClose={handleClose}
          anchorEl={anchorEl}
        />
      )}
    </>
  );
}

FormRow.propTypes = {
  form: FormPropType.isRequired,
};

export default FormRow;
