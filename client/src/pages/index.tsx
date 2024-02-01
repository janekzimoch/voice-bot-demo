import React, { useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function Home() {
  const { session } = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/app");
    } else {
      router.push("/auth");
    }
  }, [session]);

  return <div></div>;
}
