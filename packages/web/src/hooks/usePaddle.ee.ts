import * as React from 'react';
import { PaddleContext } from 'contexts/Paddle.ee';

type UsePaddleReturn = {
  loaded: boolean;
};

export default function usePaddle(): UsePaddleReturn {
  const paddleContext = React.useContext(PaddleContext);

  return {
    loaded: paddleContext.loaded,
  };
}
