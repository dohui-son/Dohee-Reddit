import axios from "axios";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import useSWR from "swr";

const SubPage = () => {
  const router = useRouter();
  const subName = router.query.sub;

  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      console.log(res);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  const { data: sub, error } = useSWR(
    subName ? `/subs/${subName}` : null,
    fetcher
  );

  return <>{sub && 
  <Fragment>
    {/* Sub Detail info and images */}
    <div className={cls("bg-gray-400")}>
        {/* Banner Image */}
        {sub.bannerUrl?(<div className="h-56"
        style={{backgroundImage: `url(${sub.bannerUrl})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center"
        }}
        onClick={()=> openFileInput("banner")}
        ></div>):(
        <div className="h-20 bg-gray-400"></div>)}
    </div>
    {/* Sub meta data */}
    <div className="h-20 bg-white">
<div className="relative flex max-w-5xl px-5 mx-auto">
    <div className="absolute" style={{top:-15}}>
        {sub.imageUrl && (<Image src={sub.imageUrl} alt="" width={70} height={70} onClick={()=> openFileInput("image")} className={cls("rounded-full")}/>)}

    </div>
</div>
    </div>
    
  </Fragment>;
}</>;

export default SubPage;
