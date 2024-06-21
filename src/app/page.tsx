import { NextUIProvider } from "@nextui-org/react";
import styles from "./page.module.css";
import MapaML from "./components/maplibre/MapaML";
import Map from "./components/maplibre/Map";
import MapRaw from "./components/maplibre/MapaRaw";

export default function Home() {
  return (
    <NextUIProvider>
      <main className={styles.main}>
        {/* <MapaML /> */}
        <Map />
        {/* <MapRaw /> */}
      </main>
    </NextUIProvider>
  );
}
