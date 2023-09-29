import { Text, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { ReactEditor, withReact } from 'slate-react';
import { IFieldDropdownOption } from '@automatisch/types';

import type {
  CustomEditor,
  CustomElement,
  CustomText,
  ParagraphElement,
  VariableElement,
} from './types';

type StepWithVariables = {
  id: string;
  name: string;
  output: {
    label: string;
    sampleValue: string;
    value: string;
  }[];
};

type StepsWithVariables = StepWithVariables[];

function isCustomText(value: any): value is CustomText {
  const isText = Text.isText(value);
  const hasValueProperty = 'value' in value;

  if (isText && hasValueProperty) return true;

  return false;
}

function getStepPosition(id: string, stepsWithVariables: StepsWithVariables) {
  const stepIndex = stepsWithVariables.findIndex((stepWithVariables) => {
    return stepWithVariables.id === id;
  });

  return stepIndex + 1;
}

function getVariableName(variable: string) {
  return variable.replace(/{{|}}/g, '');
}

function getVariableStepId(variable: string) {
  const nameWithoutCurlies = getVariableName(variable);
  const stepId = nameWithoutCurlies.match(stepIdRegExp)?.[1] || '';

  return stepId;
}

function getVariableSampleValue(
  variable: string,
  stepsWithVariables: StepsWithVariables
) {
  const variableStepId = getVariableStepId(variable);
  const stepWithVariables = stepsWithVariables.find(
    ({ id }: { id: string }) => id === variableStepId
  );

  if (!stepWithVariables) return null;

  const variableName = getVariableName(variable);
  const variableData = stepWithVariables.output.find(
    ({ value }) => variableName === value
  );

  if (!variableData) return null;

  return variableData.sampleValue;
}

function getVariableDetails(
  variable: string,
  stepsWithVariables: StepsWithVariables
) {
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

export const deserialize = (
  value: boolean | string | number,
  options: readonly IFieldDropdownOption[],
  stepsWithVariables: StepsWithVariables
): Descendant[] => {
  const selectedNativeOption = options?.find(
    (option) => value === option.value
  );

  if (selectedNativeOption) {
    return [
      {
        type: 'paragraph',
        value: selectedNativeOption.value as string,
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
                stepsWithVariables
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

export const serialize = (value: Descendant[]): string | number | null => {
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

const serializeNode = (
  node: CustomElement | Descendant
): string | number | null => {
  if (isCustomText(node)) {
    return node.value;
  }

  if (Text.isText(node)) {
    return node.text;
  }

  if (node.type === 'variable') {
    return node.value as string;
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

export const withVariables = (editor: CustomEditor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element: CustomElement) => {
    return element.type === 'variable' ? true : isInline(element);
  };

  editor.isVoid = (element: CustomElement) => {
    return element.type === 'variable' ? true : isVoid(element);
  };

  return editor;
};

export const insertVariable = (
  editor: CustomEditor,
  variableData: Record<string, unknown>,
  stepsWithVariables: StepsWithVariables
) => {
  const variableDetails = getVariableDetails(
    `{{${variableData.value}}}`,
    stepsWithVariables
  );

  const variable: VariableElement = {
    type: 'variable',
    name: variableDetails.label,
    sampleValue: variableDetails.sampleValue,
    value: `{{${variableData.value}}}`,
    children: [{ text: '' }],
  };

  editor.insertNodes(variable, { select: false });

  focusEditor(editor);
};

export const focusEditor = (editor: CustomEditor) => {
  ReactEditor.focus(editor);
  editor.move();
};

export const resetEditor = (
  editor: CustomEditor,
  options?: { focus: boolean }
) => {
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

export const overrideEditorValue = (
  editor: CustomEditor,
  options: { option: IFieldDropdownOption; focus: boolean }
) => {
  const { option, focus } = options;

  const variable: ParagraphElement = {
    type: 'paragraph',
    children: [
      {
        value: option.value as string,
        text: option.label as string,
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

export const createTextNode = (text: string): ParagraphElement => ({
  type: 'paragraph',
  children: [
    {
      text,
    },
  ],
});

export const customizeEditor = (editor: CustomEditor): CustomEditor => {
  return withVariables(withReact(withHistory(editor)));
};
