import * as React from 'react';
import { FlowPropType } from 'propTypes/propTypes';

function EditorNew(props) {
  return <div>new editor comes here</div>;
}

EditorNew.propTypes = {
  flow: FlowPropType.isRequired,
};

export default EditorNew;
