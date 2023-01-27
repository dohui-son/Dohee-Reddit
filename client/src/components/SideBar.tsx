import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import { useAuthState } from "../context/auth";
import { Sub } from "../types";
type Props = {
  sub: Sub;
};

const SideBar = ({ sub }: Props) => {
  const { authenticated } = useAuthState();
  return (
    <div className="hidden w-4/12 ml-3 md:block">
      <div className="bg-white border rounded">
        <div className="p-3 bg-gray-300 rounded-t">
          <p className="font-semibold text-white">Introduction</p>
        </div>
        <div className="p-3 text-gray-500">
          <p className="mb-3 text-base">{sub?.description}</p>
          <div className="flex mb-3 text-sm font-medium ">
            <div className="w-1/2">
              <p>100</p>
              <p>멤버</p>
            </div>
          </div>
          <p className="my-3">
            <i className="mr-2 fas fa-birthday-cake"></i>
            {dayjs(sub?.createdAt).format("D MMM YYYY")}
          </p>
          {authenticated && (
            <div className="mx-0 my-2">
              <Link
                href={`/r/${sub.name}/create`}
                className="w-full p-2 text-sm text-gray-400 border border-gray-300 rounded hover:border-gray-700"
              >
                포스트 작성
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
