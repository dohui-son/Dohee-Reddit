import React from "react";
import { Post } from "../types";
import classNames from "classnames";

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
  return (
    <div className="flex mb-4 bg-white rounded" id={identifier}>
      POSTCARD
      <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
        <div
          className="flex justify-center w-6 mx-auto text-gray-400 rounded-full cursor-pointer hover:bg-gray-300 hover:text-blue-500"
          //   onClick={() => vote(1, comment)}
        >
          <i
            className={classNames("fas fa-arrow-up", {
              "text-blue-500": userVote === 1,
            })}
          ></i>
        </div>
        <p className="text-xs font-bold text-gray-400">{voteScore}</p>
        <div
          className="flex justify-center w-6 mx-auto text-gray-400 rounded-full cursor-pointer hover:bg-gray-300 hover:text-red-500"
          //   onClick={() => vote(-1, comment)}
        >
          <i
            className={classNames("fas fa-arrow-down", {
              "text-red-500": userVote === -1,
            })}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
