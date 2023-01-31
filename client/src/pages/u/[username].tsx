import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import PostCard from "@/src/components/PostCard";
import { Post, Comment } from "@/src/types";
import Image from "next/image";
import Sqlogo from "../../assets/lounge_sq_b.png";

const UserPage = () => {
  const router = useRouter();
  const username = router.query.username;
  const { data, error } = useSWR(username ? `/users/${username}` : null);

  console.log(data);

  if (!data) return null;
  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto bg-gray-50">
      {/* user post comment list*/}
      <div className="w-full md:mr-3 md:w-8/12">
        {data.userData.map((data: any) => {
          if (data.type === "Post") {
            const post: Post = data;
            return <PostCard key={post.identifier} post={post} />;
          } else {
            const comment: Comment = data;
            return (
              <div
                key={comment.identifier}
                className="flex my-4 bg-white rounded cursor-pointer"
                onClick={() => {
                  router.push(`/${comment.post?.url}`);
                }}
              >
                <div className="flex-shrink-0 w-10 py-10 text-center bg-gray-200 rounded-l">
                  🗣️
                </div>
                <div className="w-full p-2 ">
                  <span className="mb-2 text-s text-gray-400 font-semibold">
                    {comment.username} commented on {comment.post?.title}
                  </span>

                  <hr />
                  <span className="p-1 font-semibold text-gray-500">
                    {comment.body}
                  </span>
                </div>
              </div>
            );
          }
        })}
      </div>
      {/* user data */}
      <div className="hidden w-4/12 ml-3 md:block">
        <div className="flex items-center p-3 bg-mint200 rounded-t">
          <Image
            src={Sqlogo}
            alt="user profile"
            className="mx-auto "
            width={60}
            height={60}
          />
        </div>
        <div className="bg-white p-7 height-10 text-gray-500 font-semibold">
          <Image
            src="https://www.gravatar.com/avatar?d=mp&f=y"
            alt="user profile"
            className="mx-auto border border-gray rounded-full"
            width={40}
            height={40}
          />
          <p className="text-gray-400">User Name</p>
          <p>{data.user.username}</p>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
