import React, { useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import App from "~/components/App/App";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Settings } from "~/types";
import SignOutButton from "~/components/SignOutButton";
import { useRouter } from "next/router";

export default function AppPage({
  initialSettings,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { session, supabaseClient } = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/auth");
    }
  }, [session]);

  return (
    <div>
      <SignOutButton supabase={supabaseClient} />
      <App initialSettings={initialSettings} id={id ?? 0} />
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createPagesServerClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { access_token } = session;
  const [initialSettings, id]: [Settings, number] = await fetch(
    `${process.env.NEXT_PUBLIC_BE_URL}/settings`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    },
  ).then((response) => response.json());
  return { props: { initialSettings, id } };
};
// satisfies GetServerSideProps<{
//   startingSettings: Settings;
// } | null>;
