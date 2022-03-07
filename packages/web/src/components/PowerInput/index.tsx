import * as React from 'react';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import Chip from '@mui/material/Chip';
import Popper from '@mui/material/Popper';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { Controller, Control, FieldValues, useFormContext } from 'react-hook-form';
import { Editor, Transforms, Range, createEditor } from 'slate';
import {
  Slate,
  Editable,
  useSelected,
  useFocused,
} from 'slate-react';

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
}

const PowerInput = (props: PowerInputProps) => {
  const { control } = useFormContext();
  const {
    defaultValue = '',
    onBlur,
    name,
    label,
    required,
    description,
  } = props;
  const priorStepsWithExecutions = React.useContext(StepExecutionsContext);
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const [target, setTarget] = React.useState<Range | null>(null);
  const [index, setIndex] = React.useState(0);
  const [search, setSearch] = React.useState<string | null>(null);
  const renderElement = React.useCallback(props => <Element {...props} />, []);
  const [editor] = React.useState(() => customizeEditor(createEditor()));

  const stepsWithVariables = React.useMemo(() => {
    return processStepWithExecutions(priorStepsWithExecutions);
  }, [priorStepsWithExecutions])

  const handleBlur = React.useCallback((value) => {
    onBlur?.(value);
  }, [onBlur]);

  const handleVariableSuggestionClick = React.useCallback(
    (variable: Pick<VariableElement, "name" | "value">) => {
      if (target) {
        Transforms.select(editor, target);
        insertVariable(editor, variable);
        setTarget(null);
      }
    },
    [index, target]
  );

  const onKeyDown = React.useCallback(
    event => {
      if (target) {
        switch (event.key) {
          case 'ArrowDown': {
            event.preventDefault();
            setIndex((currentIndex) => currentIndex + 1);
            break
          }
          case 'ArrowUp': {
            event.preventDefault();
            setIndex((currentIndex) => currentIndex - 1 < 0 ? 0 : currentIndex - 1);
            break
          }
          case 'Tab':
          case 'Enter': {
            event.preventDefault();
            Transforms.select(editor, target);
            insertVariable(editor, stepsWithVariables[0].output[index]);
            setTarget(null);
            break
          }
          case 'Escape': {
            event.preventDefault();
            setTarget(null);
            break
          }
        }
      }
    },
    [index, search, target, stepsWithVariables]
  );

  return (
    <Controller
      rules={{ required }}
      name={name}
      control={control}
      defaultValue={defaultValue}
      shouldUnregister={false}
      render={({ field: { value, ref, onChange: controllerOnChange, onBlur: controllerOnBlur, ...field } }) => (
        <Slate
          editor={editor}
          value={deserialize(value)}
          onChange={value => {
            controllerOnChange(serialize(value));
            const { selection } = editor

            if (selection && Range.isCollapsed(selection)) {
              const [start] = Range.edges(selection);
              const lineBefore = Editor.before(editor, start, { unit: 'line' });
              const before = lineBefore && Editor.before(editor, lineBefore);
              const beforeRange = (before || lineBefore) && Editor.range(editor, before || lineBefore, start);
              const beforeText = beforeRange && Editor.string(editor, beforeRange);
              const variableMatch = beforeText && beforeText.match(/@([\w.]*?)$/);

              if (variableMatch) {
                const beginningOfVariable = Editor.before(
                  editor,
                  start,
                  {
                    unit: 'offset',
                    distance: (variableMatch[1].length || 0) + 1
                  }
                );
                if (beginningOfVariable) {
                  const newTarget = Editor.range(editor, beginningOfVariable, start);
                  if (newTarget) {
                    setTarget(newTarget);
                  }
                }
                setIndex(0);
                setSearch(variableMatch[1]);

                return;
              }
            }

            setSearch(null);
          }}
        >
          <ClickAwayListener onClickAway={() => setSearch(null)}>
            {/* ref-able single child for ClickAwayListener */}
            <div style={{ width: '100%' }}>
              <FakeInput>
                <InputLabelWrapper>
                  <InputLabel
                    shrink={true}
                    // focused
                    variant="outlined"
                    sx={{ bgcolor: 'white', display: 'inline-block', px: .75 }}
                  >
                    {label}
                  </InputLabel>
                </InputLabelWrapper>

                <Editable
                  style={{ width: '100%' }}
                  renderElement={renderElement}
                  onKeyDown={onKeyDown}
                  onBlur={() => { controllerOnBlur(); handleBlur(value); }}
                />
              </FakeInput>
              {/* ghost placer for the variables popover */}
              <div ref={editorRef} style={{ width: '100%' }} />

              <FormHelperText
                variant="outlined"
              >
                {description}
              </FormHelperText>

              <Popper
                open={target !== null && search !== null}
                anchorEl={editorRef.current}
                style={{ width: editorRef.current?.clientWidth }}
              >
                <Suggestions
                  query={search}
                  index={index}
                  data={stepsWithVariables}
                  onSuggestionClick={handleVariableSuggestionClick}
                />
              </Popper>
            </div>
          </ClickAwayListener>
        </Slate>
      )}
    />
  )
}

const Element = (props: any) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case 'variable':
      return <Variable {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
}

const Variable = ({ attributes, children, element }:  any) => {
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
  )
}

export default PowerInput;
