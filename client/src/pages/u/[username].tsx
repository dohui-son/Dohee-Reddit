import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

const UserPage = () => {
  const router = useRouter();
  const username = router.query.username;
  const { data, error } = useSWR(username ? `/users/${username}` : null);

  console.log(data);

  return <></>;
};

export default UserPage;
