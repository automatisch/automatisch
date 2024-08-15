import PropTypes from 'prop-types';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { createEditor } from 'slate';
import { Editable } from 'slate-react';
import Slate from 'components/Slate';
import Element from 'components/Slate/Element';
import {
  customizeEditor,
  deserialize,
  insertVariable,
  serialize,
} from 'components/Slate/utils';
import { StepExecutionsContext } from 'contexts/StepExecutions';
import Popper from './Popper';
import { processStepWithExecutions } from './data';
import { ChildrenWrapper, FakeInput, InputLabelWrapper } from './style';

const PowerInput = (props) => {
  const { control } = useFormContext();
  const {
    defaultValue = '',
    onBlur,
    name,
    label,
    required,
    description,
    disabled,
    shouldUnregister,
  } = props;
  const priorStepsWithExecutions = React.useContext(StepExecutionsContext);
  const editorRef = React.useRef(null);

  const renderElement = React.useCallback(
    (props) => <Element {...props} />,
    [],
  );

  const [editor] = React.useState(() => customizeEditor(createEditor()));

  const [showVariableSuggestions, setShowVariableSuggestions] =
    React.useState(false);

  const disappearSuggestionsOnShift = (event) => {
    if (event.code === 'Tab') {
      setShowVariableSuggestions(false);
    }
  };

  const stepsWithVariables = React.useMemo(() => {
    return processStepWithExecutions(priorStepsWithExecutions);
  }, [priorStepsWithExecutions]);

  const handleBlur = React.useCallback(
    (value) => {
      onBlur?.(value);
    },
    [onBlur],
  );

  const handleVariableSuggestionClick = React.useCallback(
    (variable) => {
      insertVariable(editor, variable, stepsWithVariables);
    },
    [stepsWithVariables],
  );

  return (
    <Controller
      rules={{ required }}
      name={name}
      control={control}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister ?? false}
      render={({
        field: {
          value,
          onChange: controllerOnChange,
          onBlur: controllerOnBlur,
        },
      }) => (
        <Slate
          editor={editor}
          value={deserialize(value, [], stepsWithVariables)}
          onChange={(value) => {
            controllerOnChange(serialize(value));
          }}
        >
          <ClickAwayListener
            mouseEvent="onMouseDown"
            onClickAway={() => {
              setShowVariableSuggestions(false);
            }}
          >
            {/* ref-able single child for ClickAwayListener */}
            <ChildrenWrapper
              style={{ width: '100%' }}
              data-test={`${name}-power-input`}
            >
              <FakeInput disabled={disabled}>
                <InputLabelWrapper>
                  <InputLabel
                    shrink={true}
                    disabled={disabled}
                    variant="outlined"
                    sx={{ bgcolor: 'white', display: 'inline-block', px: 0.75 }}
                  >
                    {`${label}${required ? ' *' : ''}`}
                  </InputLabel>
                </InputLabelWrapper>

                <Editable
                  readOnly={disabled}
                  style={{ width: '100%' }}
                  renderElement={renderElement}
                  onKeyDown={disappearSuggestionsOnShift}
                  onFocus={() => {
                    setShowVariableSuggestions(true);
                  }}
                  onBlur={() => {
                    controllerOnBlur();
                    handleBlur(value);
                  }}
                />
              </FakeInput>
              {/* ghost placer for the variables popover */}
              <div
                ref={editorRef}
                style={{ position: 'absolute', right: 16, left: 16 }}
              />

              <Popper
                open={showVariableSuggestions}
                anchorEl={editorRef.current}
                data={stepsWithVariables}
                onSuggestionClick={handleVariableSuggestionClick}
                className="nowheel"
              />

              <FormHelperText variant="outlined">{description}</FormHelperText>
            </ChildrenWrapper>
          </ClickAwayListener>
        </Slate>
      )}
    />
  );
};

PowerInput.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  defaultValue: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  description: PropTypes.string,
  docUrl: PropTypes.string,
  clickToCopy: PropTypes.bool,
  disabled: PropTypes.bool,
  shouldUnregister: PropTypes.bool,
};

export default PowerInput;
