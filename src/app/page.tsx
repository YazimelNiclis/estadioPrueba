import { NextUIProvider } from "@nextui-org/react";
import styles from "./page.module.css";
import MapaML from "./components/maplibre/MapaML";

export default function Home() {
  return (
    <NextUIProvider>
      <main className={styles.main}>
        <MapaML />
      </main>
    </NextUIProvider>
  );
}
