import * as React from 'react';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import Chip from '@mui/material/Chip';
import Popper from '@mui/material/Popper';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { Controller, useFormContext } from 'react-hook-form';
import { Editor, Transforms, Range, createEditor } from 'slate';
import { Slate, Editable, useSelected, useFocused } from 'slate-react';

import {
  serialize,
  deserialize,
  insertVariable,
  customizeEditor,
} from './utils';
import Suggestions from './Suggestions';
import { StepExecutionsContext } from 'contexts/StepExecutions';

import { FakeInput, InputLabelWrapper } from './style';
import { VariableElement } from './types';
import { processStepWithExecutions } from './data';

type PowerInputProps = {
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
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
};

const PowerInput = (props: PowerInputProps) => {
  const { control } = useFormContext();
  const {
    defaultValue = '',
    onBlur,
    name,
    label,
    required,
    description,
    disabled,
  } = props;
  const priorStepsWithExecutions = React.useContext(StepExecutionsContext);
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const renderElement = React.useCallback(
    (props) => <Element {...props} />,
    []
  );
  const [editor] = React.useState(() => customizeEditor(createEditor()));
  const [showVariableSuggestions, setShowVariableSuggestions] =
    React.useState(false);

  const stepsWithVariables = React.useMemo(() => {
    return processStepWithExecutions(priorStepsWithExecutions);
  }, [priorStepsWithExecutions]);

  const handleBlur = React.useCallback(
    (value) => {
      onBlur?.(value);
    },
    [onBlur]
  );

  const handleVariableSuggestionClick = React.useCallback(
    (variable: Pick<VariableElement, 'name' | 'value'>) => {
      insertVariable(editor, variable, stepsWithVariables);
    },
    [stepsWithVariables]
  );

  return (
    <Controller
      rules={{ required }}
      name={name}
      control={control}
      defaultValue={defaultValue}
      shouldUnregister={false}
      render={({
        field: {
          value,
          onChange: controllerOnChange,
          onBlur: controllerOnBlur,
        },
      }) => (
        <Slate
          editor={editor}
          value={deserialize(value, stepsWithVariables)}
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
            <div style={{ width: '100%' }} data-test="power-input">
              <FakeInput disabled={disabled}>
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
              <div ref={editorRef} style={{ position: 'absolute', right: 16, left: 16 }} />

              <FormHelperText variant="outlined">{description}</FormHelperText>

              <SuggestionsPopper
                open={showVariableSuggestions}
                anchorEl={editorRef.current}
                data={stepsWithVariables}
                onSuggestionClick={handleVariableSuggestionClick}
              />
            </div>
          </ClickAwayListener>
        </Slate>
      )}
    />
  );
};

const SuggestionsPopper = (props: any) => {
  const { open, anchorEl, data, onSuggestionClick } = props;

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      style={{ width: anchorEl?.clientWidth, zIndex: 1 }}
      modifiers={[
        {
          name: 'flip',
          enabled: false,
          options: {
            altBoundary: false,
          },
        },
      ]}
    >
      <Suggestions data={data} onSuggestionClick={onSuggestionClick} />
    </Popper>
  );
};

const Element = (props: any) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case 'variable':
      return <Variable {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Variable = ({ attributes, children, element }: any) => {
  const selected = useSelected();
  const focused = useFocused();
  const label = (
    <>
      {element.name}
      {children}
    </>
  );
  return (
    <Chip
      {...attributes}
      component="span"
      contentEditable={false}
      style={{
        boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
      }}
      size="small"
      label={label}
    />
  );
};

export default PowerInput;
