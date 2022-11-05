import * as React from 'react';
import { JSONTree } from 'react-json-tree';
import type { IJSONObject } from '@automatisch/types';

type JSONViewerProps = {
  data: IJSONObject;
};

const theme = {
  scheme: 'inspector',
  author: 'Alexander Kuznetsov (alexkuz@gmail.com)',
  // base00 - Default Background
  base00: 'transparent',
  // base01 - Lighter Background (Used for status bars, line number and folding marks)
  base01: '#282828',
  // base02 - Selection Background
  base02: '#383838',
  // base03 - Comments, Invisibles, Line Highlighting
  base03: '#585858',
  // base04 - Dark Foreground (Used for status bars)
  base04: '#b8b8b8',
  // base05 - Default Foreground, Caret, Delimiters, Operators
  base05: '#d8d8d8',
  // base06 - Light Foreground (Not often used)
  base06: '#e8e8e8',
  // base07 - Light Background (Not often used)
  base07: '#FFFFFF',
  // base08 - Variables, XML Tags, Markup Link Text, Markup Lists, Diff Deleted
  base08: '#E92F28',
  // base09 - Integers, Boolean, Constants, XML Attributes, Markup Link Url
  base09: '#005cc5',
  // base0A - Classes, Markup Bold, Search Text Background
  base0A: '#f7ca88',
  // base0B - Strings, Inherited Class, Markup Code, Diff Inserted
  base0B: '#22863a',
  // base0C - Support, Regular Expressions, Escape Characters, Markup Quotes
  base0C: '#86c1b9',
  // base0D - Functions, Methods, Attribute IDs, Headings
  base0D: '#d73a49', // key
  // base0E - Keywords, Storage, Selector, Markup Italic, Diff Changed
  base0E: '#EC31C0',
  // base0F - Deprecated, Opening/Closing Embedded Language Tags, e.g. <?php ?>
  base0F: '#a16946',
};

function JSONViewer(props: JSONViewerProps) {
  const { data } = props;

  return (
    <JSONTree
      hideRoot
      data={data}
      shouldExpandNode={() => true}
      invertTheme={false}
      theme={theme}
    />
  );
}

export default JSONViewer;
