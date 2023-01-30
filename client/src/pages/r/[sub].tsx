import axios from "axios";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useSWR, { mutate } from "swr";
import { useAuthState } from "@/src/context/auth";
import SideBar from "@/src/components/SideBar";

const SubPage = () => {
  const router = useRouter();
  const subName = router.query.sub;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { authenticated, user } = useAuthState();
  const [ownSub, setOwnSub] = useState(false);
  const {
    data: sub,
    mutate,
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
      mutate();
    } catch (error) {
      console.log("uploadImage ERROR", error);
    }
  };

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
            <div className="w-full md:mr-3 md:w-10/12"></div>
            <SideBar sub={sub} />
          </div>
        </>
      )}
    </>
  );
};

export default SubPage;
