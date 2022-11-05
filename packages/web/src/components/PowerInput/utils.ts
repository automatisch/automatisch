import { Text, Descendant, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';

import type { CustomEditor, CustomElement, VariableElement } from './types';

function getStepPosition(
  id: string,
  stepsWithVariables: Record<string, unknown>[]
) {
  const stepIndex = stepsWithVariables.findIndex((stepWithVariables) => {
    return stepWithVariables.id === id;
  });

  return stepIndex + 1;
}

function humanizeVariableName(
  variableName: string,
  stepsWithVariables: Record<string, unknown>[]
) {
  const nameWithoutCurlies = variableName.replace(/{{|}}/g, '');
  const stepId = nameWithoutCurlies.match(stepIdRegExp)?.[1] || '';
  const stepPosition = getStepPosition(stepId, stepsWithVariables);
  const humanizedVariableName = nameWithoutCurlies.replace(
    `step.${stepId}.`,
    `step${stepPosition}.`
  );

  return humanizedVariableName;
}

const variableRegExp = /({{.*?}})/;
const stepIdRegExp = /^step.([\da-zA-Z-]*)/;
export const deserialize = (
  value: string,
  stepsWithVariables: any[]
): Descendant[] => {
  if (!value)
    return [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ];

  return value.split('\n').map((line) => {
    const nodes = line.split(variableRegExp);

    if (nodes.length > 1) {
      return {
        type: 'paragraph',
        children: nodes.map((node) => {
          if (node.match(variableRegExp)) {
            return {
              type: 'variable',
              name: humanizeVariableName(node, stepsWithVariables),
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

export const serialize = (value: Descendant[]): string => {
  return value.map((node) => serializeNode(node)).join('\n');
};

const serializeNode = (node: CustomElement | Descendant): string => {
  if (Text.isText(node)) {
    return node.text;
  }

  if (node.type === 'variable') {
    return node.value as string;
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
  variableData: Pick<VariableElement, 'name' | 'value'>,
  stepsWithVariables: Record<string, unknown>[]
) => {
  const variable: VariableElement = {
    type: 'variable',
    name: humanizeVariableName(variableData.name as string, stepsWithVariables),
    value: `{{${variableData.name}}}`,
    children: [{ text: '' }],
  };

  Transforms.insertNodes(editor, variable);
  Transforms.move(editor);
};

export const customizeEditor = (editor: CustomEditor): CustomEditor => {
  return withVariables(withReact(withHistory(editor)));
};
