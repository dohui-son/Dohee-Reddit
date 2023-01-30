import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import type { NextPage } from "next";
import { Sub, Post } from "../types";
import useSWR from "swr";
import axios from "axios";
import { useAuthState } from "../context/auth";
import useSWRInfinite from "swr/infinite";
import PostCard from "../components/PostCard";

const Home: NextPage = () => {
  const fetcher = async (url: string) => {
    return await axios.get(url).then((res) => res.data);
  };
  const address = "http://localhost:4000/api/subs/sub/topSubs";
  const { data: topSubs } = useSWR<Sub[]>(address, fetcher);
  const { authenticated } = useAuthState();

  // [Infinite Scroll]
  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/posts?page=${pageIndex}`;
  };
  const {
    data,
    error,
    size: page,
    setSize: setPage,
    isValidating,
    mutate,
  } = useSWRInfinite<Post[]>(getKey);
  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : [];

  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      {/* 포스트리스트 */}
      <div className="w-full md:mr-3 md:w-8/12">
        {" "}
        {isInitialLoading && <p className="text-lg text-center"> LOADING...</p>}
        {posts?.map((post) => (
          <PostCard key={post.identifier} post={post} />
        ))}
      </div>

      {/* 사이드바 */}
      <div className="hidden w-4/12 ml-3 md:block">
        <div className="bg-white border rounded">
          <div className="p-4 border-b">
            <p className="text-lg text-gray-400 font-semibold text-center">
              인기 커뮤니티
            </p>
          </div>
          {/* 커뮤니티목록 */}
          <div>
            {topSubs?.map((sub) => (
              <div
                key={sub.name}
                className="flex items-center px-4 py-2 text-xs border-b"
              >
                <Link href={`/r/${sub.name}`}>
                  <Image
                    src={sub.imageUrl}
                    className="rounded-full cursor-pointer"
                    alt="Sub"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link
                  href={`/r/${sub.name}`}
                  className="ml-2 font-bold hover:cursor-pointer"
                >
                  {/* Todo: 해야할일 */}
                  {sub.name}
                </Link>
                <p className="ml-auto font-med">{sub.postCount}</p>
              </div>
            ))}
          </div>

          <div className="w-full py-6 text-center">
            {authenticated && (
              <Link
                href="/subs/create"
                className="w-full p-2 text-center text-sm text-gray-400 border border-gray-300 rounded hover:border-gray-700"
              >
                커뮤니티 생성👥
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
