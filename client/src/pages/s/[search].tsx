import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Post } from "@/src/types";
import PostCard from "@/src/components/PostCard";

const Search = () => {
  const router = useRouter();
  const searchTerm = router.query.search;
  const { data: postList, error: postListError } =
    useSWR<Post[]>(`/posts/postlist`);
  let searchedList = undefined;

  if (!searchTerm) return <div className="p-30">Loading</div>;

  return (
    <>
      <div className="bg-gray-50">
        <div className="flex max-w-5xl px-4 pt-5 mx-auto">
          <div className="w-full md:mr-2 md:w-10/12">
            <div className="text-mint font-bold mb-10">Search Result</div>
            <div>
              {postList
                ?.filter((val) => {
                  if (
                    val?.body
                      .toLowerCase()
                      .includes(searchTerm.toString().toLowerCase())
                  ) {
                    return val;
                  }
                })
                .map((p) => (
                  <PostCard key={p.identifier} post={p} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
