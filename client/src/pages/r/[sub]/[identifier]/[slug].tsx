import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useSWR from "swr";

import { Post } from "@/src/types";

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

  return <div>POST PAGE</div>;
};

export default PostPage;
