import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
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
    subName ? `/sub/${subName}` : null,
    fetcher
  );

  return <h1>SUBPAGE</h1>;
};

export default SubPage;
