import PropTypes from 'prop-types';
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useFormContext, useWatch } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import useFormatMessage from 'hooks/useFormatMessage';
import InputCreator from 'components/InputCreator';
import { EditorContext } from 'contexts/Editor';

const createGroupItem = () => ({
  key: '',
  operator: operators[0].value,
  value: '',
  id: uuidv4(),
});

const createGroup = () => ({
  and: [createGroupItem()],
});

const operators = [
  {
    label: 'Equal',
    value: 'equal',
  },
  {
    label: 'Not Equal',
    value: 'not_equal',
  },
  {
    label: 'Greater Than',
    value: 'greater_than',
  },
  {
    label: 'Less Than',
    value: 'less_than',
  },
  {
    label: 'Greater Than Or Equal',
    value: 'greater_than_or_equal',
  },
  {
    label: 'Less Than Or Equal',
    value: 'less_than_or_equal',
  },
  {
    label: 'Contains',
    value: 'contains',
  },
  {
    label: 'Not Contains',
    value: 'not_contains',
  },
];

const createStringArgument = (argumentOptions) => {
  return {
    ...argumentOptions,
    type: 'string',
    required: true,
    variables: true,
  };
};

const createDropdownArgument = (argumentOptions) => {
  return {
    ...argumentOptions,
    required: true,
    type: 'dropdown',
  };
};

function FilterConditions(props) {
  const { stepId } = props;
  const formatMessage = useFormatMessage();
  const { control, setValue, getValues } = useFormContext();
  const groups = useWatch({ control, name: 'parameters.or' });
  const editorContext = React.useContext(EditorContext);

  React.useEffect(function addInitialGroupWhenEmpty() {
    const groups = getValues('parameters.or');

    if (!groups) {
      setValue('parameters.or', [createGroup()]);
    }
  }, []);

  const appendGroup = React.useCallback(() => {
    const values = getValues('parameters.or');
    setValue('parameters.or', values.concat(createGroup()));
  }, []);

  const appendGroupItem = React.useCallback((index) => {
    const group = getValues(`parameters.or.${index}.and`);
    setValue(`parameters.or.${index}.and`, group.concat(createGroupItem()));
  }, []);

  const removeGroupItem = React.useCallback((groupIndex, groupItemIndex) => {
    const group = getValues(`parameters.or.${groupIndex}.and`);

    if (group.length === 1) {
      const groups = getValues('parameters.or');
      setValue(
        'parameters.or',
        groups.filter((group, index) => index !== groupIndex),
      );
    } else {
      setValue(
        `parameters.or.${groupIndex}.and`,
        group.filter((groupItem, index) => index !== groupItemIndex),
      );
    }
  }, []);

  return (
    <React.Fragment>
      <Stack sx={{ width: '100%' }} direction="column" spacing={2} mt={2}>
        {groups?.map((group, groupIndex) => (
          <>
            {groupIndex !== 0 && <Divider />}

            <Typography variant="subtitle2" gutterBottom>
              {groupIndex === 0 &&
                formatMessage('filterConditions.onlyContinueIf')}
              {groupIndex !== 0 &&
                formatMessage('filterConditions.orContinueIf')}
            </Typography>

            {group?.and?.map((groupItem, groupItemIndex) => (
              <Stack direction="row" spacing={2} key={`item-${groupItem.id}`}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 2 }}
                  sx={{ display: 'flex', flex: 1 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flex: '1 0 0px',
                      maxWidth: ['100%', '33%'],
                    }}
                  >
                    <InputCreator
                      schema={createStringArgument({
                        key: `or.${groupIndex}.and.${groupItemIndex}.key`,
                        label: 'Choose field',
                      })}
                      namePrefix="parameters"
                      stepId={stepId}
                      disabled={editorContext.readOnly}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flex: '1 0 0px',
                      maxWidth: ['100%', '33%'],
                    }}
                  >
                    <InputCreator
                      schema={createDropdownArgument({
                        key: `or.${groupIndex}.and.${groupItemIndex}.operator`,
                        options: operators,
                        label: 'Choose condition',
                      })}
                      namePrefix="parameters"
                      stepId={stepId}
                      disabled={editorContext.readOnly}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flex: '1 0 0px',
                      maxWidth: ['100%', '33%'],
                    }}
                  >
                    <InputCreator
                      schema={createStringArgument({
                        key: `or.${groupIndex}.and.${groupItemIndex}.value`,
                        label: 'Enter text',
                      })}
                      namePrefix="parameters"
                      stepId={stepId}
                      disabled={editorContext.readOnly}
                    />
                  </Box>
                </Stack>

                <IconButton
                  size="small"
                  edge="start"
                  onClick={() => removeGroupItem(groupIndex, groupItemIndex)}
                  sx={{ width: 61, height: 61 }}
                >
                  <RemoveIcon />
                </IconButton>
              </Stack>
            ))}

            <Stack spacing={1} direction="row">
              <IconButton
                size="small"
                edge="start"
                sx={{ width: 61, height: 61 }}
                onClick={() => appendGroupItem(groupIndex)}
              >
                <AddIcon /> And
              </IconButton>

              {groups.length - 1 === groupIndex && (
                <IconButton
                  size="small"
                  edge="start"
                  onClick={appendGroup}
                  sx={{ width: 61, height: 61 }}
                >
                  <AddIcon /> Or
                </IconButton>
              )}
            </Stack>
          </>
        ))}
      </Stack>
    </React.Fragment>
  );
}

FilterConditions.propTypes = {
  stepId: PropTypes.string.isRequired,
};

export default FilterConditions;
