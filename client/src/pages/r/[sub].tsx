import axios from "axios";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import Image from "next/image";
import useSWR from "swr";

const SubPage = () => {
  const router = useRouter();
  const subName = router.query.sub;

  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  const { data: sub, error } = useSWR(
    subName ? `/subs/${subName}` : null,
    fetcher
  );

  console.log(sub);

  return (
    <>
      {sub && (
        <>
          <div>
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
                ></div>
              ) : (
                <div className="h-20 bg-gray-200"></div>
              )}
              <div className="h-20 bg-white-200">
                <div className="relative flex max-w-5xl px-5 mx-auto">
                  <div className="absolute" style={{ top: -15 }}>
                    {sub.imageUrl && (
                      <Image
                        src={sub.imageUrl}
                        alt="community image"
                        width={70}
                        height={70}
                        className="rounded-full"
                      />
                    )}
                  </div>
                  <div className="pt-1 pl-24">
                    <div className="flex items-center">
                      <h1 className="text-3xl font-bold">{sub.title}</h1>
                    </div>
                    <p className="text-small font-bold text-gray-400">
                      {sub.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SubPage;
