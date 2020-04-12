export interface IVote {
  uuid: string;
  upvote: boolean;
}

export interface IPost {
  uuid: string;
  author: string;
  content: string;
  votes?: number;
  comments?: IComment[];
}

export interface IComment {
  uuid: string;
  "post-uuid": string;
  content: string;
  author: string;
  votes?: number;
}
