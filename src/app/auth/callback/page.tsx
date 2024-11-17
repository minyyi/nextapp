"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log(session);
        if (session && redirectPath) {
          router.push(redirectPath);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error:", error);
        router.push("/");
      }
    };

    handleCallback();
  }, [router, redirectPath]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-xl"> 잠시만 기다려 주세요.</p>
        <p className="text-xl"> 로그인 처리 중...</p>
      </div>
    </div>
  );
}
