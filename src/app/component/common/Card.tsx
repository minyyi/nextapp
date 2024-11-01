"use client";
import React, { useState, useEffect } from "react";
import * as FcIcons from "react-icons/fc";
import * as SlIcons from "react-icons/sl";
import { IconType } from "react-icons";
import { FcBarChart } from "react-icons/fc";
import LoginModal from "./LoginModal";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

const IconComponents = { ...FcIcons, ...SlIcons, ...FcBarChart };

type CardProps = {
  icon: string;
  title: string;
  desc: string;
  button: string;
  path: string;
};

const Card: React.FC<CardProps> = ({ icon, title, desc, button, path }) => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const IconComponent = IconComponents[icon as keyof typeof IconComponents] as
    | IconType
    | undefined;

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setShowModal(true);
    } else {
      router.push(path);
    }
  };

  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full flex flex-col hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col p-6 gap-2">
          <div className="flex flex-col p-4 pl-0">
            {IconComponent && <IconComponent size={36} />}
          </div>
          <h3 className="font-semibold tracking-tight text-xl mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{desc}</p>
        </div>
        <div
          onClick={handleClick}
          className="p-2 h-14 mt-auto bg-slate-200 flex items-center justify-center cursor-pointer"
        >
          <button className="w-full items-center justify-center">
            {button}
          </button>
        </div>
      </div>

      <LoginModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        redirectPath={path}
      />
    </>
  );
};

export default Card;
