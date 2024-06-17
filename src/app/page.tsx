import { NextUIProvider } from "@nextui-org/react";
import styles from "./page.module.css";
//import EstadioFiber from "./components/EstadioFiber";
import EstadioQGIS from "./components/EstadioQGIS";

export default function Home() {
  return (
    <NextUIProvider>
      <main className={styles.main}>
        <EstadioQGIS />
      </main>
    </NextUIProvider>
  );
}
