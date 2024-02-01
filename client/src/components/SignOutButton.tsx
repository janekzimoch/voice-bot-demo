import React, { use } from "react";
import {
  useSupabaseClient,
  SupabaseClient,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function Button({ supabase }: { supabase: SupabaseClient }) {
  const router = useRouter();
  const handleSignOut = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await supabase.auth.signOut();
    router.push("/");
    // window.location.reload();
  };
  return (
    <div className="absolute left-8 top-4">
      <button
        onClick={handleSignOut}
        className="block cursor-pointer items-center overflow-hidden rounded-full border-[2px] border-solid  border-prm-green bg-prm-white px-6 py-[6px] text-sm font-normal tracking-wider text-prm-green  drop-shadow-md  transition-all hover:bg-prm-green/20"
      >
        <div className="flex flex-row items-center justify-center">
          <p>Sign Out</p>
        </div>
      </button>
    </div>
  );
}
