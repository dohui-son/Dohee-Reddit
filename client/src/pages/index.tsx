import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      <div className="w-full md:mr-3 md:w-8/12">포스트리스트</div>

      {/* 사이드바 */}
      <div className="hidden w-4/12 ml-3 md:block">
        <div className="bg-white border rounded">
          <div className="p-4 border-b">
            <p className="text-lg font-semibold text-centered">인기 커뮤니티</p>
          </div>
          {/* 커뮤니티목록 */}
          <div></div>

          <div className="w-full py-6 text-center">
            <Link
              href="/subs/create"
              className="w-full p-2 text-center text-white bg-gray-400 rounded"
            >
              커뮤니티 만들기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
