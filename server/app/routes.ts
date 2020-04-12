import { Request, Response, NextFunction } from "express";

import PostController from "./posts.controller";
export class Routes {
  public postCtrl: PostController = new PostController();

  public routes(app: any): void {
    app.route("/").get((req: Request, res: Response) => {
      res.status(200).send({
        message: "GET request successfulll!!!!",
      });
    });

    app.route("/top").get(this.postCtrl.getTopPosts);

    app.route("/upvote/:id").post(this.postCtrl.upVotesHandler);

    app.route("/downvote/:id").post(this.postCtrl.downVotesHandler);
  }
}
