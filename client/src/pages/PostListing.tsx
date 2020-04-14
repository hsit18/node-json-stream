import React, { useEffect, useState } from "react";

import Post from '../components/Post';
import { IPost } from "../interfaces";

import "./style.css";

const API_ENDPOINT = 'http://localhost:3001';

const PostListing = (): JSX.Element => {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    getPostsFromAPI();
  }, []);

  const getPostsFromAPI = () => {
    fetch(`${API_ENDPOINT}/top`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json()).then(res => {
      console.log(res);
      if (res && res.length > 0) {
        setPosts(res);
      }
    });
  }

  const onUpVote = (id: string) => {
    fetch(`${API_ENDPOINT}/upvote/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json()).then(res => {
      console.log(res);
      getPostsFromAPI();
    });
  }

  const onDownVote = (id: string) => {
    fetch(`${API_ENDPOINT}/downvote/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json()).then(res => {
      getPostsFromAPI();
    });
  }
  return (
    <div className="post-container" data-testid="post-list">
      {posts.map(p => <Post key={p.uuid} post={p} onDownVote={onDownVote} onUpVote={onUpVote} />)}
    </div>
  );
};

export default PostListing;
