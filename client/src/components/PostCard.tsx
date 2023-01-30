import React from "react";
import { Post } from "../types";
import classNames from "classnames";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";

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
          😄
        </div>
        <p className="text-xs font-bold text-gray-400">{voteScore}</p>
        <div
          className="flex justify-center w-6 mx-auto text-gray-400 rounded-full cursor-pointer hover:bg-gray-300 hover:text-red-500"
          //   onClick={() => vote(-1, comment)}
        >
          🥲
        </div>
      </div>
      {/* POST DATA */}
      <div className="w-full p-2">
        {/* <div className="flex items-center">
          <Link href={`/r/${subName}`}>
            <Image
              src={sub!.imageUrl}
              alt="sub"
              className="rounded-full cursor-pointer"
              width={12}
              height={12}
            />
          </Link>
          <Link
            href={`/r/${subName}`}
            className="ml-2 text-xs font-bold cursor-pointer hover:underline"
          >
            {subName}
          </Link>
          <span className="mx-1 text-xs text-gray-400">·</span>
        </div> */}
        <p className="text-xs text-gray-400">
          {" "}
          Posted by{" "}
          <Link href={`/r/${username}`} className="mx-1 hover:underline">
            ${username}
          </Link>
          {dayjs(createdAt).format("YYYY-MM-DD HH:mm")}
        </p>
        <Link href={url} className="my-1 text-lg font-medium">
          {title}
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}
        <div className="flex">
          <Link href={url}>
            <span>{commentCount}</span>
          </Link>
        </div>{" "}
      </div>
    </div>
  );
};

export default PostCard;
