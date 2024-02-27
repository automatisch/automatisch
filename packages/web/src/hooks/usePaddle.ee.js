import * as React from 'react';
import { PaddleContext } from 'contexts/Paddle.ee';
export default function usePaddle() {
  const paddleContext = React.useContext(PaddleContext);
  return {
    loaded: paddleContext.loaded,
  };
}
