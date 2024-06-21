import PropTypes from 'prop-types';
import * as React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { IconButton } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClearIcon from '@mui/icons-material/Clear';
import { ActionButtonsWrapper } from './style';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import InputLabel from '@mui/material/InputLabel';
import { createEditor } from 'slate';
import { Editable, ReactEditor } from 'slate-react';
import Slate from 'components/Slate';
import Element from 'components/Slate/Element';
import {
  serialize,
  deserialize,
  insertVariable,
  customizeEditor,
  resetEditor,
  overrideEditorValue,
  focusEditor,
} from 'components/Slate/utils';
import {
  FakeInput,
  InputLabelWrapper,
  ChildrenWrapper,
} from 'components/PowerInput/style';
import CustomOptions from './CustomOptions';
import { processStepWithExecutions } from 'components/PowerInput/data';
import { StepExecutionsContext } from 'contexts/StepExecutions';

function ControlledCustomAutocomplete(props) {
  const {
    defaultValue = '',
    name,
    label,
    required,
    options = [],
    dependsOn = [],
    description,
    loading,
    disabled,
    shouldUnregister,
  } = props;
  const { control, watch } = useFormContext();
  const { field, fieldState } = useController({
    control,
    name,
    defaultValue,
    rules: { required },
    shouldUnregister,
  });
  const {
    value,
    onChange: controllerOnChange,
    onBlur: controllerOnBlur,
  } = field;
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const [isInitialValueSet, setInitialValue] = React.useState(false);
  const [isSingleChoice, setSingleChoice] = React.useState(undefined);
  const priorStepsWithExecutions = React.useContext(StepExecutionsContext);
  const editorRef = React.useRef(null);
  const mountedRef = React.useRef(false);

  const renderElement = React.useCallback(
    (props) => <Element {...props} disabled={disabled} />,
    [disabled],
  );

  const [editor] = React.useState(() => customizeEditor(createEditor()));

  const [showVariableSuggestions, setShowVariableSuggestions] =
    React.useState(false);
  let dependsOnValues = [];
  if (dependsOn?.length) {
    dependsOnValues = watch(dependsOn);
  }

  React.useEffect(() => {
    const ref = ReactEditor.toDOMNode(editor, editor);
    resizeObserver.observe(ref);
    return () => resizeObserver.unobserve(ref);
  }, []);

  const promoteValue = () => {
    const serializedValue = serialize(editor.children);
    controllerOnChange(serializedValue);
  };

  const resizeObserver = React.useMemo(function syncCustomOptionsPosition() {
    return new ResizeObserver(() => {
      forceUpdate();
    });
  }, []);

  React.useEffect(() => {
    if (mountedRef.current) {
      const hasDependencies = dependsOnValues.length;
      if (hasDependencies) {
        // Reset the field when a dependent has been updated
        resetEditor(editor);
      }
    } else {
      mountedRef.current = true;
    }
  }, dependsOnValues);

  React.useEffect(
    function updateInitialValue() {
      const hasOptions = options.length;
      const isOptionsLoaded = loading === false;
      if (!isInitialValueSet && hasOptions && isOptionsLoaded) {
        setInitialValue(true);
        const option = options.find((option) => option.value === value);
        if (option) {
          overrideEditorValue(editor, { option, focus: false });
          setSingleChoice(true);
        } else if (value) {
          setSingleChoice(false);
        }
      }
    },
    [isInitialValueSet, options, loading],
  );

  React.useEffect(() => {
    if (!showVariableSuggestions && value !== serialize(editor.children)) {
      promoteValue();
    }
  }, [showVariableSuggestions]);

  const hideSuggestionsOnShift = (event) => {
    if (event.code === 'Tab') {
      setShowVariableSuggestions(false);
    }
  };

  const handleKeyDown = (event) => {
    hideSuggestionsOnShift(event);
    if (event.code === 'Tab') {
      promoteValue();
    }
    if (isSingleChoice && event.code !== 'Tab') {
      event.preventDefault();
    }
  };

  const stepsWithVariables = React.useMemo(() => {
    return processStepWithExecutions(priorStepsWithExecutions);
  }, [priorStepsWithExecutions]);

  const handleVariableSuggestionClick = React.useCallback(
    (variable) => {
      insertVariable(editor, variable, stepsWithVariables);
    },
    [stepsWithVariables],
  );

  const handleOptionClick = React.useCallback(
    (event, option) => {
      event.stopPropagation();
      overrideEditorValue(editor, { option, focus: false });
      setShowVariableSuggestions(false);
      setSingleChoice(true);
    },
    [stepsWithVariables],
  );

  const handleClearButtonClick = (event) => {
    event.stopPropagation();
    resetEditor(editor);
    promoteValue();
    setSingleChoice(undefined);
  };

  const reset = (tabIndex) => {
    const isOptions = tabIndex === 0;
    setSingleChoice(isOptions);
    resetEditor(editor, { focus: true });
  };

  return (
    <Slate
      editor={editor}
      value={deserialize(value, options, stepsWithVariables)}
    >
      <ClickAwayListener
        mouseEvent="onMouseDown"
        onClickAway={() => setShowVariableSuggestions(false)}
      >
        {/* ref-able single child for ClickAwayListener */}
        <ChildrenWrapper style={{ width: '100%' }} data-test="power-input">
          <FakeInput
            disabled={disabled}
            tabIndex={-1}
            onClick={() => {
              focusEditor(editor);
            }}
          >
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
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setShowVariableSuggestions(true);
              }}
              onBlur={() => {
                controllerOnBlur();
              }}
            />

            <ActionButtonsWrapper direction="row" mr={1.5}>
              {isSingleChoice && serialize(editor.children) !== '' && (
                <IconButton
                  disabled={disabled}
                  edge="end"
                  size="small"
                  tabIndex={-1}
                  onClick={handleClearButtonClick}
                >
                  <ClearIcon />
                </IconButton>
              )}
              <IconButton
                disabled={disabled}
                edge="end"
                size="small"
                tabIndex={-1}
              >
                <ArrowDropDownIcon />
              </IconButton>
            </ActionButtonsWrapper>
          </FakeInput>
          {/* ghost placer for the variables popover */}
          <div
            ref={editorRef}
            style={{
              position: 'absolute',
              right: 16,
              left: 16,
            }}
          />

          <CustomOptions
            label={label}
            open={showVariableSuggestions}
            initialTabIndex={
              isSingleChoice === undefined ? undefined : isSingleChoice ? 0 : 1
            }
            anchorEl={editorRef.current}
            data={stepsWithVariables}
            options={options}
            onSuggestionClick={handleVariableSuggestionClick}
            onOptionClick={handleOptionClick}
            onTabChange={reset}
          />

          <FormHelperText
            variant="outlined"
            error={Boolean(fieldState.isTouched && fieldState.error)}
          >
            {fieldState.isTouched
              ? fieldState.error?.message || description
              : description}
          </FormHelperText>
        </ChildrenWrapper>
      </ClickAwayListener>
    </Slate>
  );
}

ControlledCustomAutocomplete.propTypes = {
  options: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  showOptionValue: PropTypes.bool,
  dependsOn: PropTypes.arrayOf(PropTypes.string),
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

export default ControlledCustomAutocomplete;
