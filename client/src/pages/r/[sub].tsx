import axios from "axios";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useSWR, { mutate } from "swr";
import { useAuthState } from "@/src/context/auth";
import SideBar from "@/src/components/SideBar";
import PostCard from "@/src/components/PostCard";
import { Post } from "@/src/types";

const SubPage = () => {
  const router = useRouter();
  const subName = router.query.sub;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { authenticated, user } = useAuthState();
  const [ownSub, setOwnSub] = useState(false);
  const {
    data: sub,
    mutate: subMutate,
    error,
  } = useSWR(subName ? `/subs/${subName}` : null);

  useEffect(() => {
    if (!sub || !user) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub]);

  const openFileInput = (type: string) => {
    if (!ownSub) return; // 내가 생성한 커뮤니티가 아니면 배너 및 프로필 이미지 변경 불가

    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.name = type; // type: "banner" or "image"
      fileInput.click();
    }
  };
  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || !fileInputRef.current) return;

    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current.name);

    try {
      await axios.post(`/subs/${sub.name}/upload`, formData, {
        headers: { "Context-Type": "multipart/form-data" },
      });
      subMutate();
      //NOTE: mutate으로 서버에 요청하여 클라이언트에 캐시된 데이터를 갱신, mutate(key)를 호출하여 동일한 키를 사용하는 다른 SWR hook에게 갱신 메시지를 전역으로 브로드캐스팅 가능
    } catch (error) {
      console.log("uploadImage ERROR", error);
    }
  };

  let renderPosts = <p>Welcome</p>;
  if (!sub) {
    renderPosts = <p className="text-lg text-center">Loading</p>;
  } else if (sub.posts.length === 0) {
    <p className="text-lg text-center">작성된 포스트가 없습니다.</p>;
  } else {
    renderPosts = sub.posts.map((post: Post) => (
      <PostCard key={post.identifier} post={post} subMutate={subMutate} />
    ));
  }

  return (
    <>
      {sub && (
        <>
          <div>
            <input
              type="file"
              hidden={true}
              ref={fileInputRef}
              onChange={uploadImage}
            />
            {/* 배너이미지 */}
            <div className="bg-gray-200">
              {sub.bannerUrl ? (
                <div
                  className="h-56"
                  style={{
                    backgroundImage: `url(${sub.bannerUrl})`,
                    backgroundRepeat: `no-repeat`,
                    backgroundSize: `cover`,
                    backgroundPosition: `center`,
                  }}
                  onClick={() => openFileInput("banner")}
                ></div>
              ) : (
                <div
                  className="h-56 bg-gray-200"
                  onClick={() => openFileInput("banner")}
                ></div>
              )}
            </div>
            {/* 커뮤니티 메타 데이터 */}
            <div className="h-20 bg-white-200">
              <div className="relative flex max-w-5xl px-5 mx-auto">
                <div className="absolute" style={{ top: -35 }}>
                  {sub.imageUrl && (
                    <Image
                      src={sub.imageUrl}
                      alt="community image"
                      width={70}
                      height={70}
                      className="rounded-full"
                      onClick={() => openFileInput("image")}
                    />
                  )}
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="text-3xl font-bold text-gray-500">
                      {sub.title}
                    </h1>
                  </div>
                  <p className="text-sm font-bold text-gray-400">{sub.name}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Todo: posts and sidebar */}
          <div className="flex max-w-5xl px-4 pt-5 mx-auto">
            <div className="w-full md:mr-3 md:w-8/12">{renderPosts}</div>
            <SideBar sub={sub} />
          </div>
        </>
      )}
    </>
  );
};

export default SubPage;
