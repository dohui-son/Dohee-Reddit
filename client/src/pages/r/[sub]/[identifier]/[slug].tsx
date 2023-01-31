import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useSWR, { mutate } from "swr";

import { Post, Comment } from "@/src/types";
import Link from "next/link";
import dayjs from "dayjs";
import { useAuthState } from "@/src/context/auth";
import classNames from "classnames";

const PostPage = () => {
  const { authenticated, user } = useAuthState();
  const router = useRouter();
  const { identifier, sub, slug } = router.query;
  const [newComment, setNewComment] = useState("");
  //NOTE: fetcher - _app 에서 SWRConfig로 fetcher를 처리해줬기때문에 모든 컴포넌트의 useSWR에 fetcher 넣어주지 않아도 됨
  const {
    data: post,
    mutate: postMutate,
    error,
  } = useSWR<Post>(identifier && slug ? `/posts/${identifier}/${slug}` : null);
  const { data: comments, mutate: commentMutate } = useSWR<Comment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
  );
  const { data: wholePosts, error: wholePostError } = useSWR<Post>(``);

  //NOTE: fetcher - _app 에서 SWRConfig로 fetcher를 처리해줬기때문에 모든 컴포넌트의 useSWR에 fetcher 넣어주지 않아도 됨
  //   const fetcher = async (url: string) => {
  //     try {
  //       const res = await axios.get(url);
  //       return res.data;
  //     } catch (error: any) {
  //       throw error.response.data;
  //     }
  //   };

  // [Comment - create]: 댓글 작성
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (newComment.trim() === "" || !post) return;

    try {
      const res = await axios.post(
        `/posts/${post.identifier}/${post.slug}/comments`,
        {
          body: newComment,
        }
      );
      commentMutate();

      setNewComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const vote = async (value: number, comment?: Comment) => {
    if (!authenticated) router.push("/login");

    // 이미 클릭한 vote를 다시 누른 경우: reset
    if (
      (!comment && value === post?.userVote) ||
      (comment && comment.userVote === value)
    ) {
      value = 0;
    }

    try {
      const res = await axios.post("/votes", {
        identifier,
        slug,
        commentIdentifier: comment?.identifier,
        value,
      });

      postMutate();
      commentMutate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex max-w-5xl px-10 pt-5 mx-auto">
      <div className="w-full md:mr-3 md:w-9/12">
        <div className="bg-white rounded">
          {post && (
            <>
              <div className="flex">
                {/* Good Bad */}
                <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                  <div
                    className={classNames(
                      "flex justify-center w-6 mx-auto text-gray-400 rounded-full cursor-pointer hover:bg-gray-300 hover:text-red-500",
                      { "bg-blue-200": post.userVote === 1 }
                    )}
                    onClick={() => vote(1)}
                  >
                    😄
                  </div>
                  <p className="text-xs font-bold text-gray-400">
                    {post.voteScore}
                  </p>
                  <div
                    className={classNames(
                      "flex justify-center w-6 mx-auto text-gray-400 rounded-full cursor-pointer hover:bg-gray-300 hover:text-red-500",
                      { "bg-red-200": post.userVote === -1 }
                    )}
                    onClick={() => vote(-1)}
                  >
                    😢
                  </div>
                </div>
                <div className="py-2 pr-2">
                  <div className="flex items-center">
                    <p className="text-xs test-gray-400">
                      Posted by
                      <Link
                        href={`/u/${post.username}`}
                        className="mx-1 hover:underline"
                      >
                        {post.username}
                      </Link>
                      <Link href={post.url} className="mx-1 hover:underline">
                        {dayjs(post.createdAt).format("YYY-MM-DD HH:mm")}
                      </Link>
                    </p>
                  </div>
                  <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                  <p className="my-3 text-sm">{post.body}</p>
                  <div className="text-mint mt-20">
                    <i className="mr-5 fas fa-comment-alt fa-s text-mint"></i>
                    <span className="font-bold">Comments</span>
                  </div>
                </div>
              </div>

              <div className="pr-6 mb-4">
                {authenticated ? (
                  <div>
                    <p className="mb-1 text-xs">
                      <Link
                        href={`/u/${user?.username}`}
                        className="font-semibold text-blue-400"
                      >
                        {user?.username}
                      </Link>{" "}
                      님의 댓글 작성
                    </p>
                    <form onSubmit={handleSubmit}>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                        onChange={(e) => setNewComment(e.target.value)}
                        value={newComment}
                      ></textarea>
                      <div className="flex justify-end">
                        <button
                          className="px-3 py-1 text-gray-300 border border-gray-300 rounded hover:text-white hover:bg-mint"
                          disabled={newComment.trim() === ""}
                        >
                          댓글 작성
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                    <Link
                      className="font-semibold text-pblue hover:text-mint"
                      href={`/login`}
                    >
                      댓글 작성을 위해 로그인해주세요.
                    </Link>
                  </div>
                )}
              </div>
              {/* comment list */}
              {comments?.map((comment) => (
                <div className="flex" key={comment.identifier}>
                  {/* good bad */}
                  <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                    <div
                      className="flex justify-center w-6 mx-auto text-gray-400 rounded-full cursor-pointer hover:bg-gray-300 hover:text-blue-500"
                      onClick={() => vote(1, comment)}
                    >
                      <i
                        className={classNames("fas fa-arrow-up", {
                          "text-blue-500": comment.userVote === 1,
                        })}
                      ></i>
                    </div>
                    <p className="text-xs font-bold text-gray-400">
                      {comment.voteScore}
                    </p>
                    <div
                      className="flex justify-center w-6 mx-auto text-gray-400 rounded-full cursor-pointer hover:bg-gray-300 hover:text-red-500"
                      onClick={() => vote(-1, comment)}
                    >
                      <i
                        className={classNames("fas fa-arrow-down", {
                          "text-red-500": comment.userVote === -1,
                        })}
                      ></i>
                    </div>
                  </div>

                  <div className="py-4 pr-2">
                    <p className="mb-1 text-xs leading-none">
                      <Link
                        href={`/u/${comment.username}`}
                        className="mr-1 font-bold text-gray-400 hover:underline"
                      >
                        {comment.username}
                      </Link>
                      <span className="text-gray-300">
                        {`${comment.voteScore} 
                        posts
                        ${dayjs(comment.createdAt).format("YYY-MM-DD HH:mm")}
                        `}
                      </span>
                    </p>
                    <p>{comment.body}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
