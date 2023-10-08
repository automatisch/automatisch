import * as React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { IconButton } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import { AutocompleteProps } from '@mui/material/Autocomplete';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClearIcon from '@mui/icons-material/Clear';
import type { IFieldDropdownOption } from '@automatisch/types';
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
import { VariableElement } from 'components/Slate/types';
import CustomOptions from './CustomOptions';
import { processStepWithExecutions } from 'components/PowerInput/data';
import { StepExecutionsContext } from 'contexts/StepExecutions';

interface ControlledCustomAutocompleteProps
  extends AutocompleteProps<IFieldDropdownOption, boolean, boolean, boolean> {
  showOptionValue?: boolean;
  dependsOn?: string[];

  defaultValue?: string;
  name: string;
  label?: string;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
  description?: string;
  docUrl?: string;
  clickToCopy?: boolean;
  disabled?: boolean;
  shouldUnregister?: boolean;
}

function ControlledCustomAutocomplete(
  props: ControlledCustomAutocompleteProps
): React.ReactElement {
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
  const [isSingleChoice, setSingleChoice] = React.useState<boolean | undefined>(
    undefined
  );
  const priorStepsWithExecutions = React.useContext(StepExecutionsContext);
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const renderElement = React.useCallback(
    (props) => <Element {...props} disabled={disabled} />,
    [disabled]
  );
  const [editor] = React.useState(() => customizeEditor(createEditor()));
  const [showVariableSuggestions, setShowVariableSuggestions] =
    React.useState(false);

  let dependsOnValues: unknown[] = [];
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
    const hasDependencies = dependsOnValues.length;

    if (hasDependencies) {
      // Reset the field when a dependent has been updated
      resetEditor(editor);
    }
  }, dependsOnValues);

  React.useEffect(
    function updateInitialValue() {
      const hasOptions = options.length;
      const isOptionsLoaded = loading === false;
      if (!isInitialValueSet && hasOptions && isOptionsLoaded) {
        setInitialValue(true);

        const option: IFieldDropdownOption | undefined = options.find(
          (option) => option.value === value
        );

        if (option) {
          overrideEditorValue(editor, { option, focus: false });
          setSingleChoice(true);
        } else if (value) {
          setSingleChoice(false);
        }
      }
    },
    [isInitialValueSet, options, loading]
  );

  React.useEffect(() => {
    if (!showVariableSuggestions && value !== serialize(editor.children)) {
      promoteValue();
    }
  }, [showVariableSuggestions]);

  const hideSuggestionsOnShift = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.code === 'Tab') {
      setShowVariableSuggestions(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
    (variable: Pick<VariableElement, 'name' | 'value'>) => {
      insertVariable(editor, variable, stepsWithVariables);
    },
    [stepsWithVariables]
  );

  const handleOptionClick = React.useCallback(
    (event: React.MouseEvent, option: IFieldDropdownOption) => {
      event.stopPropagation();
      overrideEditorValue(editor, { option, focus: false });
      setShowVariableSuggestions(false);
      setSingleChoice(true);
    },
    [stepsWithVariables]
  );

  const handleClearButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    resetEditor(editor);
    promoteValue();
    setSingleChoice(undefined);
  };

  const reset = (tabIndex: 0 | 1) => {
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
                {label}
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

export default ControlledCustomAutocomplete;
