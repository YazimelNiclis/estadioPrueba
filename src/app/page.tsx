import { NextUIProvider } from "@nextui-org/react";
import styles from "./page.module.css";
import EstadioYazi from "./components/EstadioYazi";

export default function Home() {
  return (
    <NextUIProvider>
      <main className={styles.main}>
        <EstadioYazi />
      </main>
    </NextUIProvider>
  );
}
