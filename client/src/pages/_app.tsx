import "../styles/globals.css";
import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import Axios from "axios";
import { AuthProvider } from "../context/auth";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import { SWRConfig } from "swr";
import Head from "next/head";
import Script from "next/script";

import { useAuthState } from "@/src/context/auth";

export default function App({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api"; // NEXT_PUBLIC_SERVER_BASE_URL는 NEXT JS 환경변수
  Axios.defaults.withCredentials = true;

  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);

  const { isTutoring } = useAuthState();

  // 컴포넌트당 일일이 fetcher 작성할 필요 없음
  const fetcher = async (url: string) => {
    try {
      const res = await Axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  return (
    <>
      <Script
        defer
        src="https://use.fontawesome.com/releases/v5.15.4/js/all.js"
        integrity="sha384-rOA1PnstxnOBLzCLMcre8ybwbTmemjzdNlILg8O7z1lUkLXozs4DHonlDtnE7fpc"
        crossOrigin="anonymous"
      ></Script>

      <SWRConfig value={{ fetcher }}>
        <AuthProvider>
          {!authRoute && <NavBar />}
          <div className={authRoute ? "" : "pt-16 min-h-screen"}>
            <Component {...pageProps} />
          </div>
        </AuthProvider>
      </SWRConfig>
    </>
  );
}
