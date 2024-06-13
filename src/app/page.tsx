import { NextUIProvider } from "@nextui-org/react";
import Estadio from "./components/Estadio";
import styles from "./page.module.css";

export default function Home() {
  return (
    <NextUIProvider>
      <main className={styles.main}>
        <Estadio />
      </main>
    </NextUIProvider>
  );
}
