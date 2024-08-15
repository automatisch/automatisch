import { Text } from 'slate';
import { withHistory } from 'slate-history';
import { ReactEditor, withReact } from 'slate-react';

function isCustomText(value) {
  const isText = Text.isText(value);
  const hasValueProperty = 'value' in value;
  if (isText && hasValueProperty) return true;
  return false;
}

function getStepPosition(id, stepsWithVariables) {
  const stepIndex = stepsWithVariables.findIndex((stepWithVariables) => {
    return stepWithVariables.id === id;
  });
  return stepIndex + 1;
}

function getVariableName(variable) {
  return variable.replace(/{{|}}/g, '');
}

function getVariableStepId(variable) {
  const nameWithoutCurlies = getVariableName(variable);
  const stepId = nameWithoutCurlies.match(stepIdRegExp)?.[1] || '';
  return stepId;
}

function getVariableSampleValue(variable, stepsWithVariables) {
  const variableStepId = getVariableStepId(variable);
  const stepWithVariables = stepsWithVariables.find(
    ({ id }) => id === variableStepId,
  );
  if (!stepWithVariables) return null;
  const variableName = getVariableName(variable);
  const variableData = stepWithVariables.output.find(
    ({ value }) => variableName === value,
  );
  if (!variableData) return null;
  return variableData.sampleValue;
}

function getVariableDetails(variable, stepsWithVariables) {
  const variableName = getVariableName(variable);
  const stepId = getVariableStepId(variableName);
  const stepPosition = getStepPosition(stepId, stepsWithVariables);
  const sampleValue = getVariableSampleValue(variable, stepsWithVariables);
  const label = variableName.replace(`step.${stepId}.`, `step${stepPosition}.`);
  return {
    sampleValue,
    label,
  };
}

const variableRegExp = /({{.*?}})/;
const stepIdRegExp = /^step.([\da-zA-Z-]*)/;

export const deserialize = (value, options, stepsWithVariables) => {
  const selectedNativeOption = options?.find(
    (option) => value === option.value,
  );

  if (selectedNativeOption) {
    return [
      {
        type: 'paragraph',
        value: selectedNativeOption.value,
        children: [{ text: selectedNativeOption.label }],
      },
    ];
  }

  if (value === null || value === undefined || value === '')
    return [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ];

  return value
    .toString()
    .split('\n')
    .map((line) => {
      const nodes = line.split(variableRegExp);
      if (nodes.length > 1) {
        return {
          type: 'paragraph',
          children: nodes.map((node) => {
            if (node.match(variableRegExp)) {
              const variableDetails = getVariableDetails(
                node,
                stepsWithVariables,
              );
              return {
                type: 'variable',
                name: variableDetails.label,
                sampleValue: variableDetails.sampleValue,
                value: node,
                children: [{ text: '' }],
              };
            }
            return {
              text: node,
            };
          }),
        };
      }
      return {
        type: 'paragraph',
        children: [{ text: line }],
      };
    });
};

export const serialize = (value) => {
  const serializedNodes = value.map((node) => serializeNode(node));
  const hasSingleNode = value.length === 1;
  /**
   * return single serialize node alone so that we don't stringify.
   * booleans stay booleans, numbers stay number
   */
  if (hasSingleNode) {
    return serializedNodes[0];
  }
  const serializedValue = serializedNodes.join('\n');
  return serializedValue;
};

const serializeNode = (node) => {
  if (isCustomText(node)) {
    return node.value;
  }
  if (Text.isText(node)) {
    return node.text;
  }
  if (node.type === 'variable') {
    return node.value;
  }
  const hasSingleChild = node.children.length === 1;
  /**
   * serialize alone so that we don't stringify.
   * booleans stay booleans, numbers stay number
   */
  if (hasSingleChild) {
    return serializeNode(node.children[0]);
  }
  return node.children.map((n) => serializeNode(n)).join('');
};

export const withVariables = (editor) => {
  const { isInline, isVoid } = editor;
  editor.isInline = (element) => {
    return element.type === 'variable' ? true : isInline(element);
  };
  editor.isVoid = (element) => {
    return element.type === 'variable' ? true : isVoid(element);
  };
  return editor;
};

export const insertVariable = (editor, variableData, stepsWithVariables) => {
  const variableDetails = getVariableDetails(
    `{{${variableData.value}}}`,
    stepsWithVariables,
  );
  const variable = {
    type: 'variable',
    name: variableDetails.label,
    sampleValue: variableDetails.sampleValue,
    value: `{{${variableData.value}}}`,
    children: [{ text: '' }],
  };
  editor.insertNodes(variable, { select: false });
  focusEditor(editor);
};

export const focusEditor = (editor) => {
  ReactEditor.focus(editor);
  editor.move();
};

export const resetEditor = (editor, options) => {
  const focus = options?.focus || false;
  editor.removeNodes({
    at: {
      anchor: editor.start([]),
      focus: editor.end([]),
    },
  });
  // `editor.normalize({ force: true })` doesn't add an empty node in the editor
  editor.insertNode(createTextNode(''));
  if (focus) {
    focusEditor(editor);
  }
};

export const overrideEditorValue = (editor, options) => {
  const { option, focus } = options;
  const variable = {
    type: 'paragraph',
    children: [
      {
        value: option.value,
        text: option.label,
      },
    ],
  };
  editor.withoutNormalizing(() => {
    editor.removeNodes({
      at: {
        anchor: editor.start([]),
        focus: editor.end([]),
      },
    });
    editor.insertNode(variable);
    if (focus) {
      focusEditor(editor);
    }
  });
};

export const createTextNode = (text) => ({
  type: 'paragraph',
  children: [
    {
      text,
    },
  ],
});

export const customizeEditor = (editor) => {
  return withVariables(withReact(withHistory(editor)));
};
