import { NextUIProvider } from "@nextui-org/react";
import styles from "./page.module.css";
import EstadioYazi from "./components/EstadioYazi";
import Mapa from "./components/mapbox/Mapa";

export default function Home() {
  return (
    <NextUIProvider>
      <main className={styles.main}>
        {/* TODO: descomentar */}
        {/*  <EstadioYazi /> */}
        <Mapa />
      </main>
    </NextUIProvider>
  );
}
