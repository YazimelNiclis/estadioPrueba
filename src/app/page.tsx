import { NextUIProvider } from "@nextui-org/react";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <Link href="/estadio">
        <h1 className="underline hover:text-gray-400">Go to estadio</h1>
      </Link>
    </main>
  );
}
