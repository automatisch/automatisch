import * as React from 'react';
import { JSONTree } from 'react-json-tree';
import type { IJSONObject } from '@automatisch/types';

type JSONViewerProps = {
  data: IJSONObject;
}

const theme = {
  scheme: 'inspector',
  author: 'Alexander Kuznetsov (alexkuz@gmail.com)',
  base00: '#181818',
  base01: '#282828',
  base02: '#383838',
  base03: '#585858',
  base04: '#b8b8b8',
  base05: '#d8d8d8',
  base06: '#e8e8e8',
  base07: '#FFFFFF',
  base08: '#E92F28',
  base09: '#dc9656',
  base0A: '#f7ca88',
  base0B: '#65AD00',
  base0C: '#86c1b9',
  base0D: '#347BD9',
  base0E: '#EC31C0',
  base0F: '#a16946',
};

function JSONViewer(props: JSONViewerProps) {
  const { data } = props;

  return (
    <JSONTree
      hideRoot
      data={data}
      shouldExpandNode={() => true}
      invertTheme={true}
      theme={theme}
    />
  );
}

export default JSONViewer;
