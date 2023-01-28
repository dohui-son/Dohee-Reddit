import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useSWR from "swr";

import { Post } from "@/src/types";
import Link from "next/link";
import dayjs from "dayjs";

const PostPage = () => {
  const router = useRouter();
  const { identifier, sub, slug } = router.query;

  //   const fetcher = async (url: string) => {
  //     try {
  //       const res = await axios.get(url);
  //       return res.data;
  //     } catch (error: any) {
  //       throw error.response.data;
  //     }
  //   };

  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
    // fetcher : _app 에서 SWRConfig로 fetcher를 처리해줬기때문에 모든 컴포넌트의 useSWR에 fetcher 넣어주지 않아도 됨
  );
  console.log(post);

  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      <div className="w-full md:mr-3 md:w-9/12">
        <div className="bg-white rounded">
          {post && (
            <>
              <div className="flex">
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
                  <div className="flex">
                    <button>
                      <i className="mr-1 fas fa-comment-alt fa-xs">임시버튼</i>
                      <span className="font-bold">{post.commentCount}</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
