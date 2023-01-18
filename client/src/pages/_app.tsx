import "../styles/globals.css";
import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import Axios from "axios";

export default function App({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api"; // NEXT_PUBLIC_SERVER_BASE_URL는 NEXT JS 환경변수
  return <Component {...pageProps} />;
}
