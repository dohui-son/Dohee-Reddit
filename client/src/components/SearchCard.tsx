import React from "react";
import { Post } from "../types";
import classNames from "classnames";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { useAuthState } from "../context/auth";
import Router from "next/router";
import axios from "axios";
import { useRouter } from "next/router";
import Logo from "../assets/lounge_sq_b.png";

type PostcardProps = {
  post: Post;
  subMutate?: () => void;
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
  subMutate,
}: PostcardProps) => {
  const router = useRouter();

  return (
    <div className="flex mb-7 bg-white rounded">
      <div className="flex-shrink-0 bg-gradient-to-r from-mint300 to-pblue300 w-10 py-2 text-center rounded-l"></div>
      <div
        className="w-full p-2 cursor-pointer"
        onClick={() => {
          router.push(url);
        }}
      >
        <div className="w-full flex items-center">
          <Link href={`/r/${subName}`}>
            <Image
              src={Logo}
              alt="sub"
              className="rounded-full cursor-pointer"
              width={20}
              height={20}
            />
          </Link>
          <Link
            href={`/r/${subName}`}
            className="ml-2 text-xs font-bold cursor-pointer hover:underline"
          >
            {subName}
          </Link>
          <span className="mx-1 text-xs text-gray-400">·</span>
        </div>

        <p
          className="text-xs text-gray-400"
          onClick={() => {
            router.push(`/r/${username}`);
          }}
        >
          <Link href={`/r/${username}`} className="mx-1 hover:underline">
            Posted by {username}
          </Link>
          {dayjs(createdAt).format("YYYY-MM-DD HH:mm")}
        </p>
        <hr />
        <Link href={url} className="my-1 text-lg font-medium">
          {title}
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}
        <div className="flex text-gray-400">
          <Link href={url}>
            <i className="mr-1 fas fa-comment-alt fa-xs"></i>
            <span> {commentCount}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
