import PropTypes from 'prop-types';
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import { Controller, useFormContext } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { InputLabelWrapper } from './style';

function CodeEditor(props) {
  const containerRef = React.useRef(null);
  const editorRef = React.useRef(null);
  const [containerHeight, setContainerHeight] = React.useState(20);
  const { control } = useFormContext();
  const {
    required,
    name,
    label,
    defaultValue,
    shouldUnregister = false,
    disabled,
    'data-test': dataTest,
  } = props;

  const handleEditorOnMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.onDidContentSizeChange((event) => {
      const { contentHeight, contentHeightChanged } = event;

      if (contentHeightChanged) {
        // cap the editor height at 500px
        const editorContentHeight = Math.min(500, contentHeight);

        setContainerHeight(editorContentHeight);
      }
    });
  };

  return (
    <Controller
      rules={{ required }}
      name={name}
      defaultValue={defaultValue || ''}
      control={control}
      shouldUnregister={shouldUnregister}
      render={({ field }) => (
        <div style={{ paddingTop: 36, position: 'relative' }}>
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

          <div
            style={{ height: containerHeight, width: '100%' }}
            data-test={dataTest}
          >
            <Editor
              {...field}
              ref={containerRef}
              defaultLanguage="javascript"
              defaultValue={defaultValue}
              onMount={handleEditorOnMount}
              onChange={(value, event) => {
                field.onChange(value, event);
              }}
              options={{
                fontSize: 13,
                automaticLayout: true,
                bracketPairColorization: true,
                formatOnPaste: true,
                minimap: {
                  enabled: false,
                },
                overviewRulerLanes: 0,
                readOnly: disabled,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                wrappingStrategy: 'advanced',
              }}
            />
          </div>
        </div>
      )}
    />
  );
}

CodeEditor.propTypes = {
  required: PropTypes.bool,
  defaultValue: PropTypes.string,
  shouldUnregister: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  'data-test': PropTypes.string,
  disabled: PropTypes.bool,
};

export default CodeEditor;
