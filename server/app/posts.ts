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

/*
 * Scan votes.json file to calculate votes for posts and comments
 */
export const processVotes = () => {
  allVotesById = {};
  jsonParsed = false;
  const stream = fs.createReadStream(
      path.join(__dirname, "../../../data/votes.json"),
      { encoding: "utf8" }
    ),
    parser = JSONStream.parse("*");

  stream.pipe(parser);

  parser.on("data", (voteObj: IVote) => {
    addVotesById(voteObj);
  });

  parser.on("end", () => {
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
};

/*
 * API method to get top posts
 */
export const getTopPosts = (req: Request, res: Response): void => {
  if (!checkJsonParsed(req, res)) {
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
};

/*
 * API method to add votes for posts and comments
 */
export const upVotesHandler = (req: Request, res: Response) => {
  if (!checkJsonParsed(req, res)) {
    return;
  }

  const status = updatesVotes(req.params.id, (voteObj) => {
    return voteObj.votes + 1;
  });
  console.log(req.params.id, status);

  if (status) {
    return res.status(200).json("votes incremented successfully.");
  }
  return res.status(400).json("unknown uuid");
};

/*
 * API method to down votes for posts and comments
 */
export const downVotesHandler = (req: Request, res: Response) => {
  if (!checkJsonParsed(req, res)) {
    return;
  }
  const status = updatesVotes(req.params.id, (voteObj) => {
    return voteObj.votes > 0 ? voteObj.votes - 1 : 0;
  });
  if (status) {
    return res.status(200).json("votes decremented successfully.");
  }
  return res.status(400).json("unknown uuid");
};

const updatesVotes = (voteId: string, getVote: any) => {
  const postObj = allPosts.find((p) => p.uuid === voteId);
  if (postObj) {
    const remainingPosts = allPosts.filter((p) => p.uuid !== voteId);
    allPosts = [...remainingPosts, { ...postObj, votes: getVote(postObj) }];
    return true;
  } else {
    const commentObj = allComments.find((c) => c.uuid === voteId);
    if (commentObj) {
      const remainingComments = allComments.filter((c) => c.uuid !== voteId);
      allComments = [
        ...remainingComments,
        { ...commentObj, votes: getVote(commentObj) },
      ];
      delete commentsByPostId[commentObj["post-uuid"]];
      return true;
    }

    return false;
  }
};

const addVotesById = (voteObj: IVote) => {
  if (!allVotesById[voteObj.uuid]) {
    allVotesById[voteObj.uuid] = 0;
  }
  if (voteObj.upvote) {
    allVotesById[voteObj.uuid] += 1;
  }
};

const checkJsonParsed = (req: Request, res: Response) => {
  if (!jsonParsed) {
    res.status(200).json({
      status: false,
      message: "please wait while parsing...",
    });
    return false;
  }
  return true;
};
