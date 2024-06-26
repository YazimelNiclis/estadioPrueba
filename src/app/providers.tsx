"use client";

import store from "@/store/store";
import { NextUIProvider } from "@nextui-org/react";
import { Provider as ReduxProvider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <NextUIProvider>{children}</NextUIProvider>
    </ReduxProvider>
  );
}
