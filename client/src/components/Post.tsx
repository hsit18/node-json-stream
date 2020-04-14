import React from "react";

import { IPost } from "../interfaces";

import VoteSvg from './VoteSvg';
import "./style.css";

interface Props {
  post: IPost,
  onUpVote: any,
  onDownVote: any
}
const Post: React.FC<Props> = ({
  post: { uuid, author, content, votes, comments },
  onUpVote,
  onDownVote,
}): JSX.Element => {

  const onClickUpVote = () => {
    onUpVote(uuid);
  }

  const onClickDownVote = () => {
    onDownVote(uuid);
  }

  return (
    <div className="post-wrapper">
      <h2>{author}</h2>
      <p>{content}</p>
      <div className="vote-wrapper">
        <VoteSvg className="svg-icon" onClick={onClickUpVote} />
        <VoteSvg className="svg-icon down" onClick={onClickDownVote} />
        <span>{votes}</span>
      </div>
      {comments && comments.map(c => <Post key={c.uuid} post={c} onUpVote={onUpVote}
        onDownVote={onDownVote} />)}
    </div>
  );
};

export default Post;
