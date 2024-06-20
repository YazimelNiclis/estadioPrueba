import { NextUIProvider } from "@nextui-org/react";
import styles from "./page.module.css";
import { EstadioQGIS } from "./components/EstadioQGIS";
import { EstadioMapLibre } from "./components/EstadioMapLibre";

export default function Home() {
  return (
    <NextUIProvider>
      <main className={styles.main}>
        <EstadioMapLibre />
      </main>
    </NextUIProvider>
  );
}
