import { type AppType } from "next/dist/shared/lib/utils";
import { Outfit } from "next/font/google";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useState } from "react";

import "~/styles/globals.css";
import { AppProps } from "next/app";

const outfit = Outfit({ subsets: ["latin"] });

export default function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <div className={`${outfit.className} h-screen overflow-x-hidden`}>
        <Component {...pageProps} />
      </div>
    </SessionContextProvider>
  );
}
