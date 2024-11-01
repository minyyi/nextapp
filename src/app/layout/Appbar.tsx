"use client";
import { useCardStore } from "../store/useCardStore";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Appbar = () => {
  const cards = useCardStore((state: any) => state.cards);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // 현재 세션 체크
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getSession();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="h-16 border-b shadow-md sticky top-0 bg-white z-50">
      <div className="h-full px-10 flex justify-between">
        <div className="flex items-center space-x-8 hover:cursor-pointer hover:text-[#808080]">
          <Link href="/">
            <p className="font-bold text-3xl tracking-wider text-center">
              Paytrack
            </p>
          </Link>
        </div>
        <div className="flex items-center space-x-8 text-center">
          {user ? (
            // 로그인 상태일 때의 메뉴
            <>
              {cards.map((card: any) => (
                <Link key={card.title} href={card.path}>
                  <p className="text-md hover:cursor-pointer hover:text-[#808080] hover:opacity-100">
                    {card?.appTitle}
                  </p>
                </Link>
              ))}
              <p
                onClick={handleSignOut}
                className="text-md hover:cursor-pointer hover:text-[#808080] hover:opacity-100"
              >
                로그아웃
              </p>
            </>
          ) : (
            // 로그인하지 않은 상태일 때 Google 로그인 버튼
            <button
              onClick={handleGoogleLogin}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md 
                       bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google 로그인</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appbar;
