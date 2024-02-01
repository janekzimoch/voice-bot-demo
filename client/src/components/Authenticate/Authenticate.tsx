import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Image from "next/image";
import logo from "/public/11x-logo.png";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const brandColor = "#52ab98";
const brandAccentColor = "#c8d8e4";

export default function Authenticate() {
  const supabase = useSupabaseClient();

  return (
    <div className="flex h-[calc(100vh-0px)] items-center justify-center">
      <div className="min-w-[400px] rounded-[20px] bg-prm-green/10 px-20 py-10 drop-shadow-sm">
        <span className="mb-5 flex items-center drop-shadow-sm">
          <Image src={logo} className="mr-3 h-5 w-5" alt="pdfGPT" />
          <p>Sign in to the sales associate service </p>
        </span>
        <Auth
          supabaseClient={supabase}
          redirectTo={process.env.NEXT_PUBLIC_CLIENT_ROOT_URL}
          providers={[]}
          appearance={{
            theme: ThemeSupa,
            extend: true,
            variables: {
              default: {
                colors: {
                  brand: brandColor,
                  brandAccent: brandAccentColor,
                },
              },
            },
            style: {
              button: {
                borderRadius: "10px",
              },
              container: {},
              anchor: {},
              divider: {},
              label: {},
              input: { backgroundColor: "white", borderRadius: "10px" },
              loader: {},
              message: {},
            },
          }}
        />
      </div>
    </div>
  );
}
