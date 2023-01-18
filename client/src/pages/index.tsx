import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      INDEX
      <h1 className="text-3xl font-bold uderline">Hello</h1>
    </div>
  );
}
