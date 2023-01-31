import React from "react";
import Link from "next/link";
import { useAuthDispatch, useAuthState } from "../context/auth";
import axios from "axios";
import Image from "next/image";

import Logo from "../assets/lounge_w.png";

const NavBar: React.FC = () => {
  const { loading, authenticated } = useAuthState();
  const dispatch = useAuthDispatch();

  const handleLogout = () => {
    axios
      .post("/auth/logout")
      .then(() => {
        dispatch("LOGOUT");
        window.location.reload(); // Page Refresh
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-16 px-8 bg-white">
      <span className="p-2 text-2xl font-semibold text-gray-400">
        <Link href="/">
          <Image src={Logo} alt="service logo" width={130} height={50} />
        </Link>
      </span>

      <div className="max-w-full px-4">
        <div className="relative flex items-center bg-gray-100 border rounded hover:border-gray-700 hover:bg-white">
          <i className="ml-2 text-gray-400 fas fa-search"></i>
          <input
            type="text"
            placeholder="Search"
            className="px-10 py-1 bg-transparent rounded focus:outline-none"
          />
        </div>
      </div>

      <div className="flex">
        {!loading && authenticated ? (
          <button
            className=" w-20 p-2 text-center  mr-2 text-white bg-gray-300 rounded hover:bg-mint"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className="w-20 p-1.5 mr-2 text-center text-gray-400 border border-gray-500 rounded hover:text-mint hover:border-mint"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="w-20 p-1.5 text-center text-white bg-mint rounded hover:bg-pblue"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
