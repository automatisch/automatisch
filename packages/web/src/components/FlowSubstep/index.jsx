import PropTypes from 'prop-types';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { EditorContext } from 'contexts/Editor';
import FlowSubstepTitle from 'components/FlowSubstepTitle';
import InputCreator from 'components/InputCreator';
import FilterConditions from './FilterConditions';
import { StepPropType, SubstepPropType } from 'propTypes/propTypes';
import appConfig from 'config/app.js';

const useNewFlowEditor = appConfig.useNewFlowEditor;

function FlowSubstep(props) {
  const {
    substep,
    expanded = false,
    onExpand,
    onCollapse,
    onSubmit,
    step,
    flowId,
  } = props;
  const { name, arguments: args } = substep;
  const editorContext = React.useContext(EditorContext);
  const formContext = useFormContext();
  const validationStatus = formContext.formState.isValid;
  const onToggle = expanded ? onCollapse : onExpand;

  return (
    <React.Fragment>
      <FlowSubstepTitle
        expanded={expanded}
        onClick={onToggle}
        title={name}
        valid={validationStatus}
      />
      <Collapse
        in={expanded}
        timeout={useNewFlowEditor ? 0 : 'auto'}
        unmountOnExit
      >
        <ListItem
          sx={{
            pt: 2,
            pb: 3,
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative',
          }}
        >
          {step.appKey === 'forms' && (
            <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
              You may preview the form at{' '}
              <a
                href={new URL(`/forms/${flowId}`, window.location.href).href}
                target="_blank"
                rel="noreferrer"
              >
                {new URL(`/forms/${flowId}`, window.location.href).href}
              </a>
              .
            </Alert>
          )}
          {!!args?.length && (
            <Stack width="100%" spacing={2}>
              {args.map((argument) => (
                <InputCreator
                  key={argument.key}
                  schema={argument}
                  namePrefix="parameters"
                  stepId={step.id}
                  disabled={editorContext.readOnly}
                  showOptionValue={true}
                />
              ))}
            </Stack>
          )}

          {step.appKey === 'filter' && <FilterConditions stepId={step.id} />}

          <Button
            fullWidth
            variant="contained"
            onClick={onSubmit}
            sx={{ mt: 2 }}
            disabled={!validationStatus || editorContext.readOnly}
            type="submit"
            data-test="flow-substep-continue-button"
          >
            Continue
          </Button>
        </ListItem>
      </Collapse>
    </React.Fragment>
  );
}

FlowSubstep.propTypes = {
  substep: SubstepPropType.isRequired,
  expanded: PropTypes.bool,
  onExpand: PropTypes.func.isRequired,
  onCollapse: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  step: StepPropType.isRequired,
  flowId: PropTypes.string.isRequired,
};

export default FlowSubstep;
