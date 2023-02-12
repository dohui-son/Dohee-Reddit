import React, { useState, FormEvent } from "react";
import { GetServerSideProps } from "next";
import axios from "axios";
import { useRouter } from "next/router";
import { Post } from "@/src/types";

const PostCreate = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const router = useRouter();
  const { sub: subName } = router.query;

  const submitPost = async (e: FormEvent) => {
    e.preventDefault();

    if (title.trim() === "" || !subName || body.trim() === "") return;

    try {
      const { data: post } = await axios.post<Post>("/posts", {
        title: title.trim(),
        body,
        sub: subName,
      });

      router.push(`/r/${subName}/${post.identifier}/${post.slug}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col justify-center pt-16">
      <div className="w-6/12 mx-auto md:w-100">
        <div className="p-4 bg-white rounded">
          <h2 className="mb-3 text lg">새로운 포스트 업로드</h2>
          <form onSubmit={submitPost}>
            <div className="relative mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-non focus:border-blue-300"
                placeholder="Title"
                maxLength={20}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div
                style={{ top: 10, right: 10 }}
                className="absolute mb-2 text-sm text-gray-400 select-none"
              >
                {title.trim().length}/20
              </div>
            </div>
            <textarea
              rows={4}
              placeholder="Description"
              className="w-full p-3  border border-gray-300 rounded focus:outline-non focus:border-blue-300"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="flex justify-end">
              <button className="px-4 py-1 text-sm font-semibold text-gray-400 border border-gray-300 rounded hover:bg-gray-300 hover:text-white">
                업로드
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default PostCreate;

// 권한 없는 유저를 login페이지로 이동
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error("쿠키가 없습니다.");

    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/me`, {
      headers: { cookie },
    });
    return { props: {} };
  } catch (error) {
    res.writeHead(307, { Location: "/login" }).end();
    return { props: {} };
  }
};
