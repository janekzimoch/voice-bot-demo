import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Authenticate from "~/components/Authenticate/Authenticate";

export default function Auth() {
  const { session } = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/app");
    }
  }, [session]);

  return (
    <div>
      <Authenticate />
    </div>
  );
}
