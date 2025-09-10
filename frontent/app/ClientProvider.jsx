"use client";

import ReduxProviderWrapper from "./redux/Provider/ReduxProviderWrapper";

export default function ClientProvider({ children }) {
  return <ReduxProviderWrapper>{children}</ReduxProviderWrapper>;
}
