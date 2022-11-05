import * as React from 'react';
import ReactDOM from 'react-dom';

type PortalProps = {
  children: React.ReactElement;
};

const Portal = ({ children }: PortalProps) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

export default Portal;
