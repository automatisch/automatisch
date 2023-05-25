import type { BaseEditor, Text, Descendant } from 'slate';
import type { ReactEditor } from 'slate-react';

export type VariableElement = {
  type: 'variable';
  value?: unknown;
  name?: string;
  sampleValue?: unknown;
  children: Text[];
};

export type ParagraphElement = {
  type: 'paragraph';
  value?: string;
  children: Descendant[];
};

export type CustomText = {
  text: string;
  value: string;
};

export type CustomEditor = BaseEditor & ReactEditor;

export type CustomElement = VariableElement | ParagraphElement;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
  }
}
