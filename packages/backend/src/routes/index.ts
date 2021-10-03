import { Request, Response } from 'express';

const indexRouter = (_request: Request, response: Response) => {
  return response.json({ hello: 'world!' })
};

export default indexRouter;
