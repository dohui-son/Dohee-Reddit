import React from "react";
import { Post } from "../types";
type PostcardProps = {
  post: Post;
};

const PostCard = ({
  post: {
    identifier,
    slug,
    title,
    body,
    subName,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    username,
    sub,
  },
}: PostcardProps) => {
  return <></>;
};

export default PostCard;
