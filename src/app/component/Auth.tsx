"use client";

// import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export function Auth() {
  //   const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="p-2 bg-blue-500 text-white rounded"
    >
      Google로 로그인
    </button>
  );
}
