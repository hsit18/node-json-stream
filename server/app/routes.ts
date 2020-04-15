import { Request, Response, NextFunction } from 'express';

import {getTopPosts, upVotesHandler, downVotesHandler} from './posts';
export class Routes {

  public routes(app: any): void {
    app.route('/').get((req: Request, res: Response) => {
      res.status(200).send({
        message: 'GET request successfulll!!!!',
      });
    });

    app.route('/top').get(getTopPosts);

    app.route('/upvote/:id').post(upVotesHandler);

    app.route('/downvote/:id').post(downVotesHandler);
  }
}
