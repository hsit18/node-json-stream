import path from "path";
import fs from "fs";
import JSONStream from "JSONStream";
import { Request, Response } from "express";

import posts from "../../data/posts.json";
import comments from "../../data/comments.json";

import { IVote, IPost, IComment } from "./index.interface";

let jsonParsed: boolean = false;
let allVotesById: {
  [key: string]: number;
} = {};
let allPosts: IPost[] = [];
let allComments: IComment[] = [];
let commentsByPostId: {
  [key: string]: IComment[];
} = {};

export default class PostController {
  static processVotes() {
    allVotesById = {};
    jsonParsed = false;
    const stream = fs.createReadStream(
        path.join(__dirname, "../../../data/votes.json"),
        { encoding: "utf8" }
      ),
      parser = JSONStream.parse("*");

    stream.pipe(parser);

    parser.on("data", (voteObj: any) => {
      this.setUpVote(voteObj);
    });

    parser.on("end", (voteObj: any) => {
      console.log("parsing end.....");
      if (!(allPosts && allPosts.length > 0)) {
        allPosts = posts.map(
          (p: IPost) =>
            <IPost>{
              ...p,
              votes: allVotesById[p.uuid],
            }
        );
      }
      if (!(allComments && allComments.length > 0)) {
        allComments = comments.map(
          (c: IComment) =>
            <IComment>{
              ...c,
              votes: allVotesById[c.uuid],
            }
        );
      }
      jsonParsed = true;
    });
  }

  static setUpVote(voteObj: any) {
    if (!allVotesById[voteObj.uuid]) {
      allVotesById[voteObj.uuid] = 0;
    }
    if (voteObj.upvote) {
      allVotesById[voteObj.uuid] += 1;
    }
  }

  public getTopPosts(req: Request, res: Response) {
    if (!jsonParsed) {
      res.status(200).json({
        status: false,
        message: "please wait while parsing...",
      });
      return;
    }
    const sortedPost = allPosts.sort((a, b) => b.votes! - a.votes!);

    res.status(200).json(
      sortedPost.slice(0, 10).map((p: IPost) => {
        if (!commentsByPostId[p.uuid]) {
          commentsByPostId[p.uuid] = <IComment[]>(
            allComments.filter((c) => c["post-uuid"] === p.uuid)
          );
        }

        const mappedComments: IComment[] = [...commentsByPostId[p.uuid]].sort(
          (a: IComment, b: IComment) => b.votes! - a.votes!
        );

        return {
          ...p,
          comments: mappedComments.slice(0, 3),
        };
      })
    );
  }

  public upVotesHandler(req: Request, res: Response) {
    if (!jsonParsed) {
      res.status(200).json({
        status: false,
        message: "please wait while parsing...",
      });
      return;
    }
    const postObj = allPosts.find((p) => p.uuid === req.params.id);
    if (postObj) {
      const remainingPosts = allPosts.filter((p) => p.uuid !== req.params.id);
      allPosts = [...remainingPosts, { ...postObj, votes: postObj.votes! + 1 }];
      return res.status(200).json("post votes incremented successfully.");
    } else {
      const commentObj = allComments.find((c) => c.uuid === req.params.id);
      if (commentObj) {
        const remainingComments = allComments.filter(
          (c) => c.uuid !== req.params.id
        );
        allComments = [
          ...remainingComments,
          { ...commentObj, votes: commentObj.votes! + 1 },
        ];
        delete commentsByPostId[commentObj["post-uuid"]];
        return res.status(200).json("comment votes incremented successfully.");
      }

      return res.status(400).json("unknown id");
    }
  }

  public downVotesHandler(req: Request, res: Response) {
    if (!jsonParsed) {
      res.status(200).json({
        status: false,
        message: "please wait while parsing...",
      });
      return;
    }
    console.log(req.params.id);
    const postObj = allPosts.find((p) => p.uuid === req.params.id);
    if (postObj) {
      const remainingPosts = allPosts.filter((p) => p.uuid !== req.params.id);
      allPosts = [
        ...remainingPosts,
        { ...postObj, votes: postObj.votes! > 0 ? postObj.votes! - 1 : 0 },
      ];
      return res.status(200).json("post votes decremented successfully.");
    } else {
      const commentObj = allComments.find((c) => c.uuid === req.params.id);
      if (commentObj) {
        const remainingComments = allComments.filter(
          (c) => c.uuid !== req.params.id
        );
        allComments = [
          ...remainingComments,
          {
            ...commentObj,
            votes: commentObj.votes! > 0 ? commentObj.votes! - 1 : 0,
          },
        ];

        delete commentsByPostId[commentObj["post-uuid"]];

        return res.status(200).json("comments votes decremented successfully.");
      }

      return res.status(400).json("unknown id");
    }
  }
}
