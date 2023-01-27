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
    // fetcher
  );

  return <div>POST PAGE</div>;
};

export default PostPage;
