import axios from "axios";
import React, { useState } from "react";
import { GetServerSideProps } from "next";

const PostCreate = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  return (
    <div className="flex flex-col justify-center pt-16">
      <div className="w-6/12 mx-auto md:w-100">
        <div className="p-4 bg-white rounded">
          <h2 className="mb-3 text lg">새로운 포스트 업로드</h2>
          <form>
            <div className="relative mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-non focus:border-blue-300"
                placeholder="Title"
                maxLength={20}
              />
              <div
                style={{ top: 10, right: 10 }}
                className="absolute mb-2 text-sm text-gray-400 select-none"
              >
                임시/20
              </div>
            </div>
            <textarea
              rows={4}
              placeholder="Description"
              className="w-full p-3  border border-gray-300 rounded focus:outline-non focus:border-blue-300"
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error("쿠키가 없습니다.");

    await axios.get("/auth/me", { headers: { cookie } });
    return { props: {} };
  } catch (error) {
    res.writeHead(307, { Location: "/login" }).end();
    return { props: {} };
  }
};
