export interface IComment {
  uuid: string;
  "post-uuid": string;
  content: string;
  author: string;
  votes: number;
}

export interface IPost {
  uuid: string;
  author: string;
  content: string;
  votes: number;
  comments?: IComment[];
}
